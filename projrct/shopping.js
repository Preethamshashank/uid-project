// Sample product data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: "Premium Cricket Bat",
        price: 199.99,
        category: "bats",
        image: "bat.jpeg",
        description: "Professional grade cricket bat made from premium English willow"
    },
    {
        id: 2,
        name: "Match Cricket Ball",
        price: 24.99,
        category: "balls",
        image: "ball.jpeg",
        description: "Official match cricket ball with premium leather construction"
    },
    {
        id: 3,
        name: "Batting Gloves",
        price: 45.99,
        category: "protection",
        image: "gloves.jpeg",
        description: "Premium batting gloves with extra padding for maximum protection"
    },
    {
        id: 4,
        name: "Cricket Helmet",
        price: 89.99,
        category: "protection",
        image: "helmet.jpeg",
        description: "Professional cricket helmet with adjustable grill and superior protection"
    },
    {
        id: 5,
        name: "Team Jersey",
        price: 59.99,
        category: "clothing",
        image: "jersey.jpeg",
        description: "Official team jersey made with breathable fabric"
    },
    {
        id: 6,
        name: "Cricket Shoes",
        price: 79.99,
        category: "accessories",
        image: "shoes.jpeg",
        description: "Specialized cricket shoes with superior grip and comfort"
    }
];

// Shopping cart state
let cart = [];
let activeCategory = "all";
let priceRange = "all";

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    setupEventListeners();
    updateCartDisplay(); // Initialize cart display
    updateCartCount();
});

function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.category;
            displayProducts();
        });
    });

    // Price filter
    document.querySelector('#price-filter').addEventListener('change', (e) => {
        priceRange = e.target.value;
        displayProducts();
    });

    // Search functionality
    document.querySelector('#search-products').addEventListener('input', (e) => {
        const searchQuery = e.target.value.toLowerCase();
        filterProducts(searchQuery);
    });

    // Cart button
    document.querySelector('#cart-btn').addEventListener('click', toggleCart);

    // Close cart button
    document.querySelector('.close-cart').addEventListener('click', toggleCart);

    // Checkout button
    document.querySelector('#checkout-btn').addEventListener('click', handleCheckout);

    // Modal overlay click to close
    document.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeQuickView();
            document.querySelector('#cart-modal').classList.remove('active');
            e.target.classList.remove('active');
        }
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('img').src
            };
            
            addToCart(product);
        });
    });
}

function displayProducts() {
    const productsContainer = document.querySelector('#products-container');
    productsContainer.innerHTML = '';

    const filteredProducts = filterProductsByCategoryAndPrice();

    // Create a grid container for products
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    productsContainer.appendChild(productsGrid);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p class="product-description">${product.description}</p>
        <button class="add-to-cart-btn" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
    `;

    // Add to cart functionality
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
    });

    // Quick view functionality
    card.querySelector('.product-image').addEventListener('click', () => {
        showQuickView(product);
    });

    return card;
}

function filterProductsByCategoryAndPrice() {
    return products.filter(product => {
        const categoryMatch = activeCategory === "all" || product.category === activeCategory;
        const priceMatch = matchesPriceRange(product.price);
        return categoryMatch && priceMatch;
    });
}

function matchesPriceRange(price) {
    switch(priceRange) {
        case "0-50": return price <= 50;
        case "51-100": return price > 50 && price <= 100;
        case "101-200": return price > 100 && price <= 200;
        case "201+": return price > 200;
        default: return true;
    }
}

function filterProducts(searchQuery) {
    const productsGrid = document.querySelector('.products-grid');
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchQuery) ||
               product.description.toLowerCase().includes(searchQuery);
    });

    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function addToCart(product) {
    cart.push(product);
    showNotification(`${product.name} added to cart!`);
    updateCartCount();
}

function updateCartDisplay() {
    const cartItems = document.querySelector('#cart-items');
    const cartTotalAmount = document.querySelector('#cart-total-amount');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotalAmount.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${(item.price * 1).toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
                </div>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        // Quantity controls
        cartItem.querySelector('.minus').addEventListener('click', () => updateQuantity(item, -1));
        cartItem.querySelector('.plus').addEventListener('click', () => updateQuantity(item, 1));
        cartItem.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item));

        cartItems.appendChild(cartItem);
    });

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(item, change) {
    const index = cart.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
        const quantityElement = document.querySelector(`.cart-item:nth-child(${index + 1}) .quantity`);
        let quantity = parseInt(quantityElement.textContent) + change;
        
        if (quantity <= 0) {
            removeFromCart(item);
            return;
        }
        
        quantityElement.textContent = quantity;
        updateCartDisplay();
    }
}

function removeFromCart(item) {
    const index = cart.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
        showNotification(`${item.name} removed from cart`);
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function toggleCart() {
    const cartModal = document.querySelector('#cart-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    if (!cartModal) return;
    
    cartModal.classList.toggle('active');
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
    
    if (cartModal.classList.contains('active')) {
        updateCartDisplay(); // Refresh cart contents when opening
    }
}

function showQuickView(product) {
    const quickViewModal = document.querySelector('.quick-view-modal');
    quickViewModal.innerHTML = `
        <div class="quick-view-content">
            <img src="${product.image}" alt="${product.name}" class="quick-view-image">
            <div class="quick-view-details">
                <h2>${product.name}</h2>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            </div>
            <button class="close-quick-view">&times;</button>
        </div>
    `;

    quickViewModal.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
        closeQuickView();
    });

    quickViewModal.querySelector('.close-quick-view').addEventListener('click', closeQuickView);

    quickViewModal.classList.add('active');
    document.querySelector('.modal-overlay').classList.add('active');
}

function closeQuickView() {
    document.querySelector('.quick-view-modal').classList.remove('active');
    document.querySelector('.modal-overlay').classList.remove('active');
}

function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }

    // Here you would typically integrate with a payment gateway
    alert('Proceeding to checkout...');
    // Reset cart after successful checkout
    cart = [];
    updateCartDisplay();
    updateCartCount();
    toggleCart();
    showNotification('Thank you for your purchase!');
} 