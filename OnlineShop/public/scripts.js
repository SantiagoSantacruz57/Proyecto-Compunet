var currentUserName = "q";
var currentUserType = "client";

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('toggle-cart').addEventListener('click', toggleCart);
    loadUser(); 
});


function redirectToLogin() {
    window.location.href = 'user_login.html'
}

function redirectToOrders() {
    // Assume user type is checked and determined
    const userType = 'client'; // Example: set to 'client' or 'admin'
    if (userType === 'client') {
        window.location.href = 'orders.html';
    } else {
        alert('Only clients can view orders.');
    }
}

function addToCart(productName, productPrice) {
    const basketItems = document.querySelector('#cart');
    const item = document.createElement('li');
    item.textContent = `${productName} - $${productPrice}`;
    basketItems.appendChild(item);
    
    // Update total
    const total = document.getElementById('total');
    total.textContent = (parseFloat(total.textContent) + productPrice).toFixed(2);
}

function loadProducts() {
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
                        <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                    </div>
                `;
                productGrid.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error loading products:', error));
}



function toggleCart() {
    const shoppingCart = document.getElementById('shopping-cart');
    const mainContent = document.querySelector('.main-content');
    const isVisible = shoppingCart.classList.toggle('visible');
    mainContent.classList.toggle('cart-visible', isVisible);
}

function loadUser(){
    const logInButton = document.getElementById('manage-account')

    console.log("adf")
    if(currentUserType === "client"){
        logInButton.value = `Welcome,  ${currentUserName}`
    } else if(currentUserType === "admin"){
        logInButton.value = `Admin, ${currentUserName}`
    }

}



document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var login = false; 
    var userType = "";

    fetch('resources/users.json')
    .then(response => response.json())
    .then(users => {
        users.forEach(user => {
       
            if(user.username === username && user.password === password){
                login = true;
                userType = user.type 
            } 

        });

        if (login) {
            document.getElementById('message').textContent = "Login Correcto!, redirigiendo";
            document.getElementById('message').style.color = "green";

            currentUserName = username 
            currentUserType = userType 
            
        } else {
            document.getElementById('message').textContent = "Invalid username or password.";
            document.getElementById('message').style.color = "red";
        }

    })
    .catch(error => console.error('Error loading products:', error));
});