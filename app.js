const products = [
  {id:1,name:"Studio Wireless Headphones",category:"tech",label:"TECH",price:4890,image:"images/headphones.svg",badge:"BESTSELLER",description:"Enjoy your favourite audio with a clean, comfortable everyday design. These wireless headphones are a practical pick for work, travel and relaxed listening.",features:["Comfort-focused over-ear design","Wireless everyday listening","Minimal, versatile styling"]},
  {id:2,name:"Forma Everyday Watch",category:"style",label:"STYLE",price:6250,image:"images/watch.svg",badge:"NEW",description:"A refined everyday timepiece with a minimal look that pairs easily with casual and smart outfits.",features:["Clean, minimal dial","Versatile everyday styling","A thoughtful gift choice"]},
  {id:3,name:"The Daily Carry Tote",category:"living",label:"LIVING",price:2950,image:"images/bag.svg",badge:"POPULAR",description:"A simple, useful tote for carrying daily essentials. Its understated design makes it easy to take from errands to everyday plans.",features:["Everyday carry style","Simple, versatile design","Useful for daily essentials"]},
  {id:4,name:"Mini Bluetooth Speaker",category:"tech",label:"TECH",price:3490,image:"images/speaker.svg",badge:"JUST IN",description:"A compact speaker concept for bringing music and audio into your everyday spaces.",features:["Compact portable form","Wireless speaker concept","Easy everyday companion"]},
  {id:5,name:"Wireless Comfort Set",category:"accessories",label:"ACCESSORIES",price:4250,image:"images/headphones.svg",badge:"EDITOR'S PICK",description:"A practical wireless audio set with a clean design for daily use at home, at work or while travelling.",features:["Wireless convenience","Everyday comfort","Minimal design"]},
  {id:6,name:"Minimal Timepiece",category:"style",label:"STYLE",price:5590,image:"images/watch.svg",badge:"NEW",description:"A pared-back watch style made to complement a wide range of everyday looks.",features:["Minimal appearance","Easy-to-style design","Everyday accessory"]}
];
let cart = [];
try { cart = JSON.parse(localStorage.getItem("aaaivoCart") || "[]"); if (!Array.isArray(cart)) cart = []; } catch (_) { cart = []; }
const money = n => "Rs. " + Number(n || 0).toLocaleString("en-PK");
const getProduct = id => products.find(p => p.id === Number(id));
function productCard(p) {
  return `<div class="col-6 col-lg-4"><article class="product-card"><a class="product-card-link" href="product.html?id=${p.id}" aria-label="View details for ${p.name}"><div class="product-image"><span class="product-badge">${p.badge}</span><img src="${p.image}" alt="${p.name} product illustration"></div><div class="product-info"><span class="product-category">${p.label}</span><h3>${p.name}</h3></a><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-btn" type="button" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div></div></article></div>`;
}
function renderProducts(target, list) {
  const el = document.querySelector(target);
  if (el) el.innerHTML = list.map(productCard).join("") || '<div class="col-12"><p class="text-muted">No products match your search. Try another keyword.</p></div>';
}
renderProducts("#featuredProducts", products.slice(0,3));

function saveCart() { localStorage.setItem("aaaivoCart", JSON.stringify(cart)); renderCart(); }
function addToCart(id) {
  const p = getProduct(id); if (!p) return;
  const item = cart.find(x => x.id === Number(id));
  if (item) item.qty++; else cart.push({id:Number(id),qty:1});
  saveCart();
  const toastEl = document.getElementById("siteToast");
  if (toastEl && window.bootstrap) bootstrap.Toast.getOrCreateInstance(toastEl).show();
}
function changeQty(id, delta) {
  const item = cart.find(x => x.id === Number(id)); if (!item) return;
  item.qty += delta; if (item.qty < 1) cart = cart.filter(x => x.id !== Number(id));
  saveCart();
}
function cartTotal() { return cart.reduce((sum,x) => sum + ((getProduct(x.id)?.price || 0) * x.qty), 0); }
function renderCart() {
  const count = cart.reduce((n,x) => n + x.qty, 0);
  const countEl = document.getElementById("cartCount"), drawerCount = document.getElementById("drawerCount");
  const itemsEl = document.getElementById("cartItems"), subtotalEl = document.getElementById("cartSubtotal"), checkout = document.getElementById("checkoutBtn");
  if (countEl) countEl.textContent = count;
  if (drawerCount) drawerCount.textContent = `(${count})`;
  if (itemsEl) {
    itemsEl.innerHTML = cart.length ? cart.map(x => {
      const p = getProduct(x.id); if (!p) return "";
      return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div class="cart-item-info"><a href="product.html?id=${p.id}"><b>${p.name}</b></a><small>${money(p.price)}</small><div class="qty-controls"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`;
    }).join("") : '<p class="empty-cart">Your bag is taking a little break.</p>';
  }
  if (subtotalEl) subtotalEl.textContent = money(cartTotal());
  if (checkout) checkout.disabled = !cart.length;
}
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { e.preventDefault(); e.stopPropagation(); addToCart(Number(add.dataset.add)); }
  const qty = e.target.closest("[data-qty]");
  if (qty) changeQty(Number(qty.dataset.qty), Number(qty.dataset.delta));
});
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  if (!cart.length) return;
  location.href = "checkout.html";
});
renderCart();

// Header search is available on every page. Results are displayed on the catalogue page.
document.querySelectorAll(".search-toggle").forEach(btn => btn.addEventListener("click", () => {
  let panel = document.getElementById("siteSearchPanel");
  if (!panel) {
    panel = document.createElement("form");
    panel.id = "siteSearchPanel"; panel.className = "site-search-panel";
    panel.innerHTML = '<label class="visually-hidden" for="globalSearchInput">Search products</label><input id="globalSearchInput" type="search" placeholder="What are you looking for?" autocomplete="off"><button type="submit" aria-label="Submit search">Search ↗</button><button type="button" class="search-close" aria-label="Close search">×</button>';
    document.body.appendChild(panel);
    panel.addEventListener("submit", ev => { ev.preventDefault(); const q = panel.querySelector("input").value.trim(); location.href = "products.html" + (q ? "?q=" + encodeURIComponent(q) : ""); });
    panel.querySelector(".search-close").addEventListener("click", () => panel.classList.remove("open"));
  }
  panel.classList.toggle("open");
  if (panel.classList.contains("open")) panel.querySelector("input").focus();
}));

// Catalogue search, category filters and sorting.
const productGrid = document.getElementById("productGrid");
if (productGrid) {
  const params = new URLSearchParams(location.search);
  let category = params.get("category") || "all";
  const searchInput = document.getElementById("productSearch");
  if (searchInput && params.get("q")) searchInput.value = params.get("q");
  function applyFilters() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    const sort = document.getElementById("sortProducts")?.value || "featured";
    let list = products.filter(p => (category === "all" || p.category === category) && (p.name.toLowerCase().includes(q) || p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
    if (sort === "low") list.sort((a,b) => a.price-b.price);
    if (sort === "high") list.sort((a,b) => b.price-a.price);
    renderProducts("#productGrid", list);
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b.dataset.filter === category));
  }
  document.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => { category = b.dataset.filter; applyFilters(); }));
  searchInput?.addEventListener("input", applyFilters);
  document.getElementById("sortProducts")?.addEventListener("change", applyFilters);
  applyFilters();
}

// Dedicated product details view.
const detailRoot = document.getElementById("productDetail");
if (detailRoot) {
  const p = getProduct(new URLSearchParams(location.search).get("id"));
  if (!p) detailRoot.innerHTML = '<div class="content-card"><h2>Product not found</h2><p class="text-muted">This product may no longer be available.</p><a class="btn btn-primary-custom" href="products.html">Browse products</a></div>';
  else {
    document.title = `${p.name} | AAAIVO.SHOP`;
    detailRoot.innerHTML = `<div class="row align-items-center g-5"><div class="col-lg-6"><div class="detail-image"><img src="${p.image}" alt="${p.name} product illustration"></div></div><div class="col-lg-6"><span class="eyebrow">${p.label} / ${p.badge}</span><h1 class="detail-title">${p.name}</h1><div class="detail-price">${money(p.price)}</div><p class="detail-description">${p.description}</p><h3 class="detail-subheading">Product highlights</h3><ul class="detail-features">${p.features.map(x=>`<li>${x}</li>`).join("")}</ul><div class="d-flex flex-wrap gap-3 mt-4"><button class="btn btn-primary-custom" type="button" data-add="${p.id}">Add to bag ↗</button><button class="btn btn-outline-custom" type="button" id="buyNowBtn">Buy now</button></div><p class="small text-muted mt-4">Sample product information and pricing for this front-end academic project.</p></div></div>`;
    document.getElementById("buyNowBtn")?.addEventListener("click", () => { addToCart(p.id); location.href = "checkout.html"; });
  }
}

// Checkout summary and demo payment selection.
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  const itemRoot = document.getElementById("checkoutItems");
  const shipping = cart.length ? 350 : 0;
  if (itemRoot) itemRoot.innerHTML = cart.length ? cart.map(x => { const p=getProduct(x.id); return p ? `<div class="checkout-item"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>Qty: ${x.qty}</small></div><b>${money(p.price*x.qty)}</b></div>` : ""; }).join("") : '<p class="text-muted">Your bag is empty. <a href="products.html">Browse products</a> to add something first.</p>';
  const sub = cartTotal();
  document.getElementById("checkoutSubtotal").textContent = money(sub);
  document.getElementById("checkoutShipping").textContent = money(shipping);
  document.getElementById("checkoutTotal").textContent = money(sub + shipping);
  const cardFields = document.getElementById("cardFields");
  const cardInputs = ["cardName","cardNumber","cardExpiry","cardCvv"].map(id=>document.getElementById(id)).filter(Boolean);
  document.querySelectorAll('input[name="paymentMethod"]').forEach(r => r.addEventListener("change", () => {
    const cardSelected = document.querySelector('input[name="paymentMethod"]:checked')?.value === "card";
    cardFields.hidden = !cardSelected;
    cardInputs.forEach(input => { input.required = cardSelected; });
  }));
  document.getElementById("cardNumber")?.addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim(); });
  document.getElementById("cardExpiry")?.addEventListener("input", e => { let v=e.target.value.replace(/\D/g,"").slice(0,4); if(v.length>2)v=v.slice(0,2)+"/"+v.slice(2); e.target.value=v; });
  document.getElementById("cardCvv")?.addEventListener("input", e => { e.target.value=e.target.value.replace(/\D/g,"").slice(0,4); });
  checkoutForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!cart.length) { document.getElementById("checkoutNotice").innerHTML='<div class="alert alert-warning">Your bag is empty. Please add a product before placing an order.</div>'; return; }
    if (!checkoutForm.reportValidity()) return;
    const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || "cod";
    const orderNo = "AA" + Date.now().toString().slice(-8);
    document.getElementById("checkoutNotice").innerHTML = `<div class="alert alert-success"><h4 class="alert-heading">Order placed successfully!</h4><p class="mb-1">Your demo order <strong>${orderNo}</strong> has been recorded in this browser.</p><p class="mb-0">${method === "cod" ? "Payment method: Cash on Delivery." : "Payment method: Debit / Credit Card (demo only, no transaction was processed)."}</p></div>`;
    cart = []; saveCart(); checkoutForm.reset(); cardFields.hidden = true;
    document.querySelectorAll("#checkoutForm input").forEach(input => { if(input.name !== "paymentMethod") input.required = false; });
    document.getElementById("checkoutItems").innerHTML = '<p class="text-muted">Your order has been placed.</p>';
    ["checkoutSubtotal","checkoutShipping","checkoutTotal"].forEach(id => document.getElementById(id).textContent = money(0));
    window.scrollTo({top:0,behavior:"smooth"});
  });
}

document.getElementById("newsletterForm")?.addEventListener("submit", e => { e.preventDefault(); document.getElementById("newsletterMessage").textContent = "Thanks for joining the AAAIVO note!"; e.target.reset(); });
document.getElementById("contactForm")?.addEventListener("submit", e => { e.preventDefault(); document.getElementById("contactMessage").textContent = "Thank you! Your demo message has been received in this page."; e.target.reset(); });
