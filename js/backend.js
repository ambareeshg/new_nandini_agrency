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
        
        // Check for custom user session (phone OTP login)
        const customUser = localStorage.getItem('current_user');
        if (customUser) {
            try {
                return JSON.parse(customUser);
            } catch (e) {
                localStorage.removeItem('current_user');
            }
        }
        
        // Check Supabase auth session (email OTP login)
        const { data } = await client.auth.getUser();
        return data?.user || null;
    }

    async function signOut() {
        const client = await getClient();
        if (!client) return;
        
        // Clear custom user session
        localStorage.removeItem('current_user');
        
        // Sign out from Supabase
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

    // Auth: phone OTP (custom 6-digit OTP system - demo version)
    async function requestPhoneOtp(phone) {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        try {
            // Store OTP in database
            await client.from('user_otp').insert({ 
                email: phone, 
                channel: 'sms', 
                sent_at: new Date().toISOString(),
                otp_code: otp,
                expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes expiry
            });
            
            // Demo version - log OTP to console and return it for display
            console.log(`📱 OTP for ${phone}: ${otp}`);
            console.log(`⏰ OTP expires in 5 minutes`);
            console.log(`🔐 This is a demo version - no real SMS sent`);
            
            return { success: true, otp: otp };
        } catch (e) {
            console.error('OTP generation error:', e);
            return { error: 'Failed to generate OTP' };
        }
    }

    async function verifyOtp({ email, phone, token }) {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        
        if (phone) {
            // Custom OTP verification for phone
            try {
                const { data, error } = await client
                    .from('user_otp')
                    .select('*')
                    .eq('email', phone)
                    .eq('channel', 'sms')
                    .eq('otp_code', token)
                    .eq('is_verified', false)
                    .gt('expires_at', new Date().toISOString())
                    .order('sent_at', { ascending: false })
                    .limit(1)
                    .single();
                
                if (error || !data) {
                    return { error: 'Invalid or expired OTP' };
                }
                
                // Mark OTP as verified
                await client
                    .from('user_otp')
                    .update({ is_verified: true })
                    .eq('id', data.id);
                
                // Create or get user session (simulate login)
                const user = {
                    id: 'temp-' + Date.now(),
                    email: phone,
                    phone: phone,
                    created_at: new Date().toISOString()
                };
                
                // Store user session in localStorage for demo
                localStorage.setItem('current_user', JSON.stringify(user));
                
                return { data: { user }, error: null };
            } catch (e) {
                console.error('OTP verification error:', e);
                return { error: 'OTP verification failed' };
            }
        } else if (email) {
            // Use Supabase's built-in email OTP verification
            const result = await client.auth.verifyOtp({ email, token, type: 'email' });
            return result;
        } else {
            return { error: 'no-identifier' };
        }
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
        if (!client) {
            console.warn('No Supabase client available');
            return { deliverable: false };
        }
        
        try {
            const { data, error } = await client.from('pincode_status').select('status').eq('pincode', pincode).maybeSingle();
            
            if (error) {
                console.error('Pincode check error:', error);
                return { deliverable: false };
            }
            
            console.log(`Pincode ${pincode} check result:`, data);
            return { deliverable: data ? data.status === 1 : false };
        } catch (err) {
            console.error('Pincode check exception:', err);
            return { deliverable: false };
        }
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

    // Debug function to test pincode directly
    async function debugPincode(pincode) {
        const client = await getClient();
        if (!client) {
            console.error('No Supabase client');
            return;
        }
        
        try {
            const { data, error } = await client.from('pincode_status').select('*').eq('pincode', pincode);
            console.log('Debug pincode query result:', { data, error });
            return { data, error };
        } catch (err) {
            console.error('Debug pincode exception:', err);
            return { error: err };
        }
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
        debugPincode,
        signOut,
        syncCartItem,
        clearUserCart,
        createOrder,
        adminFetchUsers,
        adminFetchOrders,
        adminUpdateOrderStatus
    };
})();


