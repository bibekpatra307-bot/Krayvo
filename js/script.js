// Load common components and initialize theme/cart
document.addEventListener('DOMContentLoaded', async () => {
  // Load Header
  try {
    const headerResp = await fetch('components/header.html');
    const headerHTML = await headerResp.text();
    const headerEl = document.getElementById('app-header');
    if (headerEl) headerEl.innerHTML = headerHTML;
  } catch(e) { console.error('Header load failed', e); }

  // Load Footer
  try {
    const footerResp = await fetch('components/footer.html');
    const footerHTML = await footerResp.text();
    const footerEl = document.getElementById('app-footer');
    if (footerEl) footerEl.innerHTML = footerHTML;
  } catch(e) { console.error('Footer load failed', e); }

  // Initialize theme and cart count
  initTheme();
  updateCartCount();
  
  // Attach menu toggle after header is loaded (needs slight delay for dynamic content)
  setTimeout(() => {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }
  }, 100);
});

function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('krayvo_cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = count;
}

// Toast notification
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Helper to get product image
function getProductImage(product) {
  if (product.imageData && product.imageData.startsWith('data:image')) return product.imageData;
  if (product.imageUrl && product.imageUrl.trim() !== '') return product.imageUrl;
  const emojis = { Mobile: "📱", Fashion: "👕", Beauty: "💄", Electronics: "💻", "Home & Kitchen": "🏠", Accessories: "⌚", Books: "📚" };
  const icon = emojis[product.category] || "📦";
  return `https://placehold.co/400x400/1e293b/white?text=${icon}`;
}
