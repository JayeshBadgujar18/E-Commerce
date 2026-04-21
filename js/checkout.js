// ==========================================
// checkout.js - Checkout Page Logic
// ==========================================

function initCheckoutPage() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  if (!cartItemsEl) return;

  function displayCart() {
    const items = Cart.getItems();

    if (items.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="empty-cart">
          <span class="empty-cart-icon">🛒</span>
          <p>Your cart is empty</p>
          <a href="products.html" class="btn" style="display:inline-block;margin-top:15px;">Browse Products</a>
        </div>`;
      cartTotalEl.textContent = '0.00';
      return 0;
    }

    let total = 0;
    cartItemsEl.innerHTML = items.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-image">${item.image || '🛒'}</span>
            <div>
              <strong>${item.name}</strong>
              <span class="cart-item-price">$${item.price.toFixed(2)} each</span>
            </div>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="qty-btn" onclick="updateQty(${index}, ${item.quantity - 1})">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="updateQty(${index}, ${item.quantity + 1})">+</button>
            </div>
            <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
            <button class="remove-btn" onclick="removeCartItem(${index})" title="Remove item">✕</button>
          </div>
        </div>
      `;
    }).join('');

    cartTotalEl.textContent = total.toFixed(2);
    return total;
  }

  // Make functions globally accessible
  window.updateQty = function(index, qty) {
    Cart.updateQuantity(index, qty);
    displayCart();
  };

  window.removeCartItem = function(index) {
    Cart.removeItem(index);
    displayCart();
  };

  window.clearCart = function() {
    if (confirm('Are you sure you want to clear your cart?')) {
      Cart.clear();
      displayCart();
    }
  };

  // Simulate checkout (since we removed PayPal dependency)
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const items = Cart.getItems();
      if (items.length === 0) {
        Cart.showNotification('Your cart is empty!');
        return;
      }
      if (!Auth.isLoggedIn()) {
        Cart.showNotification('Please login to checkout!');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }
      // Simulate order placement
      const total = Cart.getTotal();
      const orderId = 'SE-' + Date.now().toString(36).toUpperCase();
      Cart.clear();
      displayCart();

      // Show success modal
      showOrderSuccess(orderId, total);
    });
  }

  displayCart();
}

function showOrderSuccess(orderId, total) {
  const overlay = document.createElement('div');
  overlay.className = 'order-overlay';
  overlay.innerHTML = `
    <div class="order-modal">
      <div class="order-success-icon">🎉</div>
      <h2>Order Placed!</h2>
      <p>Thank you for your purchase!</p>
      <div class="order-details">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      </div>
      <button class="btn" onclick="this.closest('.order-overlay').remove(); window.location.href='products.html';">Continue Shopping</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('order-overlay-show'));
}

document.addEventListener('DOMContentLoaded', () => {
  initCheckoutPage();
});
