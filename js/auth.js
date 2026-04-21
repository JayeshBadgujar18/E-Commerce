// ==========================================
// auth.js - Authentication Module
// Replaces PHP backend with localStorage
// ==========================================

const Auth = {
  // Get all registered users from localStorage
  getUsers() {
    return JSON.parse(localStorage.getItem('shopease_users')) || [];
  },

  // Save users array to localStorage
  saveUsers(users) {
    localStorage.setItem('shopease_users', JSON.stringify(users));
  },

  // Get current logged-in user session
  getCurrentUser() {
    const session = localStorage.getItem('shopease_session');
    return session ? JSON.parse(session) : null;
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Register a new user
  register(username, email, password) {
    const users = this.getUsers();

    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username already exists!' };
    }

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered!' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Invalid email format!' };
    }

    // Validate password length
    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters!' };
    }

    // Create user object
    const newUser = {
      id: Date.now(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password, // In a real app, this would be hashed
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Registration successful!' };
  },

  // Login a user
  login(usernameOrEmail, password) {
    const users = this.getUsers();
    const input = usernameOrEmail.trim().toLowerCase();

    const user = users.find(
      u => (u.username.toLowerCase() === input || u.email.toLowerCase() === input) && u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid username/email or password!' };
    }

    // Create session
    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('shopease_session', JSON.stringify(session));
    return { success: true, message: 'Login successful!' };
  },

  // Logout current user
  logout() {
    localStorage.removeItem('shopease_session');
  },

  // Update navigation based on login state
  updateNav() {
    const navUl = document.querySelector('nav ul');
    if (!navUl) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (this.isLoggedIn()) {
      const user = this.getCurrentUser();
      navUl.innerHTML = `
        <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
        <li><a href="products.html" class="${currentPage === 'products.html' ? 'active' : ''}">Products</a></li>
        <li><a href="product-seo.html" class="${currentPage === 'product-seo.html' ? 'active' : ''}">Deals</a></li>
        <li><a href="checkout.html" class="${currentPage === 'checkout.html' ? 'active' : ''}">Checkout</a></li>
        <li><a href="dashboard.html" class="${currentPage === 'dashboard.html' ? 'active' : ''}">Dashboard</a></li>
        <li><a href="#" id="nav-logout-btn" class="nav-logout">Logout</a></li>
      `;
      // Attach logout handler
      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Auth.logout();
          window.location.href = 'login.html';
        });
      }
    } else {
      navUl.innerHTML = `
        <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
        <li><a href="products.html" class="${currentPage === 'products.html' ? 'active' : ''}">Products</a></li>
        <li><a href="product-seo.html" class="${currentPage === 'product-seo.html' ? 'active' : ''}">Deals</a></li>
        <li><a href="checkout.html" class="${currentPage === 'checkout.html' ? 'active' : ''}">Checkout</a></li>
        <li><a href="login.html" class="${currentPage === 'login.html' ? 'active' : ''}">Login</a></li>
        <li><a href="register.html" class="${currentPage === 'register.html' ? 'active' : ''}">Register</a></li>
      `;
    }
  },

  // Protect a page - redirect to login if not logged in
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// Update nav on every page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.updateNav();
});
