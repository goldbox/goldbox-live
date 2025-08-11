// Theme switch
const body = document.body;
const btnStd = document.getElementById('btnStandard');
const btnFnd = document.getElementById('btnFounder');
btnStd.addEventListener('click',()=>{ body.classList.remove('theme-founders'); btnStd.classList.add('active'); btnFnd.classList.remove('active'); });
btnFnd.addEventListener('click',()=>{ body.classList.add('theme-founders'); btnFnd.classList.add('active'); btnStd.classList.remove('active'); });

// Tabs/screens
const screens = {
  home: document.getElementById('screen-home'),
  buy: document.getElementById('screen-buy'),
  wallet: document.getElementById('screen-wallet'),
  learn: document.getElementById('screen-learn')
};
const tabs = [...document.querySelectorAll('.tab')];
const navLinks = [...document.querySelectorAll('[data-nav]')];
function show(tab){
  Object.values(screens).forEach(s=>s.classList.remove('active'));
  tabs.forEach(t=>t.classList.remove('active'));
  screens[tab].classList.add('active');
  document.querySelector(`.tab[data-tab="${tab}"]`)?.classList.add('active');
}
tabs.forEach(t=> t.addEventListener('click', ()=> show(t.dataset.tab)));
navLinks.forEach(n=> n.addEventListener('click', ()=> show(n.dataset.nav)));
show('home');

// Demo state
let pricePerGram = 75; // placeholder; swap with real gold API
let grams = 0.12;
const balGrams = document.getElementById('balGrams');
const balUsd = document.getElementById('balUsd');
const priceG = document.getElementById('priceG');
const priceOz = document.getElementById('priceOz');
const lastUpdated = document.getElementById('lastUpdated');
const vaultPct = document.getElementById('vaultPct');
const vaultProgress = document.getElementById('vaultProgress');

function render(){
  balGrams.textContent = grams.toFixed(2);
  balUsd.textContent = (grams * pricePerGram).toFixed(2);
  priceG.textContent = pricePerGram.toFixed(2);
  priceOz.textContent = (pricePerGram * 31.1035).toFixed(2);
  lastUpdated.textContent = `updated ${new Date().toLocaleTimeString()}`;
  const pct = Math.min(100, (grams/10)*100);
  vaultPct.textContent = Math.round(pct);
  vaultProgress.style.width = `${pct}%`;
}
render();

// Fake live price (replace with real metals API)
async function fetchPrice(){
  try{
    // demo: BTC feed -> mapped. Replace with metals api.
    const r = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
    const j = await r.json();
    const btc = Number(j?.bpi?.USD?.rate_float || 65000);
    pricePerGram = Math.max(60, (btc/900)); // keep in a gold-ish range
  }catch(e){ /* keep last */ }
  render();
}
fetchPrice(); setInterval(fetchPrice, 15000);

// Buy simulation
const buyUsd = document.getElementById('buyUsd');
const buySlider = document.getElementById('buySlider');
const estGrams = document.getElementById('estGrams');
function updateEst(){
  const usd = Number(buyUsd.value || 0);
  estGrams.textContent = (usd/pricePerGram).toFixed(3);
}
buyUsd.addEventListener('input', e=>{ buySlider.value = e.target.value; updateEst(); });
buySlider.addEventListener('input', e=>{ buyUsd.value = e.target.value; updateEst(); });
updateEst();

document.getElementById('btnBuyNow').addEventListener('click', ()=>{
  const usd = Number(buyUsd.value||0);
  if(usd<10) return alert('Minimum $10');
  const addG = usd/pricePerGram;
  grams += addG;
  addTx({ type:'Buy', amountUsd:usd, grams:addG, ts:Date.now() });
  show('home'); render();
  alert('Purchase successful (demo).');
});

// Referral link copy
document.getElementById('copyRef').addEventListener('click', async ()=>{
  const link = location.origin + '/?ref=GOLDBX';
  await navigator.clipboard.writeText(link).catch(()=>{});
  alert('Referral link copied!');
});

// Wallet tx list
const txList = document.getElementById('txList');
const txs = [];
function addTx(t){ txs.unshift(t); renderTx(); }
function renderTx(){
  txList.innerHTML = txs.map(t=>{
    const d = new Date(t.ts).toLocaleString();
    return `<li><span>${t.type}</span><span class="muted">${d}</span><span class="g">+${t.grams.toFixed(3)} g</span></li>`;
  }).join('') || `<li class="muted">No transactions yet</li>`;
}
renderTx();

// Round-ups toggle (demo only)
document.getElementById('roundToggle').addEventListener('change', (e)=>{
  // store to localStorage in demo
  localStorage.setItem('roundUps', e.target.checked ? '1':'0');
});

// PWA
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
