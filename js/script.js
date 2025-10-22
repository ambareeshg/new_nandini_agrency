// Updated product data with bulk packaging options for medical stores
const products = [
    { 
        id: 1, 
        name: "Paracetamol 500mg", 
        category: "tablets", 
        price: 50, 
        description: "Pain reliever and fever reducer",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 50, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 450, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 2000, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 13, 
        name: "Azithromycin 500mg", 
        category: "tablets", 
        price: 160, 
        description: "Broad-spectrum antibiotic",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 160, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 1350, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 6200, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 14, 
        name: "Montelukast 10mg", 
        category: "tablets", 
        price: 140, 
        description: "Anti-allergic tablet",
        image: "https://images.unsplash.com/photo-1582719478372-34f5a5b3723e?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 140, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 1200, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 5400, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 15, 
        name: "ORS Electrolyte", 
        category: "syrups", 
        price: 65, 
        description: "Oral rehydration solution",
        image: "https://images.unsplash.com/photo-1603398749949-8f3d0a5f5c69?w=400&h=300&fit=crop&auto=format",
        packaging: {
            bottle: { price: 65, quantity: 1, unit: "bottle (200ml)", description: "Single Bottle" },
            pack: { price: 580, quantity: 10, unit: "bottles", bottles: 10, description: "Pack (10 Bottles)" },
            bulk: { price: 2500, quantity: 50, unit: "bottles", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 16, 
        name: "Cefixime Suspension", 
        category: "suspensions", 
        price: 120, 
        description: "Antibiotic suspension",
        image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop&auto=format",
        packaging: {
            bottle: { price: 120, quantity: 1, unit: "bottle (30ml)", description: "Single Bottle" },
            pack: { price: 1050, quantity: 10, unit: "bottles", bottles: 10, description: "Pack (10 Bottles)" },
            bulk: { price: 4700, quantity: 50, unit: "bottles", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 17, 
        name: "Vitamin B12 Injection", 
        category: "injections", 
        price: 90, 
        description: "Cyanocobalamin injection",
        image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop&auto=format",
        packaging: {
            vial: { price: 90, quantity: 1, unit: "vial (1ml)", description: "Single Vial" },
            pack: { price: 800, quantity: 10, unit: "vials", vials: 10, description: "Pack (10 Vials)" },
            bulk: { price: 3500, quantity: 50, unit: "vials", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 2, 
        name: "Amoxicillin 250mg", 
        category: "tablets", 
        price: 120, 
        description: "Antibiotic medication",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 120, quantity: 10, unit: "capsules", description: "Single Strip" },
            box: { price: 1000, quantity: 100, unit: "capsules", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 4500, quantity: 500, unit: "capsules", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 3, 
        name: "Cough Syrup", 
        category: "syrups", 
        price: 85, 
        description: "Relieves cough and cold symptoms",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format",
        packaging: {
            bottle: { price: 85, quantity: 1, unit: "bottle (100ml)", description: "Single Bottle" },
            pack: { price: 750, quantity: 10, unit: "bottles", bottles: 10, description: "Pack (10 Bottles)" },
            bulk: { price: 3000, quantity: 50, unit: "bottles", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 4, 
        name: "Vitamin B Complex", 
        category: "syrups", 
        price: 150, 
        description: "Vitamin supplement",
        image: "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=400&h=300&fit=crop&auto=format",
        packaging: {
            bottle: { price: 150, quantity: 1, unit: "bottle (200ml)", description: "Single Bottle" },
            pack: { price: 1200, quantity: 10, unit: "bottles", bottles: 10, description: "Pack (10 Bottles)" },
            bulk: { price: 5000, quantity: 50, unit: "bottles", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 5, 
        name: "Antacid Suspension", 
        category: "suspensions", 
        price: 95, 
        description: "Relieves acidity",
        image: "https://images.unsplash.com/photo-1576671414121-aa0f8f2ee4b7?w=400&h=300&fit=crop&auto=format",
        packaging: {
            bottle: { price: 95, quantity: 1, unit: "bottle (150ml)", description: "Single Bottle" },
            pack: { price: 800, quantity: 10, unit: "bottles", bottles: 10, description: "Pack (10 Bottles)" },
            bulk: { price: 3500, quantity: 50, unit: "bottles", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 6, 
        name: "Insulin Injection", 
        category: "injections", 
        price: 450, 
        description: "Diabetes medication",
        image: "https://images.unsplash.com/photo-1585435557343-3c1b67e4d175?w=400&h=300&fit=crop&auto=format",
        packaging: {
            vial: { price: 450, quantity: 1, unit: "vial (10ml)", description: "Single Vial" },
            pack: { price: 4000, quantity: 10, unit: "vials", vials: 10, description: "Pack (10 Vials)" },
            bulk: { price: 18000, quantity: 50, unit: "vials", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 7, 
        name: "Generic Pain Relief", 
        category: "generic", 
        price: 35, 
        description: "Generic pain relief tablets",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 35, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 300, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 1200, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 8, 
        name: "Vitamin C Tablets", 
        category: "tablets", 
        price: 60, 
        description: "Immune system support",
        image: "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 60, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 500, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 2000, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 9, 
        name: "Blood Pressure Medicine", 
        category: "tablets", 
        price: 180, 
        description: "Controls blood pressure",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 180, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 1500, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 6500, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 10, 
        name: "Diabetes Medicine", 
        category: "tablets", 
        price: 220, 
        description: "Manages blood sugar levels",
        image: "https://images.unsplash.com/photo-1576671414121-aa0f8f2ee4b7?w=400&h=300&fit=crop&auto=format",
        packaging: {
            strip: { price: 220, quantity: 10, unit: "tablets", description: "Single Strip" },
            box: { price: 1800, quantity: 100, unit: "tablets", strips: 10, description: "Box (10 Strips)" },
            bulk: { price: 8000, quantity: 500, unit: "tablets", boxes: 5, description: "Bulk Pack (5 Boxes)" }
        }
    },
    { 
        id: 11, 
        name: "Children Syrup", 
        category: "syrups", 
        price: 75, 
        description: "For children's health",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format",
        packaging: {
            bottle: { price: 75, quantity: 1, unit: "bottle (100ml)", description: "Single Bottle" },
            pack: { price: 650, quantity: 10, unit: "bottles", bottles: 10, description: "Pack (10 Bottles)" },
            bulk: { price: 2800, quantity: 50, unit: "bottles", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    },
    { 
        id: 12, 
        name: "Antibiotic Injection", 
        category: "injections", 
        price: 320, 
        description: "Strong antibiotic treatment",
        image: "https://images.unsplash.com/photo-1585435557343-3c1b67e4d175?w=400&h=300&fit=crop&auto=format",
        packaging: {
            vial: { price: 320, quantity: 1, unit: "vial (5ml)", description: "Single Vial" },
            pack: { price: 2800, quantity: 10, unit: "vials", vials: 10, description: "Pack (10 Vials)" },
            bulk: { price: 12000, quantity: 50, unit: "vials", packs: 5, description: "Bulk Pack (5 Packs)" }
        }
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadFeaturedProducts();
    loadAllProducts();
    setupEventListeners();
    setupMobileMenu();
    setupScrollAnimations();
    setupNavbarScroll();
    updateNavigationForUser();
});

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        const featuredProducts = products.slice(0, 4);
        featuredContainer.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="packaging-options">
                    ${generatePackagingOptions(product)}
                </div>
                <button class="add-to-cart" onclick="showBulkOptions(${product.id})">Choose Packaging</button>
            </div>
        `).join('');
    }
}

function loadAllProducts() {
    const productsContainer = document.getElementById('products-grid');
    if (productsContainer) {
        productsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="packaging-options">
                    ${generatePackagingOptions(product)}
                </div>
                <button class="add-to-cart" onclick="showBulkOptions(${product.id})">Choose Packaging</button>
            </div>
        `).join('');
    }
}

function setupEventListeners() {
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
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

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function trackOrder() {
    const orderId = document.getElementById('order-id').value;
    if (orderId) {
        document.getElementById('tracking-info').style.display = 'block';
        document.getElementById('track-order-id').textContent = orderId;
    } else {
        alert('Please enter an order ID');
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Order History Functions
function loadOrderHistoryPage() {
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        if (noOrders) noOrders.style.display = 'block';
        return;
    }
    
    if (noOrders) noOrders.style.display = 'none';
    
    if (ordersList) {
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        ordersList.innerHTML = orders.map(order => {
            const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50;
            
            let statusClass = 'status-confirmed';
            let statusText = 'Confirmed';
            
            if (order.status === 'shipped') {
                statusClass = 'status-shipped';
                statusText = 'Shipped';
            } else if (order.status === 'delivered') {
                statusClass = 'status-delivered';
                statusText = 'Delivered';
            }
            
            return `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <span class="order-id">Order #${order.id}</span>
                            <span class="order-date">Placed on ${order.date}</span>
                        </div>
                        <span class="order-status ${statusClass}">${statusText}</span>
                    </div>
                    
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-total">
                        Total: ₹${totalAmount.toFixed(2)}
                    </div>
                    
                    <div style="margin-top: 1rem; text-align: center;">
                        <button onclick="trackOrderById('${order.id}')" style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                            Track This Order
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function trackOrderById(orderId) {
    localStorage.setItem('trackOrderId', orderId);
    window.location.href = 'track-order.html';
}
// Save products to localStorage for cart access
localStorage.setItem('products', JSON.stringify(products));

// Modern animations and interactions
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .order-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.modern-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `modern-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}
            </div>
            <div class="notification-text">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 
                     type === 'error' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' : 
                     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        padding: 0;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
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

// Generate packaging options display
function generatePackagingOptions(product) {
    if (!product.packaging) return '';
    
    const options = Object.entries(product.packaging);
    return options.map(([key, option]) => `
        <div class="packaging-option">
            <span class="packaging-type">${option.description}</span>
            <span class="packaging-price">₹${option.price}</span>
            <span class="packaging-quantity">${option.quantity} ${option.unit}</span>
        </div>
    `).join('');
}

// Show bulk options modal
function showBulkOptions(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.packaging) return;
    
    const modal = document.createElement('div');
    modal.className = 'bulk-modal';
    modal.innerHTML = `
        <div class="bulk-modal-content">
            <div class="bulk-modal-header">
                <h3>${product.name}</h3>
                <button class="close-modal" onclick="closeBulkModal()">&times;</button>
            </div>
            <div class="bulk-modal-body">
                <p class="product-description">${product.description}</p>
                <div class="packaging-selection">
                    <h4>Choose Packaging Option:</h4>
                    ${Object.entries(product.packaging).map(([key, option]) => `
                        <div class="packaging-card" onclick="selectPackaging(${productId}, '${key}')">
                            <div class="packaging-info">
                                <h5>${option.description}</h5>
                                <p>${option.quantity} ${option.unit}</p>
                                <div class="packaging-price">₹${option.price}</div>
                            </div>
                            <div class="packaging-badge">
                                ${key === 'bulk' ? '🔥 Best Value' : key === 'box' || key === 'pack' ? '💼 Popular' : '👤 Individual'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.bulk-modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Close bulk modal
function closeBulkModal() {
    const modal = document.querySelector('.bulk-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('.bulk-modal-content').style.transform = 'translateY(-50px)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Select packaging and add to cart
function selectPackaging(productId, packagingType) {
    const product = products.find(p => p.id === productId);
    const packaging = product.packaging[packagingType];
    
    if (!packaging) return;
    
    const existingItem = cart.find(item => 
        item.id === productId && item.packagingType === packagingType
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: packaging.price,
            quantity: 1,
            image: product.image,
            packagingType: packagingType,
            packagingInfo: packaging
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    // Persist to DB if logged in
    const addedItem = cart.find(i => i.id === product.id && i.packagingType === packagingType) || {
        id: product.id,
        name: product.name,
        price: packaging.price,
        quantity: 1,
        image: product.image,
        packagingType: packagingType,
        packagingInfo: packaging
    };
    window.backend && window.backend.syncCartItem(addedItem, +1).catch(() => {});
    updateCartCount();
    
    // Close modal
    closeBulkModal();
    
    // Show notification
    showNotification(`${product.name} (${packaging.description}) added to cart!`);
    
    // Create floating animation
    createFloatingAnimation(productId);
}

// Enhanced add to cart with animation (for backward compatibility)
function addToCart(productId) {
    showBulkOptions(productId);
}

function createFloatingAnimation(productId) {
    const button = document.querySelector(`[onclick="addToCart(${productId})"]`);
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const floatingElement = document.createElement('div');
    floatingElement.innerHTML = '✓';
    floatingElement.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top}px;
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
        animation: floatToCart 1s ease-out forwards;
    `;
    
    document.body.appendChild(floatingElement);
    
    // Remove after animation
    setTimeout(() => {
        if (document.body.contains(floatingElement)) {
            document.body.removeChild(floatingElement);
        }
    }, 1000);
}

// Add CSS for animations and bulk packaging
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes floatToCart {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        50% {
            transform: translate(0, -50px) scale(1.2);
            opacity: 0.8;
        }
        100% {
            transform: translate(100px, -100px) scale(0.5);
            opacity: 0;
        }
    }
    
    .modern-notification .notification-content {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        gap: 12px;
    }
    
    .modern-notification .notification-icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .modern-notification .notification-text {
        flex: 1;
        font-weight: 500;
    }
    
    .modern-notification .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
    }
    
    .modern-notification .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .navbar {
        transition: transform 0.3s ease, background 0.3s ease;
    }
    
    /* Bulk Packaging Styles */
    .packaging-options {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(102, 126, 234, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(102, 126, 234, 0.1);
    }
    
    .packaging-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    }
    
    .packaging-option:last-child {
        border-bottom: none;
    }
    
    .packaging-type {
        font-weight: 600;
        color: var(--dark-color);
        flex: 1;
    }
    
    .packaging-price {
        font-weight: 700;
        color: var(--primary-color);
        margin: 0 1rem;
    }
    
    .packaging-quantity {
        font-size: 0.9rem;
        color: var(--text-light);
    }
    
    /* Bulk Modal Styles */
    .bulk-modal {
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
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    .bulk-modal-content {
        background: white;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: translateY(-50px);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .bulk-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 1rem;
        border-bottom: 2px solid var(--border-color);
    }
    
    .bulk-modal-header h3 {
        color: var(--dark-color);
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-light);
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .close-modal:hover {
        background: rgba(231, 76, 60, 0.1);
        color: #e74c3c;
        transform: scale(1.1);
    }
    
    .bulk-modal-body {
        padding: 2rem;
    }
    
    .product-description {
        color: var(--text-light);
        margin-bottom: 2rem;
        font-size: 1.1rem;
        line-height: 1.6;
    }
    
    .packaging-selection h4 {
        color: var(--dark-color);
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
        font-weight: 600;
    }
    
    .packaging-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 2px solid transparent;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .packaging-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
        transition: all 0.3s ease;
    }
    
    .packaging-card:hover::before {
        left: 100%;
    }
    
    .packaging-card:hover {
        border-color: var(--primary-color);
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
    }
    
    .packaging-info {
        flex: 1;
    }
    
    .packaging-info h5 {
        color: var(--dark-color);
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
    }
    
    .packaging-info p {
        color: var(--text-light);
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
    }
    
    .packaging-info .packaging-price {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 0;
    }
    
    .packaging-badge {
        background: var(--gradient-primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .bulk-modal-content {
            width: 95%;
            margin: 1rem;
        }
        
        .bulk-modal-header,
        .bulk-modal-body {
            padding: 1.5rem;
        }
        
        .packaging-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .packaging-badge {
            align-self: flex-end;
        }
    }
`;
document.head.appendChild(animationStyles);

// Account Modal Functions
async function updateNavigationForUser() {
    const user = await (window.backend && window.backend.getCurrentUser());
    const loginNavItem = document.getElementById('login-nav-item');
    const accountNavItem = document.getElementById('account-nav-item');
    
    if (user) {
        // User is logged in - show account icon, hide login
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (accountNavItem) accountNavItem.style.display = 'block';
    } else {
        // User is not logged in - show login, hide account icon
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (accountNavItem) accountNavItem.style.display = 'none';
    }
}

async function showAccountModal() {
    const modal = document.getElementById('account-modal');
    const loading = document.getElementById('account-loading');
    const details = document.getElementById('account-details');
    const error = document.getElementById('account-error');
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Show loading state
    loading.style.display = 'block';
    details.style.display = 'none';
    error.style.display = 'none';
    
    try {
        // Fetch user account details
        const result = await window.backend.getUserAccountDetails();
        
        if (result.error) {
            // Show error state
            loading.style.display = 'none';
            error.style.display = 'block';
            console.error('Error loading account details:', result.error);
            return;
        }
        
        // Populate account details
        const userData = result.data;
        document.getElementById('account-name').textContent = userData.name || 'Not provided';
        document.getElementById('account-email').textContent = userData.email || 'Not provided';
        document.getElementById('account-phone').textContent = userData.phone || 'Not provided';
        document.getElementById('account-alt-phone').textContent = userData.alt_phone || 'Not provided';
        document.getElementById('account-address').textContent = userData.address || 'Not provided';
        document.getElementById('account-landmark').textContent = userData.landmark || 'Not provided';
        document.getElementById('account-city').textContent = userData.city || 'Not provided';
        document.getElementById('account-state').textContent = userData.state || 'Not provided';
        document.getElementById('account-pincode').textContent = userData.pincode || 'Not provided';
        
        // Format dates
        const createdDate = userData.date_created ? new Date(userData.date_created).toLocaleDateString() : 'Not available';
        const updatedDate = userData.date_modified ? new Date(userData.date_modified).toLocaleDateString() : 'Not available';
        document.getElementById('account-created').textContent = createdDate;
        document.getElementById('account-updated').textContent = updatedDate;
        
        // Show details
        loading.style.display = 'none';
        details.style.display = 'block';
        
    } catch (e) {
        console.error('Error in showAccountModal:', e);
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

function closeAccountModal() {
    const modal = document.getElementById('account-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

async function logoutUser() {
    try {
        // Sign out from backend
        await window.backend.signOut();
        
        // Clear local cart
        localStorage.removeItem('cart');
        
        // Update navigation
        await updateNavigationForUser();
        
        // Close modal
        closeAccountModal();
        
        // Show success message
        showNotification('Logged out successfully!', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (e) {
        console.error('Error during logout:', e);
        showNotification('Error during logout. Please try again.', 'error');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('account-modal');
    if (e.target === modal) {
        closeAccountModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('account-modal');
        if (modal && modal.classList.contains('show')) {
            closeAccountModal();
        }
    }
});