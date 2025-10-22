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
                console.log('Verifying OTP for phone:', phone, 'with token:', token);
                
                // First, get the most recent OTP for this phone (including verified ones for debugging)
                const { data: otpData, error: otpError } = await client
                    .from('user_otp')
                    .select('*')
                    .eq('email', phone)
                    .eq('channel', 'sms')
                    .order('sent_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                
                console.log('OTP query result:', { otpData, otpError });
                
                if (otpError) {
                    console.error('OTP query error:', otpError);
                    return { error: 'Failed to verify OTP' };
                }
                
                if (!otpData) {
                    console.log('No OTP found for phone:', phone);
                    return { error: 'No OTP found for this phone number. Please request a new OTP.' };
                }
                
                // Check if OTP is already verified
                if (otpData.is_verified) {
                    console.log('OTP already verified for phone:', phone);
                    return { error: 'This OTP has already been used. Please request a new OTP.' };
                }
                
                // Check if OTP is expired
                const now = new Date();
                const expiresAt = new Date(otpData.expires_at);
                if (now > expiresAt) {
                    console.log('OTP expired. Now:', now, 'Expires:', expiresAt);
                    return { error: 'OTP has expired. Please request a new one.' };
                }
                
                // Check if OTP code matches
                if (otpData.otp_code !== token) {
                    console.log('OTP code mismatch. Expected:', otpData.otp_code, 'Received:', token);
                    return { error: 'Invalid OTP code' };
                }
                
                console.log('OTP verification successful');
                
                // Mark OTP as verified
                await client
                    .from('user_otp')
                    .update({ is_verified: true })
                    .eq('id', otpData.id);
                
                // Create or get user session (simulate login)
                const user = {
                    id: 'temp-' + Date.now(),
                    email: phone,
                    phone: phone,
                    name: 'User',
                    created_at: new Date().toISOString()
                };
                
                // Store user session in localStorage for demo
                localStorage.setItem('current_user', JSON.stringify(user));
                console.log('OTP login session created:', user);
                
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

    // New function for creating user accounts during signup
    async function createUserAccount(details) {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        
        try {
            // Check if user already exists by phone or email
            const existingUserChecks = [];
            
            if (details.phone) {
                existingUserChecks.push(
                    client.from('user_data').select('*').eq('phone', details.phone).single()
                );
            }
            
            if (details.email) {
                existingUserChecks.push(
                    client.from('user_data').select('*').eq('email', details.email).single()
                );
            }
            
            // Check for existing users
            const existingUsers = await Promise.all(existingUserChecks);
            
            console.log('Checking for existing users:', existingUsers);
            
            for (const result of existingUsers) {
                console.log('Checking result:', result);
                if (result.data && !result.error) {
                    // User already exists
                    const existingUser = result.data;
                    console.log('Found existing user:', existingUser);
                    if (existingUser.phone === details.phone) {
                        console.log('Duplicate phone found:', existingUser.phone);
                        return { error: 'User with this phone number already exists. Please login.' };
                    }
                    if (existingUser.email === details.email) {
                        console.log('Duplicate email found:', existingUser.email);
                        return { error: 'User with this email already exists. Please login.' };
                    }
                }
            }
            
            console.log('No existing users found, proceeding with creation');
            
            const payload = {
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
            
            console.log('Creating user account with payload:', payload);
            
            const { data, error } = await client.from('user_data').insert(payload).select().single();
            
            if (error) {
                console.error('User creation error:', error);
                return { error: error.message || 'Failed to create account' };
            }
            
            console.log('User account created successfully:', data);
            
            // Store address details in user_addresses table
            try {
                const addressRecord = {
                    user_id: data.user_id,
                    label: 'Default',
                    name: details.name,
                    phone: details.phone,
                    address: details.address,
                    city: details.city,
                    pincode: details.pincode,
                    is_default: true
                };
                
                console.log('Storing address record:', addressRecord);
                
                const { data: addressData, error: addressError } = await client
                    .from('user_addresses')
                    .insert(addressRecord)
                    .select()
                    .single();
                
                if (addressError) {
                    console.error('Address storage error:', addressError);
                    // Don't fail the entire process if address storage fails
                } else {
                    console.log('Address stored successfully:', addressData);
                }
            } catch (addressException) {
                console.error('Address storage exception:', addressException);
                // Don't fail the entire process if address storage fails
            }
            
            // Create user session for the new account
            const userSession = {
                id: data.user_id,
                email: data.email,
                phone: data.phone,
                name: data.name,
                created_at: data.created_at
            };
            
            // Store user session in localStorage
            localStorage.setItem('current_user', JSON.stringify(userSession));
            console.log('User session created:', userSession);
            
            return { data, error: null };
        } catch (e) {
            console.error('User creation exception:', e);
            return { error: 'Failed to create account' };
        }
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

    // Check if user is logged in (for navigation purposes)
    function isUserLoggedIn() {
        const customUser = localStorage.getItem('current_user');
        if (customUser) {
            try {
                return JSON.parse(customUser);
            } catch (e) {
                localStorage.removeItem('current_user');
                return null;
            }
        }
        return null;
    }

    // Get user account details for account modal
    async function getUserAccountDetails() {
        const client = await getClient();
        if (!client) return { error: 'no-client' };
        
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) return { error: 'not-logged-in' };
            
            // Get user data from user_data table
            const { data, error } = await client
                .from('user_data')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();
                
            if (error) {
                console.error('Error fetching user account details:', error);
                return { error: 'Failed to fetch account details' };
            }
            
            return { data, error: null };
        } catch (e) {
            console.error('Error in getUserAccountDetails:', e);
            return { error: 'Failed to fetch account details' };
        }
    }

    // Expose API
    window.backend = {
        getCurrentUser,
        isUserLoggedIn,
        requestEmailOtp,
        requestPhoneOtp,
        verifyOtp,
        upsertUserProfile,
        saveUserProfile,
        createUserAccount,
        getUserAccountDetails,
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


