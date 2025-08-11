// Theme switch
const body = document.body;
const btnStd = document.getElementById('btnStandard');
const btnFnd = document.getElementById('btnFounder');
const priceEl = document.getElementById('price');

btnStd.addEventListener('click',()=>{ body.classList.remove('theme-founders'); btnStd.classList.add('active'); btnFnd.classList.remove('active'); });
btnFnd.addEventListener('click',()=>{ body.classList.add('theme-founders'); btnFnd.classList.add('active'); btnStd.classList.remove('active'); });

// Live price (placeholder demo). Replace with real API when keys ready.
async function fetchPrice(){
  try{
    // Example placeholder logic; swap to real metals API
    const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
    const data = await res.json();
    // Fake mapping just to show movement; replace with gold price
    const usd = Number(data.bpi?.USD?.rate_float || 0);
    priceEl.textContent = `1 g ≈ ${(usd/65).toFixed(2)} USD · updated ${new Date().toLocaleTimeString()}`;
  }catch(e){ priceEl.textContent = 'Price feed offline'; }
}
fetchPrice(); setInterval(fetchPrice, 10000);

// PWA
if('serviceWorker' in navigator){ window.addEventListener('load',()=> navigator.serviceWorker.register('/sw.js')); }
