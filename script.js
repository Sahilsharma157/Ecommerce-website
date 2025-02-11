const mockProducts = [
    { id: 1, name: "Stylish Laptop", price: 999.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Smart Phone", price: 499.99, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Wireless Headphones", price: 99.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Tablet Pro", price: 299.99, image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Fitness Smartwatch", price: 199.99, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "4K Smart TV", price: 799.99, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Gaming Console", price: 399.99, image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Digital Camera", price: 599.99, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
];

let cart = [];
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    setupNavigation();
    setupAuthForm();
});

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    mockProducts.forEach(product => {
        const productElement = createProductElement(product);
        productList.appendChild(productElement);
    });
}

function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})" class="btn">Add to Cart</button>
    `;
    return productDiv;
}

function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification(`${product.name} added to cart!`);

        fetch('http://localhost:5000/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: product.name, price: product.price })
        })
        .then(response => response.json())
        .then(data => {
            product.id = data.id;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    updateCartCount();
    displayCart();
    showNotification(`${removedItem.name} removed from cart!`);

    fetch(`http://localhost:5000/remove-product/${removedItem.id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function setupNavigation() {
    const homeLink = document.getElementById('home-link');
    const productsLink = document.getElementById('products-link');
    const cartLink = document.getElementById('cart-link');
    const loginLink = document.getElementById('login-link');
    const heroSection = document.getElementById('hero');
    const productsSection = document.getElementById('products');
    const cartSection = document.getElementById('cart');
    const loginSection = document.getElementById('login');

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        heroSection.style.display = 'block';
        productsSection.style.display = 'block';
        cartSection.style.display = 'none';
        loginSection.style.display = 'none';
    });

    productsLink.addEventListener('click', (e) => {
        e.preventDefault();
        heroSection.style.display = 'none';
        productsSection.style.display = 'block';
        cartSection.style.display = 'none';
        loginSection.style.display = 'none';
    });

    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        heroSection.style.display = 'none';
        productsSection.style.display = 'none';
        cartSection.style.display = 'block';
        loginSection.style.display = 'none';
        displayCart();
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        heroSection.style.display = 'none';
        productsSection.style.display = 'none';
        cartSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" class="btn btn-remove">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    cartTotal.textContent = `₹${total.toFixed(2)}`;

    // Add checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
    checkoutBtn.onclick = showCheckoutForm;
}

function showCheckoutForm() {
    const cartSection = document.getElementById('cart');
    cartSection.innerHTML += `
        <div id="checkout-form">
            <h3>Checkout</h3>
            <form id="delivery-form">
                <div class="form-group">
                    <label for="address">Address:</label>
                    <input type="text" id="address" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number:</label>
                    <input type="tel" id="phone" required>
                </div>
                <button type="submit" class="btn">Place Order (Cash on Delivery)</button>
            </form>
        </div>
    `;

    document.getElementById('delivery-form').onsubmit = processCheckout;
}

function processCheckout(e) {
    e.preventDefault();
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phone').value;

    if (!isLoggedIn) {
        showNotification('Please log in to complete your order.');
        return;
    }

    const cartItems = cart.map(item => ({ id: item.id, quantity: 1 })); // Assuming quantity is 1 for simplicity

    fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: 1, // Replace with actual user ID from login
            address,
            phoneNumber,
            cartItems
        })
    })
    .then(response => response.json())
    .then(data => {
        if  (data.message) {
            showNotification(data.message);
            cart = [];
            updateCartCount();
            displayCart();
        } else {
            showNotification(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred during checkout');
    });
}

function setupAuthForm() {
    const authForm = document.getElementById('auth-form');
    const toggleModeButton = document.getElementById('toggle-mode');
    let isLoginMode = true;

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        
        fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showNotification(data.message);
                if (!isLoginMode) {
                    isLoginMode = true;
                    updateAuthFormUI();
                }
                if (isLoginMode) {
                    isLoggedIn = true;
                    updateUIForLoggedInUser(email);
                }
            } else {
                showNotification(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred during authentication');
        });
    });

    toggleModeButton.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        updateAuthFormUI();
    });

    function updateAuthFormUI() {
        const submitButton = authForm.querySelector('button[type="submit"]');
        const formTitle = document.getElementById('auth-form-title');
        
        if (isLoginMode) {
            submitButton.textContent = 'Login';
            formTitle.textContent = 'Login to Your Account';
            toggleModeButton.textContent = "Don't have an account? Register";
        } else {
            submitButton.textContent = 'Register';
            formTitle.textContent = 'Create an Account';
            toggleModeButton.textContent = 'Already have an account? Login';
        }
    }

    updateAuthFormUI();
}

function updateUIForLoggedInUser(email) {
    const loginLink = document.getElementById('login-link');
    loginLink.textContent = `Welcome, ${email}`;
    loginLink.href = '#';
    loginLink.onclick = (e) => {
        e.preventDefault();
        logout();
    };
    document.getElementById('login').style.display = 'none';
    document.getElementById('products').style.display = 'block';
}

function logout() {
    isLoggedIn = false;
    const loginLink = document.getElementById('login-link');
    loginLink.textContent = 'Login';
    loginLink.onclick = null;
    showNotification('You have been logged out');
}
