
let products=[], active='Todos';
const catalog=document.getElementById('catalog'), filters=document.getElementById('filters'), search=document.getElementById('search');

async function load(){
  const saved=localStorage.getItem('priskinProducts');
  products=saved?JSON.parse(saved):await (await fetch('products.json')).json();
  renderFilters(); render();
}
function renderFilters(){
  const cats=['Todos','Destacados',...Array.from(new Set(products.map(p=>p.category))).sort()];
  filters.innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" onclick="setFilter('${safeAttr(c)}')">${esc(c)}</button>`).join('');
}
function setFilter(c){active=c;renderFilters();render();}
function render(){
  const q=search.value.toLowerCase();
  catalog.innerHTML=products.filter(p=>p.available!==false)
    .filter(p=>((active==='Todos')||(active==='Destacados'&&p.featured)||p.category===active)&&(!q||(`${p.name} ${p.description} ${p.category}`).toLowerCase().includes(q)))
    .map(card).join('');
}
function card(p){return `<article class="card"><div class="photo"><img src="${p.image}" alt="${esc(p.name)}"></div><div class="info"><div class="badge ${p.featured?'featured':''}">${p.featured?'Destacado · ':''}${esc(p.category)}</div><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p></div><div class="price"><span>XMAYOR</span><strong>${esc(p.price)}</strong></div></article>`;}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function safeAttr(s){return String(s).replace(/'/g,"\\'")}
search.addEventListener('input',render); load();
