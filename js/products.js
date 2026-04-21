// ==========================================
// products.js - Products Data & Rendering
// ==========================================

const ProductsData = [
  { id: 1, name: "Smartphone X Pro", category: "Electronics", price: 699, image: "📱", description: "Latest 5G, 108MP Camera" },
  { id: 2, name: "UltraBook Pro", category: "Electronics", price: 1299, image: "💻", description: "Intel i7, 16GB RAM, 512GB SSD" },
  { id: 3, name: "Wireless Headphones", category: "Electronics", price: 199, image: "🎧", description: "Noise Cancelling, 40h Battery" },
  { id: 4, name: "Smart Watch", category: "Electronics", price: 299, image: "⌚", description: "Fitness Tracker, Heart Rate Monitor" },
  { id: 5, name: "Classic T-Shirt", category: "Clothing", price: 24.99, image: "👕", description: "100% Organic Cotton" },
  { id: 6, name: "Designer Jeans", category: "Clothing", price: 79.99, image: "👖", description: "Slim Fit, Premium Denim" },
  { id: 7, name: "Winter Jacket", category: "Clothing", price: 149.99, image: "🧥", description: "Waterproof, Thermal Lined" },
  { id: 8, name: "Running Shoes", category: "Clothing", price: 89.99, image: "👟", description: "Lightweight, Breathable" },
  { id: 9, name: "Coffee Maker", category: "Home", price: 89.99, image: "☕", description: "Programmable, 12-Cup" },
  { id: 10, name: "Air Fryer", category: "Home", price: 129.99, image: "🍟", description: "5.8QT, Digital Display" },
  { id: 11, name: "Robot Vacuum", category: "Home", price: 299.99, image: "🤖", description: "Smart Mapping, Auto-Charge" },
  { id: 12, name: "LED Floor Lamp", category: "Home", price: 59.99, image: "💡", description: "Dimmable, Modern Design" },
  { id: 13, name: "Bestseller Novel", category: "Books", price: 14.99, image: "📖", description: "Award-winning fiction" },
  { id: 14, name: "Cookbook Collection", category: "Books", price: 34.99, image: "📚", description: "100+ Recipes" },
  { id: 15, name: "Self-Help Guide", category: "Books", price: 19.99, image: "📘", description: "Personal Development" }
];

// Products page logic
function initProductsPage() {
  const container = document.getElementById('productContainer');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!container) return;

  let currentCategory = 'all';
  let searchTerm = '';

  // Check for category in URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    currentCategory = categoryParam;
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === categoryParam) {
        btn.classList.add('active');
      }
    });
  }

  function renderProducts() {
    const filtered = ProductsData.filter(product => {
      const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<p class="no-results" style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">😕 No products found. Try a different search term.</p>';
      return;
    }

    container.innerHTML = filtered.map(product => `
      <div class="product-card" data-aos="fade-up">
        <div class="product-image">${product.image}</div>
        <h3>${product.name}</h3>
        <p style="color:#888;font-weight:400;">${product.description}</p>
        <p class="product-category">${product.category}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="btn btn-add-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
          <span class="btn-icon">🛒</span> Add to Cart
        </button>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderProducts();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });

  renderProducts();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initProductsPage();
});
