// Cart functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const user = await (window.backend && window.backend.getCurrentUser());
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    loadCartItems();
    updateCartCount();
    setupCartAnimations();
    setupMobileMenu();
    updateNavigationForUser();
});

// Get products from localStorage or use default
function getProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        return JSON.parse(savedProducts);
    }
    
    // Fallback products if none in localStorage
    return [
        { id: 1, name: "Paracetamol 500mg", category: "tablets", price: 50, description: "Pain reliever and fever reducer", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format" },
        { id: 2, name: "Amoxicillin 250mg", category: "tablets", price: 120, description: "Antibiotic medication", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format" },
        { id: 3, name: "Cough Syrup", category: "syrups", price: 85, description: "Relieves cough and cold symptoms", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format" },
        { id: 4, name: "Vitamin B Complex", category: "syrups", price: 150, description: "Vitamin supplement", image: "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=400&h=300&fit=crop&auto=format" },
        { id: 5, name: "Antacid Suspension", category: "suspensions", price: 95, description: "Relieves acidity", image: "https://images.unsplash.com/photo-1576671414121-aa0f8f2ee4b7?w=400&h=300&fit=crop&auto=format" },
        { id: 6, name: "Insulin Injection", category: "injections", price: 450, description: "Diabetes medication", image: "https://images.unsplash.com/photo-1585435557343-3c1b67e4d175?w=400&h=300&fit=crop&auto=format" },
        { id: 7, name: "Generic Pain Relief", category: "generic", price: 35, description: "Generic pain relief tablets", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format" },
        { id: 8, name: "Vitamin C Tablets", category: "tablets", price: 60, description: "Immune system support", image: "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=400&h=300&fit=crop&auto=format" }
    ];
}

function loadCartItems() {
    const cartItemsSection = document.getElementById('cart-items-section');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = getProducts();
    
    console.log('Cart items:', cart); // Debug log
    console.log('Products:', products); // Debug log
    
    if (cart.length === 0) {
        cartItemsSection.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="1">
                        <circle cx="8" cy="21" r="1"></circle>
                        <circle cx="19" cy="21" r="1"></circle>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    </svg>
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any medicines to your cart yet.</p>
                <div class="empty-cart-actions">
                    <a href="products.html" class="cta-button">Browse Medicines</a>
                    <a href="index.html" class="secondary-button">Back to Home</a>
                </div>
                <div class="empty-cart-features">
                    <div class="feature">
                        <span class="feature-icon">🚚</span>
                        <span>Free delivery on orders above ₹500</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">💊</span>
                        <span>Genuine medicines guaranteed</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🛡️</span>
                        <span>Secure online payment</span>
                    </div>
                </div>
            </div>
        `;
        updateSummary(0);
        return;
    }
    
    cartItemsSection.innerHTML = `
        <div class="cart-items-header">
            <h3>Cart Items (${cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
            <button class="clear-cart-btn" onclick="clearCart()">Clear All</button>
        </div>
        <div class="cart-items-list">
            ${cart.map(item => {
                const product = products.find(p => p.id === item.id) || item;
                console.log('Product found:', product); // Debug log
                const packagingInfo = item.packagingInfo || {};
                const packagingType = item.packagingType || 'single';
                const packagingDescription = packagingInfo.description || 'Single Unit';
                
                return `
                    <div class="cart-item-card" data-product-id="${item.id}" data-packaging="${packagingType}">
                        <div class="cart-item-image">
                            <img src="${product.image || 'images/products/placeholder.jpg'}" alt="${item.name}" 
                                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjIxIiByPSIxIiBmaWxsPSIjNjY3ZWVhIj48L2NpcmNsZT4KPGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIgZmlsbD0iIzY2N2VlYSI+PC9jaXJjbGU+CjxwYXRoIGQ9Ik0yLjA1IDIuMDVoMmwyLjY2IDEyLjQyYTIgMiAwIDAgMCAyIDEuNThoOS43OGEyIDIgMCAwIDAgMS45NS0xLjU3bDEuNjUtNy40M0g1LjEyIiBzdHJva2U9IiM2NjdlZWEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvcGF0aD4KPC9zdmc+'">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="item-name">${item.name}</h4>
                            <p class="item-description">${product.description || 'Quality medicine'}</p>
                            <div class="packaging-info">
                                <span class="packaging-badge">${packagingDescription}</span>
                                ${packagingInfo.quantity ? `<span class="packaging-quantity">${packagingInfo.quantity} ${packagingInfo.unit}</span>` : ''}
                            </div>
                            <div class="item-price">₹${item.price}</div>
                        </div>
                        <div class="cart-item-controls">
                            <div class="quantity-section">
                                <label>Quantity:</label>
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${packagingType}', -1)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M5 12h14"></path>
                                        </svg>
                                    </button>
                                    <span class="quantity-display">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${packagingType}', 1)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 5v14M5 12h14"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="item-total">
                                ₹${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button class="remove-btn" onclick="removeFromCart(${item.id}, '${packagingType}')">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Remove
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateSummary(subtotal);
}

function updateQuantity(productId, packagingType, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId && item.packagingType === packagingType);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            // Animate removal
            const cartItem = document.querySelector(`[data-product-id="${productId}"][data-packaging="${packagingType}"]`);
            if (cartItem) {
                cartItem.style.animation = 'slideOutLeft 0.3s ease-out forwards';
                setTimeout(() => {
                    cart = cart.filter(item => !(item.id === productId && item.packagingType === packagingType));
                    localStorage.setItem('cart', JSON.stringify(cart));
                    loadCartItems();
                    updateCartCount();
                    showCartNotification('Item removed from cart');
                }, 300);
                return;
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        // Persist to DB if logged in
        window.backend && window.backend.syncCartItem(item, change).catch(() => {});
        loadCartItems();
        updateCartCount();
        
        // Animate quantity change
        const quantityDisplay = document.querySelector(`[data-product-id="${productId}"][data-packaging="${packagingType}"] .quantity-display`);
        if (quantityDisplay) {
            quantityDisplay.style.animation = 'pulse 0.3s ease-out';
            setTimeout(() => {
                quantityDisplay.style.animation = '';
            }, 300);
        }
        
        // Show notification
        showCartNotification(change > 0 ? 'Quantity increased' : 'Quantity decreased');
    }
}

function removeFromCart(productId, packagingType) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId && item.packagingType === packagingType);
    
    if (item) {
        // Animate removal
        const cartItem = document.querySelector(`[data-product-id="${productId}"][data-packaging="${packagingType}"]`);
        if (cartItem) {
            cartItem.style.animation = 'slideOutLeft 0.3s ease-out forwards';
            setTimeout(() => {
                cart = cart.filter(item => !(item.id === productId && item.packagingType === packagingType));
                localStorage.setItem('cart', JSON.stringify(cart));
                // Persist removal
                if (item) { window.backend && window.backend.syncCartItem({ ...item, quantity: 0 }, 0).catch(() => {}); }
                loadCartItems();
                updateCartCount();
                showCartNotification('Item removed from cart');
            }, 300);
        }
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        // Clear server-side cart
        window.backend && window.backend.clearUserCart && window.backend.clearUserCart();
        loadCartItems();
        updateCartCount();
        showCartNotification('Cart cleared');
    }
}

function updateSummary(subtotal) {
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    
    // Update shipping info
    const shippingInfo = document.querySelector('.delivery-info');
    if (shippingInfo) {
        if (subtotal > 500) {
            shippingInfo.innerHTML = `
                <div class="delivery-icon">🎉</div>
                <div class="delivery-text">
                    <strong>Free Delivery Applied!</strong>
                    <span>You saved ₹50</span>
                </div>
            `;
            shippingInfo.style.background = '#d4edda';
        } else {
            const needed = (500 - subtotal).toFixed(2);
            shippingInfo.innerHTML = `
                <div class="delivery-icon">🚚</div>
                <div class="delivery-text">
                    <strong>Free Delivery</strong>
                    <span>Add ₹${needed} more for free delivery</span>
                </div>
            `;
            shippingInfo.style.background = '#e8f4fd';
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showCartNotification('Your cart is empty', 'error');
        return;
    }
    window.location.href = 'checkout.html';
}

function showCartNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Cart animations and interactions
function setupCartAnimations() {
    // Animate cart items on load
    const cartItems = document.querySelectorAll('.cart-item-card');
    cartItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });

    // Add hover effects to cart items
    cartItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
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


// Add CSS animations for cart
const cartAnimationStyles = document.createElement('style');
cartAnimationStyles.textContent = `
    @keyframes slideOutLeft {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .cart-item-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .quantity-btn {
        transition: all 0.2s ease;
    }
    
    .quantity-btn:hover {
        transform: scale(1.1);
    }
    
    .remove-btn {
        transition: all 0.2s ease;
    }
    
    .remove-btn:hover {
        transform: scale(1.05);
    }
    
    /* Packaging info styles in cart */
    .packaging-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 0.5rem 0;
    }
    
    .packaging-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-block;
        width: fit-content;
    }
    
    .packaging-quantity {
        font-size: 0.85rem;
        color: #666;
        font-weight: 500;
    }
    
    /* Enhanced cart item styling */
    .cart-item-details {
        flex: 1;
        padding: 1rem;
    }
    
    .item-name {
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
    }
    
    .item-description {
        color: #7f8c8d;
        font-size: 0.9rem;
        margin: 0 0 0.5rem 0;
        line-height: 1.4;
    }
    
    .item-price {
        font-size: 1.2rem;
        font-weight: 700;
        color: #e74c3c;
        margin: 0.5rem 0;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .packaging-info {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
        }
        
        .packaging-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
        }
        
        .packaging-quantity {
            font-size: 0.8rem;
        }
    }
`;
document.head.appendChild(cartAnimationStyles);