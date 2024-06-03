var currentUserName = localStorage.getItem('currentUserName') || "";
var currentUserType = localStorage.getItem('currentUserType') || "";
var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

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
    } else {
        loadProducts();
        document.getElementById('toggle-cart').addEventListener('click', toggleCart);
        loadUser();
        loadCart();
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
    showManageAccountPopup()
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
    const basketItems = document.querySelector('#cart');
    const item = document.createElement('li');
    item.textContent = `${productName} - $${productPrice}`;
    basketItems.appendChild(item);

    const total = document.getElementById('total');
    total.textContent = (parseFloat(total.textContent) + productPrice).toFixed(2);

    // Store cart items in localStorage
    cartItems.push({ name: productName, price: productPrice, image: productImage });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}



function loadCart() {
    console.log('loadCart called');
    const basketItems = document.querySelector('#cart');
    const total = document.getElementById('total');

    basketItems.innerHTML = '';
    let totalAmount = 0;

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price}`;
        basketItems.appendChild(listItem);
        totalAmount += item.price;
    });

    total.textContent = totalAmount.toFixed(2);
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
                <p>$${item.price.toFixed(2)}</p>
            </div>
        `;
        checkoutGrid.appendChild(itemDiv);
        totalAmount += item.price;
    });

    checkoutTotal.textContent = totalAmount.toFixed(2);
}


function loadProducts() {
    console.log('loadProducts called');
    fetch('resources/products.json')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.getElementById('product-grid');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="resources/productImages/${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                        <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                    </div>
                `;
                productGrid.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error loading products:', error));
}

function toggleCart() {
    console.log('toggleCart called');
    const shoppingCart = document.getElementById('shopping-cart');
    const mainContent = document.querySelector('.main-content');
    const isVisible = shoppingCart.classList.toggle('visible');
    mainContent.classList.toggle('cart-visible', isVisible);
}

function addButton() {
    console.log('add Button called');
    const addButton = document.getElementById('add-product-button');
    const isVisible = addButton.classList.add('visible');
}

function redirectAddProduct(){
    window.location.href = 'admin.html';
}

function redirectCheckout(){
    window.location.href = 'checkout.html'
}


function loadUser() {
    console.log('loadUser called');
    const logInButton = document.getElementById('manage-account');
    console.log("currentuserType " +  currentUserType)
    console.log("currentUserName" +   currentUserName)

    if (currentUserType === "client") {
        logInButton.textContent = `Welcome, ${currentUserName}`;
    } else if (currentUserType === "admin") {
        logInButton.textContent = `Admin, ${currentUserName}`;
        addButton()
    } else {
        logInButton.textContent = 'Log In';
    }
}

function handleLogin(event) {
    console.log('handleLogin called');
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var login = false; 
    var userType = "";

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
    const productRating = document.getElementById('productRating').value;
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
    formData.append('productRating', productRating);

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
        .then(data => {
            const ordersGrid = document.getElementById('orders-grid');
            ordersGrid.innerHTML = ''; 

            data.orders.forEach(order => {
                
                if(currentUserName === order.user){
                
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order';
                


                let innerHtml = `
                    <div>
                        <label>Date: ${order.date}</label><br>
                        <label>Total Price: $${order.totalPrice.toFixed(2)}</label><br>
                `;

                order.products.forEach(product => {
                    innerHtml += `
                        <div class="product">
                            <img src="resources/productImages/${product.productImage}" alt="${product.productName}" style="width: 100px;">
                            <label>${product.productName}</label><br>
                            <label>Product Price: $${product.productPrice.toFixed(2)}</label><br>
                            
                        </div>
                            
                        
                    `;
                });

                innerHtml += '</div>'
                orderDiv.innerHTML = innerHtml;
                ordersGrid.appendChild(orderDiv);
            }
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}