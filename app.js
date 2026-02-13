import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAoYDclGhL75b14C1fT_5SRsrrEt8B6iyU",
  authDomain: "bryluno-system.firebaseapp.com",
  projectId: "bryluno-system",
  storageBucket: "bryluno-system.firebasestorage.app",
  messagingSenderId: "666741527124",
  appId: "1:666741527124:web:bebf8a61c085eba11cd3c1",
  measurementId: "G-N5KBSRT7BS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================
// PLACE ORDER FUNCTION
// =============================
window.placeOrder = async function(){

const resellerID = document.getElementById("resellerID").value;
const customer = document.getElementById("customer").value;
const phone = document.getElementById("phone").value;
const tier = document.getElementById("tier").value;
const file = document.getElementById("productImage").files[0];

let sellingPrice=0, cost=0, commission=0;

if(tier==="Basic"){ sellingPrice=4500; cost=2500; commission=1000; }
if(tier==="Premium"){ sellingPrice=6000; cost=3000; commission=1000; }
if(tier==="Luxury"){ sellingPrice=10000; cost=5000; commission=1500; }

let profit = sellingPrice - cost - commission;
let orderID = "BRY-"+Math.floor(Math.random()*100000);

let imageUrl="";

// 🔥 Upload image to Cloudinary
if(file){

const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", "bryluno-products");

const response = await fetch(
"https://api.cloudinary.com/v1_1/djsrfrxcu/image/upload",
{
method:"POST",
body:formData
});

const data = await response.json();
imageUrl = data.secure_url;
}

// 🔥 Save to Firestore
await addDoc(collection(db, "orders"), {
orderID,
resellerID,
customer,
phone,
tier,
sellingPrice,
commission,
profit,
imageUrl,
createdAt: new Date()
});

document.getElementById("result").innerHTML =
"✅ Order Success!<br>ID: "+orderID+
"<br>Total: LKR "+sellingPrice+
"<br>Profit: LKR "+profit;

}

// =============================
// ADMIN LOAD ORDERS
// =============================
async function loadOrders(){

const container = document.getElementById("orders");
if(!container) return;

const querySnapshot = await getDocs(collection(db, "orders"));
let html="";

querySnapshot.forEach((doc)=>{
let o = doc.data();
html += `
<div class="card">
<b>Order:</b> ${o.orderID}<br>
<b>Customer:</b> ${o.customer}<br>
<b>Tier:</b> ${o.tier}<br>
<b>Total:</b> LKR ${o.sellingPrice}<br>
<b>Commission:</b> LKR ${o.commission}<br>
<b>Profit:</b> LKR ${o.profit}<br>
${o.imageUrl ? `<img src="${o.imageUrl}">` : ""}
</div>
`;
});

container.innerHTML = html;
}

loadOrders();
