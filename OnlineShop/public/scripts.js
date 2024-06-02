function showManageAccountPopup() {
    const popup = document.getElementById('manage-account-popup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

function redirectToLogin(type) {
    window.location.href = type === 'admin' ? 'admin_login.html' : 'client_login.html';
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

// Example function to add items to the basket (extend as needed)
function addToCart(productName, productPrice) {
    const basketItems = document.querySelector('#cart');
    const item = document.createElement('li');
    item.textContent = `${productName} - $${productPrice}`;
    basketItems.appendChild(item);
    
    // Update total
    const total = document.getElementById('total');
    total.textContent = (parseFloat(total.textContent) + productPrice).toFixed(2);
}
