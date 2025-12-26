
// --- Sample products ---
const products = [
  {id:1,title:{fa:'گوشی سامسونگ',en:'Samsung Phone'},price:12500000,img:'https://picsum.photos/300?1',desc:{fa:'توضیحات محصول',en:'Product description'}},
  {id:2,title:{fa:'لپتاپ ایسوس',en:'Asus Laptop'},price:28500000,img:'https://picsum.photos/300?2',desc:{fa:'توضیحات محصول',en:'Product description'}},
  {id:3,title:{fa:'هدفون سونی',en:'Sony Headphone'},price:4500000,img:'https://picsum.photos/300?3',desc:{fa:'توضیحات محصول',en:'Product description'}}
];

// --- i18n ---
let lang='fa';
const t=(p)=>p[lang]||'';
function switchLang(v){lang=v;document.documentElement.dir=(v==='fa'?'rtl':'ltr');renderProducts();updateNavUser();}

// --- Auth (token in localStorage) ---
let authMode='login';
const AUTH_KEY='pula_auth_token',USER_KEY='pula_user_data';
function openAuth(mode='login'){authMode=mode;document.getElementById('authModal').classList.remove('hidden');updateAuthUI();}
function toggleAuthMode(){authMode=authMode==='login'?'register':'login';updateAuthUI();}
function updateAuthUI(){document.getElementById('authTitle').innerText=authMode==='login'?(lang==='fa'?'ورود':'Login'):(lang==='fa'?'ثبت نام':'Register');document.getElementById('registerExtra').style.display=authMode==='login'?'none':'block';}
function submitAuth(){
  const email=document.getElementById('authEmail').value.trim();
  const pass=document.getElementById('authPassword').value.trim();
  if(authMode==='register'){
    const name=document.getElementById('authName').value.trim();
    if(!name||!email||!pass) return alert('پر کنید');
    localStorage.setItem(USER_KEY,JSON.stringify({name,email}));
  }else{
    const saved=JSON.parse(localStorage.getItem(USER_KEY)||'null');
    if(!saved||saved.email!==email) return alert('کاربر یافت نشد');
  }
  localStorage.setItem(AUTH_KEY,btoa(email+'|'+Date.now()));
  document.getElementById('authModal').classList.add('hidden');
  updateNavUser();
}
function logout(){localStorage.removeItem(AUTH_KEY);updateNavUser();}
function isLoggedIn(){return !!localStorage.getItem(AUTH_KEY);}
function updateNavUser(){
  const nav=document.querySelector('.nav-links');
  if(isLoggedIn()){
    const u=JSON.parse(localStorage.getItem(USER_KEY)||'{}');
    nav.innerHTML=`<div>${lang==='fa'?'سلام':'Hi'}, ${u.name||''}</div><div onclick='logout()'>${lang==='fa'?'خروج':'Logout'}</div>`;
  }else{
    nav.innerHTML=`<div onclick='openAuth()'>${lang==='fa'?'ورود | ثبت نام':'Login | Register'}</div>`;
  }
}

// --- Cart ---
let cart=[];
function addToCart(id){cart.push(id);document.getElementById('cartCount').innerText=cart.length;}
function openCart(){
  const m=document.getElementById('cartModal');m.classList.remove('hidden');
  const list=cart.map(i=>products.find(p=>p.id===i));
  m.innerHTML=`<div class='card' style='max-width:420px;width:100%'>
    <h3>${lang==='fa'?'سبد خرید':'Cart'}</h3>
    ${list.map(p=>`<div class='cart-item'><span>${t(p.title)}</span><span>${p.price.toLocaleString()}</span></div>`).join('')||'<p>Empty</p>'}
    <button onclick="checkout()">${lang==='fa'?'پرداخت':'Checkout'}</button>
    <button style='background:#6b7280' onclick="closeModals()">بستن</button>
  </div>`;
}
function checkout(){alert(lang==='fa'?'به درگاه متصل می‌شود (شبیه‌سازی)':'Redirecting to payment gateway (mock)');}
function closeModals(){document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));}

// --- Product Render ---
function renderProducts(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  const list=products.filter(p=>t(p.title).toLowerCase().includes(q));
  document.getElementById('productList').innerHTML=list.map(p=>`
    <div class='card'>
      <img src='${p.img}' alt='${t(p.title)}'>
      <div class='badge'>${lang==='fa'?'جدید':'New'}</div>
      <h4>${t(p.title)}</h4>
      <div class='price'>${p.price.toLocaleString()} تومان</div>
      <button onclick='showDetail(${p.id})'>${lang==='fa'?'جزئیات':'Details'}</button>
      <button onclick='addToCart(${p.id})'>${lang==='fa'?'افزودن':'Add'}</button>
    </div>
  `).join('');
}

function showDetail(id){
  const p=products.find(x=>x.id===id);
  const m=document.getElementById('productModal');
  m.classList.remove('hidden');
  m.innerHTML=`<div class='card' style='max-width:540px'><img src='${p.img}'/><h3>${t(p.title)}</h3><p>${t(p.desc)}</p>
  <div class='price'>${p.price.toLocaleString()} تومان</div>
  <button onclick='addToCart(${p.id})'>${lang==='fa'?'افزودن به سبد':'Add to Cart'}</button>
  <button style='background:#6b7280' onclick='closeModals()'>${lang==='fa'?'بستن':'Close'}</button></div>`;
}

// init
updateNavUser();renderProducts();
