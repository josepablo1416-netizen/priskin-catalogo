
let products=[], cart=JSON.parse(localStorage.getItem('priskinCart')||'[]');
const grid=document.getElementById('productGrid'),search=document.getElementById('search'),brandSelect=document.getElementById('brandSelect'),catSelect=document.getElementById('catSelect'),countText=document.getElementById('countText'),brandButtons=document.getElementById('brandButtons'),mobileChips=document.getElementById('mobileChips');
async function init(){const saved=localStorage.getItem('priskinProductsV6');products=saved?JSON.parse(saved):await(await fetch('products.json')).json();setup();render();renderCart();startHeroSlider()}
function setup(){const brands=[...new Set(products.map(p=>p.brand))].sort();mobileChips.innerHTML=`<button class="chip active" onclick="chooseBrandMobile('')">Todos</button>`;brands.forEach(b=>{brandSelect.innerHTML+=`<option>${esc(b)}</option>`;brandButtons.innerHTML+=`<button class="brand-pill" onclick="chooseBrand('${safeAttr(b)}')">${esc(b)}</button>`;mobileChips.innerHTML+=`<button class="chip" onclick="chooseBrandMobile('${safeAttr(b)}')">${esc(b)}</button>`});[...new Set(products.map(p=>p.category))].sort().forEach(c=>catSelect.innerHTML+=`<option>${esc(c)}</option>`)}
function chooseBrand(b){brandSelect.value=b;document.getElementById('catalogo').scrollIntoView({behavior:'smooth'});render();updateChips()}
function chooseBrandMobile(b){brandSelect.value=b;render();updateChips()}
function updateChips(){document.querySelectorAll('.chip').forEach(ch=>ch.classList.toggle('active', ch.textContent===brandSelect.value || (!brandSelect.value && ch.textContent==='Todos')))}
function render(){const q=search.value.toLowerCase(),b=brandSelect.value,c=catSelect.value;const list=products.filter(p=>p.available!==false).filter(p=>(!b||p.brand===b)&&(!c||p.category===c)&&(!q||`${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase().includes(q)));countText.textContent=`${list.length} productos disponibles`;grid.innerHTML=list.map(card).join('');if(list[0])heroImg.src=list[0].image}

let heroIndex = 0;
function startHeroSlider(){
  if(!products.length) return;
  setInterval(()=>{
    const active = products.filter(p=>p.available!==false);
    if(!active.length || !document.getElementById('heroImg')) return;
    heroIndex = (heroIndex + 1) % active.length;
    heroImg.classList.add('fade-out');
    setTimeout(()=>{
      heroImg.src = active[heroIndex].image;
      heroImg.alt = active[heroIndex].name;
      heroImg.classList.remove('fade-out');
    }, 220);
  }, 2600);
}

function card(p){return `<article class="card">${p.badge?`<div class="badge">${esc(p.badge)}</div>`:''}<button class="quick" onclick="quickView(${p.id})">👁</button><div class="pic"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"></div><div class="body"><div class="brand">${esc(p.brand)} · ${esc(p.category)}</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="price-line"><strong class="price">${esc(p.price)}</strong><span class="pill">XMAYOR</span></div><button class="add-cart" onclick="addToCart(${p.id})">Agregar al carrito</button></div></article>`}
function quickView(id){const p=products.find(x=>x.id===id);modalContent.innerHTML=`<div class="modal-grid"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"><div><div class="brand">${esc(p.brand)} · ${esc(p.category)}</div><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><div class="price-line"><strong class="price">${esc(p.price)}</strong><span class="pill">XMAYOR</span></div><button class="add-cart" onclick="addToCart(${p.id});closeModal()">Agregar al carrito</button></div></div>`;quickModal.classList.add('open')}
function closeModal(){quickModal.classList.remove('open')}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});saveCart();renderCart();openCart()}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function saveCart(){localStorage.setItem('priskinCart',JSON.stringify(cart))}
function renderCart(){const totalQty=cart.reduce((s,i)=>s+i.qty,0);cartCount.textContent=totalQty;if(document.getElementById('cartCountBottom'))cartCountBottom.textContent=totalQty;cartItems.innerHTML=cart.length?cart.map(i=>`<div class="cart-item"><img loading="lazy" src="${i.image}"><div><h4>${esc(i.name)}</h4><p>${esc(i.price)} · XMAYOR</p><div class="qty"><button onclick="changeQty(${i.id},-1)">-</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button></div></div><button onclick="changeQty(${i.id},-${i.qty})">×</button></div>`).join(''):'<p>Tu carrito está vacío.</p>';cartTotal.textContent=formatCRC(cart.reduce((s,i)=>s+(priceNum(i.price)*i.qty),0))}
function priceNum(price){return Number(String(price).replace(/[^\d]/g,''))||0}
function formatCRC(n){return '₡ '+n.toLocaleString('es-CR')}
function openCart(){cartPanel.classList.add('open');overlay.classList.add('open')}
function closeCart(){cartPanel.classList.remove('open');overlay.classList.remove('open')}
function checkout(){if(!cart.length){alert('El carrito está vacío');return}const lines=cart.map(i=>`• ${i.qty} x ${i.name} - ${i.price}`).join('%0A');const total=encodeURIComponent(cartTotal.textContent);window.open(`https://wa.me/50662315954?text=Hola PriSkin,%20quiero%20hacer%20este%20pedido%20XMAYOR:%0A%0A${lines}%0A%0ATotal%20estimado:%20${total}`,'_blank')}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function safeAttr(s){return String(s).replace(/'/g,"\\'")}
[search,brandSelect,catSelect].forEach(el=>el.addEventListener('input',render));clearBtn.onclick=()=>{search.value='';brandSelect.value='';catSelect.value='';render();updateChips()};menuBtn.onclick=()=>navMenu.classList.toggle('open');cartOpen.onclick=openCart;cartOpenHero.onclick=openCart;if(document.getElementById('cartOpenBottom'))cartOpenBottom.onclick=openCart;cartClose.onclick=closeCart;overlay.onclick=closeCart;checkoutBtn.onclick=checkout;modalClose.onclick=closeModal;quickModal.onclick=e=>{if(e.target===quickModal)closeModal()};init();
