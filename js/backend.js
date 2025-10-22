// Lightweight backend utilities using Supabase (Postgres + Auth)
// Requires a config file that sets window.SUPABASE_URL and window.SUPABASE_ANON_KEY
// Include this file before other page scripts.

(function() {
    let supabaseClient = null;

    function initSupabaseClient() {
        if (supabaseClient) return supabaseClient;
        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
            console.warn('Supabase config not found. Backend calls will be no-ops.');
            return null;
        }
        // Load Supabase library via CDN if not present
        if (!window.supabase) {
            console.warn('Supabase JS not loaded. Please include https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 in HTML.');
            return null;
        }
        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        return supabaseClient;
    }

    async function getClient() {
        return initSupabaseClient();
    }

    async function getCurrentUser() {
        const client = await getClient();
        if (!client) return null;
        const { data } = await client.auth.getUser();
        return data?.user || null;
    }

    async function signOut() {
        const client = await getClient();
        if (!client) return;
        await client.auth.signOut();
    }

    // Auth: email OTP
    async function requestEmailOtp(email) {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/index.html' } });
        // Log OTP request
        try {
            await client.from('user_otp').insert({ email, channel: 'email', sent_at: new Date().toISOString() });
        } catch (e) {
            // ignore logging errors
        }
        return { error };
    }

    // Auth: phone OTP (requires SMS configured in Supabase project)
    async function requestPhoneOtp(phone) {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        const { error } = await client.auth.signInWithOtp({ phone });
        try {
            await client.from('user_otp').insert({ email: phone, channel: 'sms', sent_at: new Date().toISOString() });
        } catch (e) {}
        return { error };
    }

    async function verifyOtp({ email, phone, token }) {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        let result;
        if (phone) {
            result = await client.auth.verifyOtp({ phone, token, type: 'sms' });
        } else if (email) {
            result = await client.auth.verifyOtp({ email, token, type: 'email' });
        } else {
            return { error: 'no-identifier' };
        }
        return result;
    }

    async function upsertUserProfile(user) {
        const client = await getClient();
        if (!client || !user) return;
        const { id, email, phone } = user;
        await client.from('user_data').upsert({ user_id: id, email, phone }, { onConflict: 'user_id' });
    }

    async function saveUserProfile(details) {
        const client = await getClient();
        const user = await getCurrentUser();
        if (!client || !user) return { error: 'not-authenticated' };
        const payload = {
            user_id: user.id,
            email: details.email || null,
            phone: details.phone || null,
            name: details.name,
            address: details.address,
            pincode: details.pincode,
            landmark: details.landmark,
            alt_phone: details.altPhone,
            city: details.city,
            state: details.state
        };
        const { data, error } = await client.from('user_data').upsert(payload, { onConflict: 'user_id' }).select().single();
        return { data, error };
    }

    async function checkPincodeDeliverable(pincode) {
        const client = await getClient();
        if (!client) return { deliverable: false };
        const { data } = await client.from('pincode_status').select('status').eq('pincode', pincode).maybeSingle();
        return { deliverable: data ? data.status === 1 : false };
    }

    // Cart persistence
    async function syncCartItem(item, quantityDelta) {
        const client = await getClient();
        const user = await getCurrentUser();
        if (!client || !user) return; // only persist for logged-in users
        const payload = {
            user_id: user.id,
            product_id: item.id,
            packaging_type: item.packagingType || 'single',
            name: item.name,
            price: item.price,
            image: item.image || null,
            quantity: item.quantity
        };
        await client.from('user_cart').upsert(payload, { onConflict: 'user_id,product_id,packaging_type' });
        if (quantityDelta === 0 && item.quantity <= 0) {
            await client.from('user_cart').delete().match({ user_id: user.id, product_id: item.id, packaging_type: payload.packaging_type });
        }
    }

    async function clearUserCart() {
        const client = await getClient();
        const user = await getCurrentUser();
        if (!client || !user) return;
        await client.from('user_cart').delete().eq('user_id', user.id);
    }

    // Orders
    async function createOrder(orderPayload) {
        const client = await getClient();
        const user = await getCurrentUser();
        if (!client || !user) return null;
        const record = {
            user_id: user.id,
            order_id: orderPayload.id,
            status: 'processing',
            items: orderPayload.items,
            total: orderPayload.total,
            shipping: orderPayload.shipping,
            created_at: new Date().toISOString()
        };
        const { data, error } = await client.from('user_orders').insert(record).select().single();
        if (error) {
            console.error('Create order failed', error);
            return null;
        }
        // Update to placed after insert to reflect success path
        await client.from('user_orders').update({ status: 'placed' }).eq('id', data.id);
        return data;
    }

    // Addresses
    async function saveAddress(address) {
        const client = await getClient();
        const user = await getCurrentUser();
        if (!client || !user) return null;
        const record = {
            user_id: user.id,
            label: address.label || 'Default',
            name: address.name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            pincode: address.pincode,
            is_default: address.is_default === true
        };
        const { data, error } = await client.from('user_addresses').insert(record).select().single();
        if (error) {
            console.error('Save address failed', error);
            return null;
        }
        return data;
    }

    async function getAddresses() {
        const client = await getClient();
        const user = await getCurrentUser();
        if (!client || !user) return [];
        const { data } = await client.from('user_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).order('created_at', { ascending: false });
        return data || [];
    }

    // Admin utilities
    async function adminFetchUsers() {
        const client = await getClient();
        if (!client) return [];
        const { data } = await client.from('user_data').select('*').order('created_at', { ascending: false });
        return data || [];
    }

    async function adminFetchOrders() {
        const client = await getClient();
        if (!client) return [];
        const { data } = await client.from('user_orders').select('*').order('created_at', { ascending: false });
        return data || [];
    }

    async function adminUpdateOrderStatus(orderId, status) {
        const client = await getClient();
        if (!client) return;
        await client.from('user_orders').update({ status }).eq('order_id', orderId);
    }

    // Expose API
    window.backend = {
        getCurrentUser,
        requestEmailOtp,
        requestPhoneOtp,
        verifyOtp,
        upsertUserProfile,
        saveUserProfile,
        checkPincodeDeliverable,
        signOut,
        syncCartItem,
        clearUserCart,
        createOrder,
        adminFetchUsers,
        adminFetchOrders,
        adminUpdateOrderStatus
    };
})();


