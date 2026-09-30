const products = [
  {id:1,name:"Nike MERCURIAL VAPOR 16 ELITE AG BALCK ",category:"สตั๊ด",price:6990,old:8500,rating:"4.9",badge:"HOT",image:"https://www.prodirectsport.com/cdn/shop/files/1034730_creative_1.jpg?crop=region&crop_height=720&crop_left=465&crop_top=0&crop_width=720&height=720&v=1790763955&width=720"},
  {id:2,name:"Adidas PREDATOR ELITE Fold-Over Tongue Firm Ground",category:"สตั๊ด",price:7990,old:10500,rating:"4.8",badge:"NEW",image:"https://assets.adidas.com/images/w_500,f_auto,q_auto/8d49a51572a14dcda4ea8608dfbf5329_9366/PREDATOR_ELITE_Fold-Over_Tongue_Firm_Ground_JS0375_22_model.jpg"},
  {id:3,name:"PUMA KING PRO 21 FG - PUMA BLACK/PUMA WHITE",category:"สตั๊ด",price:5990,old:7990,rating:"4.8",badge:"SALE",image:"https://thumblr.uniid.it/product/223901/4206dbcc0a97.jpg?width=3840&format=webp&q=75"},
  {id:4,name:"Joma Top Flex Rebound",category:"ฟุตซอล",price:2290,old:2690,rating:"4.9",badge:"TOP",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVii85G5mIMXeVAOuU2BsHfyfni1FzVGS4cUq7Z7AxMxZf4rE5LfT4KkA&s=10"},
  {id:5,name:"Nike Streetgato",category:"ฟุตซอล",price:2490,old:2990,rating:"4.7",badge:"NEW",image:"https://www.prodirectsport.us/cdn/shop/files/1015892_main.jpg?v=1789735155&width=1065"},
  {id:6,name:"adidas Predator Training Ball",category:"อุปกรณ์",price:990,old:1190,rating:"4.8",badge:"",image:"https://assets.adidas.com/images/w_500,f_auto,q_auto/186174259b7b4485863b5aeda50aab89_9366/Predator_Training_Ball_Red_JH1331.jpg"},
  {id:7,name:"Adidas Predator GL Pro IC Manuel Neuer",category:"อุปกรณ์",price:2990,old:3990,rating:"4.9",badge:"HOT",image:"https://shop.torwart.de/out/pictures/master/product/1/xafr8371.jpg"},
  {id:8,name:"Nike Mercurial Lite",category:"อุปกรณ์",price:690,old:890,rating:"4.7",badge:"",image:"https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,c_scale,w_300,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/853dbb5d-3b68-4204-b1ba-f674a6939906/NK+MERC+LITE+-+FA22.png"}
];

let activeFilter = "ทั้งหมด";
let cart = [];

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function money(n){return "฿" + n.toLocaleString("th-TH");}

function renderProducts(){
  const q = (searchInput?.value || "").trim().toLowerCase();
  const filtered = products.filter(p =>
    (activeFilter === "ทั้งหมด" || p.category === activeFilter) &&
    (!q || p.name.toLowerCase().includes(q) || p.category.includes(q))
  );
  productGrid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="quick-add" data-add="${p.id}" aria-label="เพิ่มลงตะกร้า">+</button>
      </div>
      <div class="product-info">
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <div class="price-row">
          <div><span class="price">${money(p.price)}</span> <span class="old-price">${money(p.old)}</span></div>
          <span class="rating">★ ${p.rating}</span>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.style.display = filtered.length ? "none" : "block";
}

function renderCart(){
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
  if(!cart.length){
    cartItems.innerHTML = `<div style="padding:60px 0;text-align:center;color:#999;font-size:12px">ยังไม่มีสินค้าในตะกร้า 🛒</div>`;
    cartTotal.textContent = "฿0";
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div><h4>${item.name}</h4><p>${item.qty} × ${money(item.price)}</p></div>
      <button class="remove-item" data-remove="${item.id}">×</button>
    </div>
  `).join("");
  cartTotal.textContent = money(cart.reduce((sum,item)=>sum + item.price*item.qty,0));
}

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty++;
  else cart.push({...p,qty:1});
  renderCart();
  showToast(`เพิ่ม "${p.name}" ลงตะกร้าแล้ว`);
}

document.addEventListener("click", e=>{
  const add = e.target.closest("[data-add]");
  if(add) addToCart(Number(add.dataset.add));
  const remove = e.target.closest("[data-remove]");
  if(remove){
    cart = cart.filter(x=>x.id!==Number(remove.dataset.remove));
    renderCart();
  }
  const filter = e.target.closest("[data-filter]");
  if(filter && filter.closest("#filterTabs")){
    activeFilter = filter.dataset.filter;
    document.querySelectorAll("#filterTabs button").forEach(b=>b.classList.toggle("active",b===filter));
    renderProducts();
  }
  const category = e.target.closest(".category-card");
  if(category){
    activeFilter = category.dataset.filter;
    document.querySelectorAll("#filterTabs button").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));
    renderProducts();
    document.getElementById("products").scrollIntoView({behavior:"smooth"});
  }
});

searchInput?.addEventListener("input",renderProducts);

const drawer = document.getElementById("cartDrawer");
function openCart(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true")}
document.getElementById("cartBtn").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("drawerBackdrop").addEventListener("click",closeCart);

document.getElementById("searchBtn").addEventListener("click",()=>{
  const box = document.getElementById("searchBox");
  box.classList.toggle("show");
  if(box.classList.contains("show")) searchInput.focus();
});

document.querySelector(".menu-toggle").addEventListener("click",()=>{
  document.querySelector(".nav-links").classList.toggle("mobile-open");
});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav-links").classList.remove("mobile-open")));

document.getElementById("memberForm").addEventListener("submit",e=>{
  e.preventDefault();
  e.target.reset();
  showToast("สมัครสมาชิกสำเร็จ! รับส่วนลด 10% ได้ทางอีเมล");
});

document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length) return showToast("กรุณาเพิ่มสินค้าก่อนสั่งซื้อ");
  showToast("เดโม: เชื่อมต่อระบบชำระเงินจริงได้ในขั้นตอนถัดไป");
});

renderProducts();
renderCart();
