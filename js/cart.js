// ==========================================
// cart.js - Shopping Cart Module
// Handles all cart operations via localStorage
// ==========================================

const Cart = {
  // Get cart items from localStorage
  getItems() {
    return JSON.parse(localStorage.getItem('shopease_cart')) || [];
  },

  // Save cart to localStorage
  save(items) {
    localStorage.setItem('shopease_cart', JSON.stringify(items));
    this.updateCartBadge();
  },

  // Add item to cart
  addItem(name, price, image = '🛒') {
    const items = this.getItems();
    const existing = items.find(item => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ name, price, quantity: 1, image });
    }

    this.save(items);
    this.showNotification(`${name} added to cart!`);
  },

  // Remove item from cart by index
  removeItem(index) {
    const items = this.getItems();
    items.splice(index, 1);
    this.save(items);
  },

  // Update quantity of an item
  updateQuantity(index, quantity) {
    const items = this.getItems();
    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = quantity;
    }
    this.save(items);
  },

  // Get total price
  getTotal() {
    return this.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Get total number of items
  getCount() {
    return this.getItems().reduce((count, item) => count + item.quantity, 0);
  },

  // Clear entire cart
  clear() {
    localStorage.removeItem('shopease_cart');
    this.updateCartBadge();
  },

  // Update cart badge in navigation
  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  // Show a toast notification
  showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
      <span class="cart-toast-icon">✓</span>
      <span class="cart-toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('cart-toast-show');
    });

    // Auto-remove after 2.5 seconds
    setTimeout(() => {
      toast.classList.remove('cart-toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }
};

// Global addToCart function for onclick handlers
function addToCart(name, price, image) {
  Cart.addItem(name, price, image);
}

// Update cart badge on every page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartBadge();
});
