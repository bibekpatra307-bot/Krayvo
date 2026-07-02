// ===== js/script.js =====

// Platform Config
const platformsList = [
  { key:'amazon', label:'Amazon', icon:'fab fa-amazon', color:'#FF9900', url:'https://amazon.in' },
  { key:'flipkart', label:'Flipkart', icon:'fas fa-store', color:'#2874f0', url:'https://flipkart.com' },
  { key:'myntra', label:'Myntra', icon:'fas fa-tshirt', color:'#e91e63', url:'https://myntra.com' },
  { key:'savana', label:'Savana', icon:'fas fa-leaf', color:'#2e7d32', url:'https://savana.com' },
  { key:'ajio', label:'Ajio', icon:'fas fa-shopping-bag', color:'#f97316', url:'https://ajo.com' },
  { key:'meesho', label:'Meesho', icon:'fas fa-gem', color:'#f54d2e', url:'https://meesho.com' }
];
const displayType = {
  amazon:'poster', flipkart:'iframe', myntra:'poster',
  savana:'iframe', ajio:'poster', meesho:'poster'
};

let activePlatform = null;
let currentCategory = 'For You';
let allProducts = [];
let wishlist = JSON.parse(localStorage.getItem('krayvo_wishlist')) || [];

// Demo Products
const categories = ["Mobile","Fashion","Beauty","Electronics","Home & Kitchen","Accessories","Books"];
const brandNames = { amazon:'AmazonBasics', flipkart:'Flipkart SmartBuy', myntra:'Myntra', savana:'Savana', ajio:'Ajio', meesho:'Meesho' };

function generateDemoProducts() {
  const prods = [];
  platformsList.forEach(plat => {
    for(let i=1;i<=20;i++){
      const cat = categories[i % categories.length];
      const price = Math.floor(Math.random()*5000)+299;
      const originalPrice = price + Math.floor(Math.random()*3000)+200;
      prods.push({
        id: `demo_${plat.key}_${i}`,
        name: `${brandNames[plat.key]||plat.label} ${cat} ${i}`,
        brand: brandNames[plat.key] || plat.label,
        price, originalPrice, category:cat, platform:plat.key,
        imageUrl: null,
        createdAt: new Date()
      });
    }
  });
  return prods;
}
allProducts = generateDemoProducts();

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const search = document.getElementById('globalSearch')?.value?.toLowerCase().trim() || '';
  let filtered = [...allProducts];
  if(search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    );
  }
  if(currentCategory !== 'For You') {
    filtered = filtered.filter(p => p.category === currentCategory);
  } else {
    const recent = [...filtered].sort((a,b)=>b.createdAt - a.createdAt).slice(0,12);
    const discounted = filtered.filter(p=>p.originalPrice && p.price < p.originalPrice).slice(0,8);
    filtered = [...recent, ...discounted].filter((v,i,a)=>a.findIndex(t=>t.id===v.id)===i);
    if(filtered.length===0) filtered = allProducts.slice(0,16);
  }
  if(filtered.length===0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;">✨ No products found.</div>';
    return;
  }
  grid.innerHTML = filtered.map(p => {
    const imgSrc = p.imageUrl || `https://via.placeholder.com/300x300?text=${encodeURIComponent(p.brand)}`;
    const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
    const plat = platformsList.find(pl=>pl.key===p.platform) || platformsList[0];
    const inWish = wishlist.includes(p.id);
    return `
      <div class="product-card">
        <div class="product-img">
          <img src="${imgSrc}" alt="${p.name}" loading="lazy">
          <span class="platform-badge"><i class="${plat.icon}"></i> ${plat.label}</span>
          <button class="wishlist-btn" onclick="toggleWishlist('${p.id}')">
            <i class="${inWish ? 'fas' : 'far'} fa-heart" style="color:${inWish ? '#e91e63' : 'inherit'}"></i>
          </button>
        </div>
        <div class="product-info">
          <div class="brand">${p.brand}</div>
          <div class="name">${p.name}</div>
          <div class="price-row">
            ${p.originalPrice ? `<span class="old-price">₹${p.originalPrice}</span>` : ''}
            <span class="price">₹${p.price}</span>
            ${discount>0 ? `<span class="discount">${discount}% OFF</span>` : ''}
          </div>
          <a href="product.html?id=${p.id}" class="btn btn-sm">View Deal →</a>
        </div>
      </div>
    `;
  }).join('');
  const title = document.getElementById('sectionTitle');
  if(title && !activePlatform) {
    title.innerHTML = `All Platforms ${currentCategory!=='For You' ? '· '+currentCategory : '· For You'} 
      <span style="background:var(--primary);color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;margin-left:8px;">${filtered.length} items</span>`;
  }
}

function renderFilters() {
  const platContainer = document.getElementById('platformFilters');
  if (platContainer) {
    platContainer.innerHTML = platformsList.map(p => `
      <button class="filter-btn" onclick="showPlatform('${p.key}')" data-platform="${p.key}">
        <i class="${p.icon}"></i> ${p.label}
      </button>
    `).join('');
  }
  const catContainer = document.getElementById('categoryFilters');
  if (catContainer) {
    const allCats = ['For You', ...categories];
    catContainer.innerHTML = allCats.map(c =>
      `<button class="filter-btn ${currentCategory===c?'active':''}" onclick="switchCategory('${c}')">${c}</button>`
    ).join('');
  }
  updateActiveButton();
}

function updateActiveButton() {
  document.querySelectorAll('.platform-filters .filter-btn').forEach(btn => {
    btn.classList.remove('active-platform');
    if(btn.dataset.platform === activePlatform) btn.classList.add('active-platform');
  });
}

// Platform display functions (poster/iframe) – same as before
function generatePosterHTML(platformKey) {
  const plat = platformsList.find(p => p.key === platformKey);
  if (!plat) return '';
  const label = plat.label;
  const icon = plat.icon;
  const color = plat.color;
  const items = Array.from({length:8}, (_,i) => `
    <div style="background:#fff;border-radius:8px;padding:8px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <div style="height:80px;background:#eef2f7;border-radius:4px;margin-bottom:6px;"></div>
      <div style="font-weight:500;font-size:0.8rem;">${label} Item ${i+1}</div>
      <div style="color:#1e2a3a;font-weight:600;">₹${Math.floor(Math.random()*5000+500)}</div>
    </div>
  `).join('');
  return `
    <div class="platform-display poster-display" data-platform="${platformKey}" style="cursor:pointer;">
      <div style="max-width:1200px;margin:0 auto;padding:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eaeef2;flex-wrap:wrap;gap:8px;">
          <div style="font-size:1.5rem;font-weight:700;display:flex;align-items:center;gap:8px;">
            <i class="${icon}" style="color:${color};"></i> ${label}
          </div>
          <div style="flex:1 1 200px;background:#f1f3f6;border-radius:30px;padding:6px 16px;color:#777;display:flex;align-items:center;gap:10px;font-size:0.9rem;">
            <i class="fas fa-search"></i> <span>Search ${label}...</span>
          </div>
          <div><i class="fas fa-user"></i> <i class="fas fa-shopping-cart" style="margin-left:12px;"></i></div>
        </div>
        <div style="display:flex;gap:16px;font-size:0.85rem;color:#1e2a3a;padding:10px 0;border-bottom:1px solid #eaeef2;flex-wrap:wrap;">
          <span>Electronics</span> <span>Fashion</span> <span>Home</span> <span>Beauty</span> <span>Mobiles</span> <span>Books</span>
        </div>
        <div style="margin:16px 0;height:120px;background:linear-gradient(135deg,#e0e7ef,#cbd5e1);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#1e2a3a;font-weight:600;">
          🔥 Big ${label} Sale – Up to 70% Off
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin:16px 0;">
          ${items}
        </div>
        <div style="border-top:1px solid #eaeef2;padding:16px 0 8px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;color:#5f6c80;font-size:0.75rem;">
          <div style="display:flex;gap:20px;">
            <span>About</span> <span>Contact</span> <span>Terms</span> <span>Privacy</span>
          </div>
          <span>© 2026 ${label} – All rights reserved</span>
        </div>
      </div>
    </div>
  `;
}

function initPlatformDisplays() {
  const container = document.getElementById('platformDisplayContainer');
  if (!container) return;
  const html = platformsList
    .filter(p => p.key !== 'krayvo')
    .map(p => {
      const type = displayType[p.key] || 'poster';
      if (type === 'poster') {
        return generatePosterHTML(p.key);
      } else {
        return `
          <div class="platform-display iframe-display" data-platform="${p.key}" style="position:relative;">
            <iframe src="${p.url}" allowfullscreen></iframe>
            <div class="iframe-fallback-poster" style="position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;cursor:pointer;display:none;">
              ${generatePosterHTML(p.key)}
            </div>
          </div>
        `;
      }
    })
    .join('');
  container.innerHTML = html;

  document.querySelectorAll('.poster-display').forEach(el => {
    const platformKey = el.dataset.platform;
    const plat = platformsList.find(p => p.key === platformKey);
    if (!plat) return;
    el.addEventListener('click', () => {
      if (plat.url && plat.url !== '#') window.open(plat.url, '_blank');
    });
  });

  document.querySelectorAll('.iframe-display').forEach(containerEl => {
    const iframe = containerEl.querySelector('iframe');
    const fallback = containerEl.querySelector('.iframe-fallback-poster');
    const platformKey = containerEl.dataset.platform;
    const plat = platformsList.find(p => p.key === platformKey);
    if (!plat) return;
    iframe.addEventListener('error', () => {
      iframe.style.display = 'none';
      fallback.style.display = 'block';
      fallback.addEventListener('click', () => {
        if (plat.url && plat.url !== '#') window.open(plat.url, '_blank');
      });
    });
  });
}

function showContent(type, platformKey) {
  const grid = document.getElementById('productGrid');
  const displays = document.querySelectorAll('.platform-display');
  if (grid) grid.style.display = 'none';
  displays.forEach(el => el.classList.remove('active'));
  if (type === 'products') {
    if (grid) grid.style.display = 'grid';
    return;
  }
  const display = document.querySelector(`.platform-display[data-platform="${platformKey}"]`);
  if (display) {
    display.classList.add('active');
    if (display.classList.contains('iframe-display')) {
      const iframe = display.querySelector('iframe');
      const fallback = display.querySelector('.iframe-fallback-poster');
      if (iframe) iframe.style.display = 'block';
      if (fallback) fallback.style.display = 'none';
    }
  }
}

function showPlatform(platformKey) {
  if (activePlatform === platformKey) return;
  activePlatform = platformKey;
  const type = displayType[platformKey] || 'poster';
  if (type === 'poster' || type === 'iframe') {
    showContent('platform', platformKey);
  }
  updateActiveButton();
  const plat = platformsList.find(p => p.key === platformKey);
  const title = document.getElementById('sectionTitle');
  if (title && plat) title.innerHTML = `${plat.label} · Live Store`;
}

function resetToProducts() {
  activePlatform = null;
  showContent('products');
  updateActiveButton();
  const title = document.getElementById('sectionTitle');
  if (title) {
    const count = document.querySelectorAll('.product-card').length;
    title.innerHTML = `All Platforms · For You <span style="background:var(--primary);color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;margin-left:8px;">${count} items</span>`;
  }
}

window.switchCategory = function(cat) {
  currentCategory = cat;
  resetToProducts();
  renderFilters();
  renderProducts();
};

window.handleSearch = function() {
  if (activePlatform) resetToProducts();
  renderProducts();
};

window.setSearch = function(term) {
  const input = document.getElementById('globalSearch');
  if (input) input.value = term;
  handleSearch();
};

window.toggleWishlist = function(id) {
  const index = wishlist.indexOf(id);
  if(index>-1) wishlist.splice(index,1);
  else wishlist.push(id);
  localStorage.setItem('krayvo_wishlist', JSON.stringify(wishlist));
  renderProducts();
};

window.showToast = function(msg, type='info') {
  alert(msg);
};

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', ()=>{
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if(menuBtn) {
    menuBtn.addEventListener('click', ()=>{
      document.querySelector('.nav-links').classList.toggle('open');
    });
  }
  initPlatformDisplays();
  renderFilters();
  renderProducts();
  const grid = document.getElementById('productGrid');
  if (grid) grid.style.display = 'grid';
  const container = document.getElementById('platformDisplayContainer');
  if (container) container.style.display = 'none';
});
