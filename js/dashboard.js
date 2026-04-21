// ==========================================
// dashboard.js - Dashboard Page Logic
// ==========================================

function initDashboard() {
  // Protect this page
  if (!Auth.requireAuth()) return;

  const user = Auth.getCurrentUser();
  const usernameEl = document.getElementById('username');
  const userEmailEl = document.getElementById('user-email');
  const memberSinceEl = document.getElementById('member-since');
  const orderCountEl = document.getElementById('order-count');
  const cartCountEl = document.getElementById('dash-cart-count');
  const totalSpentEl = document.getElementById('total-spent');

  if (usernameEl) usernameEl.textContent = user.username;
  if (userEmailEl) userEmailEl.textContent = user.email;
  if (memberSinceEl) {
    const date = new Date(user.loggedInAt);
    memberSinceEl.textContent = date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Show cart stats
  if (cartCountEl) cartCountEl.textContent = Cart.getCount();
  if (totalSpentEl) totalSpentEl.textContent = '$' + Cart.getTotal().toFixed(2);
  if (orderCountEl) orderCountEl.textContent = '0'; // Simulated

  // Logout button
  const logoutBtn = document.getElementById('dashboard-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
      window.location.href = 'login.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});
