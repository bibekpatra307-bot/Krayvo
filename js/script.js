// Load components
document.addEventListener('DOMContentLoaded', async () => {
  // Load Header
  const headerResp = await fetch('components/header.html');
  const headerHTML = await headerResp.text();
  document.getElementById('app-header').innerHTML = headerHTML;

  // Load Footer
  const footerResp = await fetch('components/footer.html');
  const footerHTML = await footerResp.text();
  document.getElementById('app-footer').innerHTML = footerHTML;

  // Initialize cart count and theme
  updateCartCount();
  initTheme();

  // Attach event listeners for dynamic elements
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
});

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
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

// Common toast notification
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
// (Add CSS for .toast in style.css)
