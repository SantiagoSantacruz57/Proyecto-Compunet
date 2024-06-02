document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    
   
});



function loadOrders() {
    fetch('resources/orders.json')
        .then(response => response.json())
        .then(data => {
            const ordersGrid = document.getElementById('orders-grid');
            ordersGrid.innerHTML = ''; // Clear existing content

            data.orders.forEach(order => {
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
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}