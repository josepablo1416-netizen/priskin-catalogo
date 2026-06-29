
const PASS='priskin2026'; let products=[];
const login=document.getElementById('login'), dash=document.getElementById('dashboard'), list=document.getElementById('adminList');
if(sessionStorage.getItem('priskinAdmin')==='yes') showDash();
loginBtn.onclick=()=>{ if(password.value===PASS){sessionStorage.setItem('priskinAdmin','yes');showDash();} else alert('Contraseña incorrecta'); };
logoutBtn.onclick=()=>{sessionStorage.removeItem('priskinAdmin');location.reload();};

async function showDash(){login.classList.add('hidden'); dash.classList.remove('hidden'); const saved=localStorage.getItem('priskinProducts'); products=saved?JSON.parse(saved):await (await fetch('products.json')).json(); renderAdmin();}
function save(){localStorage.setItem('priskinProducts',JSON.stringify(products));}
function renderAdmin(){list.innerHTML=products.map(p=>`<article class="card ${p.available===false?'unavailable':''}"><div class="photo"><img src="${p.image}" alt="${esc(p.name)}"></div><div class="info"><div class="badge ${p.featured?'featured':''}">${p.featured?'Destacado · ':''}${esc(p.category)}</div><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><div class="card-actions"><button onclick="editProduct(${p.id})">Editar</button><button class="light" onclick="toggleFeatured(${p.id})">${p.featured?'Quitar destacado':'Destacar'}</button><button class="light" onclick="toggleProduct(${p.id})">${p.available===false?'Activar':'Ocultar'}</button><button class="light" onclick="deleteProduct(${p.id})">Eliminar</button></div></div><div class="price"><span>XMAYOR</span><strong>${esc(p.price)}</strong></div></article>`).join('');}
function editProduct(id){const p=products.find(x=>x.id===id);productId.value=p.id;name.value=p.name;category.value=p.category;price.value=p.price;description.value=p.description;scrollTo({top:0,behavior:'smooth'});}
saveBtn.onclick=()=>{const id=productId.value?Number(productId.value):Date.now();const existing=products.find(p=>p.id===id);const finish=(img)=>{const data={id,name:name.value||'Nuevo producto',category:category.value||'Nuevo',price:price.value||'₡ 0 000',description:description.value||'',image:img||(existing?existing.image:'images/01-mixsoon-bean-sun-stick.jpg'),available:existing?existing.available:true,featured:existing?existing.featured:false}; if(existing) Object.assign(existing,data); else products.push(data); save(); clearForm(); renderAdmin(); alert('Producto guardado');}; const file=image.files[0]; if(file){const r=new FileReader();r.onload=e=>finish(e.target.result);r.readAsDataURL(file);} else finish(null);};
clearBtn.onclick=clearForm; function clearForm(){productId.value='';name.value='';category.value='';price.value='';description.value='';image.value='';}
function toggleProduct(id){const p=products.find(x=>x.id===id);p.available=p.available===false?true:false;save();renderAdmin();}
function toggleFeatured(id){const p=products.find(x=>x.id===id);p.featured=!p.featured;save();renderAdmin();}
function deleteProduct(id){if(confirm('¿Eliminar producto?')){products=products.filter(p=>p.id!==id);save();renderAdmin();}}
exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify(products,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='products.json';a.click();};
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
