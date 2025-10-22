document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const user = await (window.backend && window.backend.getCurrentUser());
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    loadCheckoutItems();
    updateCartCount();
    setupCheckoutAnimations();
    setupMobileMenu();
    updateNavigationForUser();
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
});

function loadCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;
    
    document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `₹${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

async function placeOrder() {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        payment: document.querySelector('input[name="payment"]:checked')?.value
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading animation
    showLoadingAnimation();
    
    try {
        // Generate unique order ID
        const orderId = 'NP' + Date.now() + Math.floor(Math.random() * 1000);
        
        // Get cart items
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart items for order:', cartItems);
        
        if (cartItems.length === 0) {
            hideLoadingAnimation();
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 50;
        const total = subtotal + shipping;
        
        // Create order object
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            items: cartItems,
            total: total.toString(),
            status: 'placed', // Use 'placed' to match database constraint
            shipping: formData
        };
        
        console.log('Creating order:', order);
        
        // Save order to database first
        const dbResult = await window.backend.createOrder(order);
        if (dbResult && dbResult.error) {
            console.error('Failed to save order to database:', dbResult.error);
            hideLoadingAnimation();
            showNotification('Failed to place order: ' + dbResult.error, 'error');
            return;
        }
        
        console.log('Order saved to database successfully:', dbResult);
        
        // Save order to localStorage as backup
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Save address to DB (best-effort)
        try { 
            await window.backend.saveAddress({
                label: 'Default',
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                is_default: true
            }); 
        } catch (e) {
            console.log('Address save failed, but order was placed:', e);
        }
        
        // Clear cart
        localStorage.removeItem('cart');
        try { 
            await window.backend.clearUserCart(); 
        } catch (e) {
            console.log('Cart clear failed:', e);
        }
        
        console.log('Order placed successfully:', orderId);
        
        // Show success animation
        setTimeout(() => {
            hideLoadingAnimation();
            showOrderSuccessAnimation(orderId);
            
            // Redirect to order history after animation
            setTimeout(() => {
                window.location.href = 'order-history.html';
            }, 3000);
        }, 2000);
        
    } catch (error) {
        console.error('Order placement error:', error);
        hideLoadingAnimation();
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

// Checkout animations and interactions
function setupCheckoutAnimations() {
    // Animate form elements
    const formElements = document.querySelectorAll('.form-group, .payment-option');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Animate order summary
    const orderSummary = document.querySelector('.order-summary');
    if (orderSummary) {
        orderSummary.style.opacity = '0';
        orderSummary.style.transform = 'translateX(30px)';
        setTimeout(() => {
            orderSummary.style.transition = 'all 0.6s ease-out';
            orderSummary.style.opacity = '1';
            orderSummary.style.transform = 'translateX(0)';
        }, 200);
    }

    // Add form validation animations
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });

        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Add payment option animations
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            // Add active class to clicked option
            this.classList.add('selected');
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}


function validateForm(formData) {
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!formData[field] || formData[field].trim() === '') {
            input.style.borderColor = '#e74c3c';
            input.style.animation = 'shake 0.5s ease-in-out';
            isValid = false;
            
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        } else {
            input.style.borderColor = '#27ae60';
        }
    });
    
    if (!formData.payment) {
        showNotification('Please select a payment method', 'error');
        isValid = false;
    }
    
    return isValid;
}

function showLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h3>Processing your order...</h3>
            <p>Please wait while we confirm your order</p>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(loadingOverlay);
}

function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showOrderSuccessAnimation(orderId) {
    const successOverlay = document.createElement('div');
    successOverlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Your Order ID is: <strong>${orderId}</strong></p>
            <p>You will receive a confirmation email shortly.</p>
            <div class="success-actions">
                <button onclick="window.location.href='order-history.html'" class="btn-primary">View Order History</button>
                <button onclick="window.location.href='index.html'" class="btn-secondary">Continue Shopping</button>
            </div>
        </div>
    `;
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(successOverlay);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `checkout-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(20px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Add CSS for checkout animations
const checkoutStyles = document.createElement('style');
checkoutStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-content,
    .success-content {
        text-align: center;
        color: white;
        max-width: 400px;
        padding: 2rem;
    }
    
    .success-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        margin: 0 auto 20px;
        animation: bounceIn 0.6s ease-out;
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .btn-primary,
    .btn-secondary {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-primary:hover,
    .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .payment-option {
        transition: all 0.3s ease;
    }
    
    .payment-option.selected {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        transform: scale(1.02);
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        transform: scale(1.02);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
`;
document.head.appendChild(checkoutStyles);