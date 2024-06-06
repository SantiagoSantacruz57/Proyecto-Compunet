var currentUserName = localStorage.getItem('currentUserName') || "";
var currentUserType = localStorage.getItem('currentUserType') || "";
var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
var allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    if (window.location.pathname.includes('user_login.html')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    } else if (window.location.pathname.includes('admin.html')) {
        document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    } else if (window.location.pathname.includes('orders.html')) {
        loadOrders();
    } else if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutItems();
        document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
    } else if (window.location.pathname.includes('user_register.html')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }else {
        loadProducts();
        document.getElementById('toggle-cart').addEventListener('click', toggleCart);
        loadUser();
        loadCart();
        document.getElementById('clear-cart').addEventListener('click', clearCart);
        document.getElementById('searchButton').addEventListener('click', searchProducts);
    }
});

function redirectToLogin() {
    console.log('redirectToLogin called');
    if (!currentUserName) {
        window.location.href = 'user_login.html';
    } else {
        showManageAccountPopup();
    }
}

function showManageAccountPopup() {
    console.log('showManageAccountPopup called');
    const popup = document.getElementById('manage-account-popup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

function logOut() {
    console.log('logOut called');
    currentUserName = "";
    currentUserType = "";
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserType');
    showManageAccountPopup();
    loadUser();
}

function redirectToOrders() {
    console.log('redirectToOrders called');
    if (currentUserType === 'client') {
        window.location.href = 'orders.html';
    } else {
        alert('Only clients can view orders.');
    }
}

function addToCart(productName, productPrice, productImage) {
    console.log('addToCart called');
    const existingItem = cartItems.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCart();
 
}

function loadCart() {
    console.log('loadCart called');
    const basketItems = document.querySelector('#cart');
    const total = document.getElementById('total');

    basketItems.innerHTML = '';
    let totalAmount = 0;

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price} x${item.quantity}`;

        // Add remove button to each cart item
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.name);
        listItem.appendChild(removeButton);

        basketItems.appendChild(listItem);
        totalAmount += item.price * item.quantity;
    });

    total.textContent = totalAmount.toFixed(2);
}

function removeFromCart(productName) {
    console.log('removeFromCart called');
    const itemIndex = cartItems.findIndex(item => item.name === productName);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity--;
        if (cartItems[itemIndex].quantity === 0) {
            cartItems.splice(itemIndex, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        loadCart();
    }
}

function clearCart() {
    console.log('clearCart called');
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCart();
}

function loadCheckoutItems() {
    console.log('loadCheckoutItems called');
    const checkoutGrid = document.getElementById('checkout-grid');
    const checkoutTotal = document.getElementById('checkout-total');

    checkoutGrid.innerHTML = '';
    let totalAmount = 0;

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        itemDiv.innerHTML = `
            <img src="resources/productImages/${item.image}" alt="${item.name}">
            <div class="product-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x${item.quantity}</p>
            </div>
        `;
        checkoutGrid.appendChild(itemDiv);
        totalAmount += item.price * item.quantity;
    });

    checkoutTotal.textContent = totalAmount.toFixed(2);
}


function toggleCart() {
    console.log('toggleCart called');
    const shoppingCart = document.getElementById('shopping-cart');
    const mainContent = document.querySelector('.main-content');
    const isVisible = shoppingCart.classList.toggle('visible');
    mainContent.classList.toggle('cart-visible', isVisible);
}


function toggleCartProduct(){
    console.log('toggleCartProduct called');
    const shoppingCart = document.getElementById('shopping-cart');
    const mainContent = document.querySelector('.main-content');
    if (!shoppingCart.classList.contains('visible')) {
        const isVisible = shoppingCart.classList.toggle('visible');
        mainContent.classList.toggle('cart-visible', isVisible);
    }

}




function addButton() {
    console.log('addButton called');
    const addButton = document.getElementById('add-product-button');
    const isVisible = addButton.classList.add('visible');
}

function redirectAddProduct() {
    window.location.href = 'admin.html';
}

function redirectCheckout() {
    console.log('redirectToCheckout called');

    if (currentUserType === 'client') {

        if(cartItems.length !== 0){
        window.location.href = 'checkout.html';
        } else {
            alert('Empty Cart') 
        }

    } else {
        alert('Only clients can buy products.');
    }
    
}

function redirectToHome() {
    window.location.href = 'index.html';
}

function loadUser() {
    console.log('loadUser called');
    const logInButton = document.getElementById('manage-account');
    console.log("currentuserType " + currentUserType);
    console.log("currentUserName" + currentUserName);

    if (currentUserType === "client") {
        logInButton.textContent = `Welcome, ${currentUserName}`;
    } else if (currentUserType === "admin") {
        logInButton.textContent = `Admin, ${currentUserName}`;
        addButton();
    } else {
        logInButton.textContent = 'Log In';
    }
}



function handleLogin(event) {
    console.log('handleLogin called');
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let login = false;
    let userType = "";

    fetch('resources/users.json')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                if (user.username === username && user.password === password) {
                    login = true;
                    userType = user.type;
                }
            });

            if (login) {
                document.getElementById('message').textContent = "Login Correcto!, redirigiendo";
                document.getElementById('message').style.color = "green";

                localStorage.setItem('currentUserName', username);
                localStorage.setItem('currentUserType', userType);

                setTimeout(() => {
                    if (userType === 'client') {
                        window.location.href = 'index.html';
                    } else if (userType === 'admin') {
                        window.location.href = 'admin.html';
                    }
                }, 1500);
            } else {
                document.getElementById('message').textContent = "Invalid username or password.";
                document.getElementById('message').style.color = "red";
            }
        })
        .catch(error => console.error('Error loading users:', error));
}

function handleAddProduct(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value).toFixed(2);
    const productImage = document.getElementById('productImage').files[0];
    const messageElement = document.getElementById('message');

    if (!productImage) {
        messageElement.textContent = "Please select an image.";
        messageElement.style.color = "red";
        return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productImage', productImage);

    fetch('/api/addProduct', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageElement.textContent = "Product added successfully!";
                messageElement.style.color = "green";
            } else {
                messageElement.textContent = "Error adding product.";
                messageElement.style.color = "red";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageElement.textContent = "Error adding product.";
            messageElement.style.color = "red";
        });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'resources', 'productImages'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

function loadOrders() {
    fetch('resources/orders.json')
        .then(response => response.json())
        .then(orders => {
            const ordersGrid = document.getElementById('orders-grid');
            ordersGrid.innerHTML = '';

            orders.forEach(order => {
                if (currentUserName === order.user) {
                    const orderDiv = document.createElement('div');
                    orderDiv.className = 'order';

                    let innerHtml = `
                        <div>
                            <label>Date: ${new Date(order.date).toLocaleString()}</label><br>
                            <label>Address: ${order.address}</label><br>
                            <label>Payment Method: ${order.paymentMethod}</label><br>
                            <label>Total Price: $${order.total.toFixed(2)}</label><br>
                    `;

                    order.items.forEach(item => {
                        innerHtml += `
                            <div class="product">
                                <img src="resources/productImages/${item.image}" alt="${item.name}" style="width: 100px;">
                                <label>${item.name}</label><br>
                                <label>Product Price: $${item.price.toFixed(2)} x${item.quantity}</label><br>
                            </div>
                        `;
                    });

                    innerHtml += '</div>';
                    orderDiv.innerHTML = innerHtml;
                    ordersGrid.appendChild(orderDiv);
                }
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}


function searchProducts() {
    var searchBar = document.getElementById('searchBar')
    const query = searchBar.value.toLowerCase();
    console.log('Search query:', query);
    console.log('All products:', allProducts);
    const filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(query));
    console.log('Filtered products:', filteredProducts);
    displayProducts(filteredProducts);
    if (filteredProducts.length === 0) {
        showPopup();
        searchBar.value = ""
        searchProducts()

    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="resources/productImages/${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}'); toggleCartProduct()">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productDiv);
    });
}

function loadProducts() {
    console.log('loadProducts called');
    fetch('resources/products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            console.log('Products loaded:', allProducts);
            displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

function showPopup() {
    const popup = document.getElementById('no-results-popup');
    if (popup) {
        popup.style.display = 'flex';
    } else {
        console.error('Popup element not found');
    }
}

function closePopup() {
    const popup = document.getElementById('no-results-popup');
    if (popup) {
        popup.style.display = 'none';
    } else {
        console.error('Popup element not found');
    }
}

function handleRegister(event) {
    event.preventDefault();
    console.log('handleRegister called');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        message.style.color = 'red';
        return;
    }

    const user = { username, password, type: 'client' };

    fetch('/api/registerUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            message.textContent = 'Registration successful! Redirecting to login...';
            message.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'user_login.html';
            }, 1500);
        } else {
            message.textContent = 'Error: ' + data.message;
            message.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        message.textContent = 'Error registering user.';
        message.style.color = 'red';
    });
}

function redirectToRegister() {
    window.location.href = 'user_register.html';
}

function handleCheckout(event) {
    event.preventDefault();
    console.log('handleCheckout called');

    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Save the order to localStorage or send it to the server
    const order = {
        user: currentUserName,
        address: address,
        paymentMethod: paymentMethod,
        items: cartItems,
        total: parseFloat(document.getElementById('checkout-total').textContent),
        date: new Date().toISOString()
    };

    fetch('/api/saveOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear the cart
            cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Generate the order image
            generateOrderImage(order);

            // Show thank you popup
            document.getElementById('thankYouPopup').style.display = 'block';
        } else {
            console.error('Error saving order:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function preloadImage(src, callback) {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = src;
}

function generateOrderImage(order) {
    const canvas = document.getElementById('orderCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    const baseHeight = 260;
    const itemHeight = 30;
    const totalHeight = baseHeight + itemHeight * order.items.length;

    canvas.width = 400;
    canvas.height = totalHeight;


    // Load the image
    preloadImage('resources/logo.png', (img) => {
        // Set background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);



        // Draw the image on the upper left
        ctx.drawImage(img, 20, 20, 100, 100);

        // Set text style
        ctx.fillStyle = '#000';
    
        // Draw order details
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Order for:`, 140, 30);
        ctx.font = '16px Arial';
        ctx.fillText(`${order.user}`, 240, 30);

        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Address:`, 140, 60);
        ctx.font = '16px Arial';
        ctx.fillText(`${order.address}`, 240, 60);

        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Payment Method:`, 140, 90);
        ctx.font = '16px Arial';
        ctx.fillText(`${order.paymentMethod}`, 280, 90);

        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Date:`, 140, 120);
        ctx.font = '16px Arial';
        ctx.fillText(`$${new Date(order.date).toLocaleString()}`, 200, 120);

        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Items:`, 140, 180);
     
        // Set text style for items
        ctx.font = '16px Arial';
       

        // Draw items
        let yPosition = 210;
        order.items.forEach((item, index) => {
            ctx.fillText(`${index + 1}. ${item.name} - $${item.price} x${item.quantity}`, 140, yPosition);
            yPosition += 30;
        });

        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Total: `, 140, yPosition);
        ctx.font = '16px Arial';
        ctx.fillText(`${order.total.toFixed(2)}`, 200, yPosition);

        ctx.font = 'bold 16px Arial';
        ctx.fillText("¡Thank you for your purchase!", 140, yPosition+30)

        

        // Convert canvas to image
        const orderImage = document.getElementById('orderImage');
        orderImage.src = canvas.toDataURL();
        orderImage.style.display = 'block';
    });
}

function downloadOrderImage() {
    const orderImage = document.getElementById('orderImage');
    const link = document.createElement('a');
    link.href = orderImage.src;
    link.download = 'order.png';
    link.click();
}
