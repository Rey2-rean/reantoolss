const tools = [
    {name:"Image Compressor", category:"Image", description:"Kompres ukuran gambar tanpa mengurangi kualitas secara berlebihan.", icon:"🖼️", color:"var(--blue)", url:"tools/image-compressor/index.html", live:true},
  {name:"QR Generator", category:"Other", description:"Buat QR Code dengan mudah dan cepat.", icon:"▦", color:"var(--teal)", url:"tools/qr-generator/index.html", live:true},
  {name:"Word Counter", category:"Text", description:"Hitung jumlah kata, karakter, dan kalimat.", icon:"T", color:"var(--purple)",url:"tools/word-counter/index.html", live:true},
  {name:"JSON Formatter", category:"Developer", description:"Rapikan dan validasi format JSON dengan sekali klik.", icon:"{ }", color:"var(--orange)", url:"tools/json-formatter/index.html", live:true},
  {name:"Color Picker", category:"Design", description:"Pilih warna dan dapatkan kode HEX, RGB, dan HSL.", icon:"🎨", color:"var(--pink)", url:"tools/color-picker/index.html", live:true},
  {name:"Character Counter", category:"Text", description:"Hitung jumlah karakter dalam teks secara instan.", icon:"#", color:"var(--purple)", url:"/tools/character-counter"},
  {name:"Case Converter", category:"Text", description:"Ubah teks menjadi UPPERCASE, lowercase, atau Title Case.", icon:"Aa", color:"var(--purple)", url:"/tools/case-converter"},
  {name:"Remove Duplicate Lines", category:"Text", description:"Hapus baris duplikat dari daftar teks.", icon:"≡", color:"var(--purple)", url:"/tools/remove-duplicate-lines"},
  {name:"Text Formatter", category:"Text", description:"Rapikan format teks secara otomatis.", icon:"¶", color:"var(--purple)", url:"/tools/text-formatter"},
  {name:"Image Resizer", category:"Image", description:"Ubah ukuran gambar sesuai kebutuhan.", icon:"↔", color:"var(--blue)", url:"/tools/image-resizer"},
  {name:"JPG to PNG", category:"Image", description:"Konversi gambar JPG ke format PNG.", icon:"⇄", color:"var(--blue)", url:"/tools/jpg-to-png"},
  {name:"PNG to JPG", category:"Image", description:"Konversi gambar PNG ke format JPG.", icon:"⇄", color:"var(--blue)", url:"/tools/png-to-jpg"},
  {name:"Image Cropper", category:"Image", description:"Potong gambar sesuai area yang diinginkan.", icon:"✂", color:"var(--blue)", url:"/tools/image-cropper"},
  {name:"JSON Validator", category:"Developer", description:"Validasi struktur JSON kamu.", icon:"✓", color:"var(--orange)", url:"/tools/json-validator"},
  {name:"Base64 Encoder", category:"Developer", description:"Encode dan decode teks ke Base64.", icon:"64", color:"var(--orange)", url:"/tools/base64-encoder"},
  {name:"HTML Formatter", category:"Developer", description:"Rapikan kode HTML secara otomatis.", icon:"&lt;/&gt;", color:"var(--orange)", url:"/tools/html-formatter"},
  {name:"CSS Minifier", category:"Developer", description:"Perkecil ukuran file CSS kamu.", icon:"{}", color:"var(--orange)", url:"/tools/css-minifier"},
  {name:"Gradient Generator", category:"Design", description:"Buat gradient warna dengan mudah.", icon:"◐", color:"var(--pink)", url:"/tools/gradient-generator"},
  {name:"Color Converter", category:"Design", description:"Konversi kode warna antar format.", icon:"⇄", color:"var(--pink)", url:"/tools/color-converter"},
  {name:"Shadow Generator", category:"Design", description:"Buat CSS box-shadow secara visual.", icon:"▨", color:"var(--pink)", url:"/tools/shadow-generator"},
  {name:"Percentage Calculator", category:"Calculator", description:"Hitung persentase dengan cepat.", icon:"%", color:"var(--orange)", url:"/tools/percentage-calculator"},
  {name:"Unit Converter", category:"Calculator", description:"Konversi satuan panjang, berat, dan lainnya.", icon:"⇌", color:"var(--orange)", url:"/tools/unit-converter"},
  {name:"Age Calculator", category:"Calculator", description:"Hitung umur berdasarkan tanggal lahir.", icon:"🎂", color:"var(--orange)", url:"/tools/age-calculator"},
  {name:"Discount Calculator", category:"Calculator", description:"Hitung harga setelah diskon.", icon:"🏷️", color:"var(--orange)", url:"/tools/discount-calculator"},
  {name:"Password Generator", category:"Other", description:"Buat password acak yang kuat.", icon:"🔒", color:"var(--teal)", url:"/tools/password-generator"},
  {name:"Pomodoro Timer", category:"Other", description:"Kelola waktu kerja dengan teknik pomodoro.", icon:"⏱", color:"var(--teal)", url:"/tools/pomodoro-timer"},
  {name:"Random Generator", category:"Other", description:"Hasilkan angka atau teks acak.", icon:"🎲", color:"var(--teal)", url:"/tools/random-generator"}
];

const popularNames = ["Image Compressor","QR Generator","Word Counter","JSON Formatter","Color Picker"];
const popularGrid = document.getElementById('popularGrid');
popularNames.forEach(n=>{
  const t = tools.find(x=>x.name===n);
  popularGrid.innerHTML += cardHTML(t);
});

function cardHTML(t){
  const href = t.live ? t.url : '#';
  return `<a class="tool-card" href="${href}" ${t.live ? '' : 'data-soon="1"'}>
    <div class="tool-icon" style="background:${t.color}">${t.icon}</div>
    <h3>${t.name}</h3>
    <p>${t.description}</p>
    <span class="arrow">→</span>
  </a>`;
}

const categories = [
  {name:"Text", icon:"📄", color:"var(--blue)"},
  {name:"Image", icon:"🖼️", color:"var(--teal)"},
  {name:"Developer", icon:"&lt;/&gt;", color:"var(--purple)"},
  {name:"Design", icon:"🎨", color:"var(--pink)"},
  {name:"Calculator", icon:"🧮", color:"var(--orange)"},
  {name:"Other", icon:"⚙️", color:"var(--teal)"}
];

const catGrid = document.getElementById('catGrid');
const catPanel = document.createElement('div');
catPanel.className = 'cat-panel';
catPanel.hidden = true;
catGrid.after(catPanel);

catGrid.innerHTML = categories.map(c => {
  const count = tools.filter(t => t.category === c.name).length;
  return `<button class="cat-card" data-cat="${c.name}" aria-expanded="false">
    <span class="cat-left">
      <span class="tool-icon" style="background:${c.color}">${c.icon}</span>
      <span><strong>${c.name}</strong><small>${count} tools</small></span>
    </span>
    <span class="arrow">→</span>
  </button>`;
}).join('');

catGrid.addEventListener('click', e => {
  const b = e.target.closest('.cat-card');
  if(!b) return;
  const name = b.dataset.cat;
  const wasOpen = b.getAttribute('aria-expanded') === 'true';
  catGrid.querySelectorAll('.cat-card').forEach(x => x.setAttribute('aria-expanded', 'false'));
  if(wasOpen){ catPanel.hidden = true; return; }
  b.setAttribute('aria-expanded', 'true');
  catPanel.innerHTML = `<h3>${name}</h3><div class="cards-grid">${tools.filter(t => t.category === name).map(t => cardHTML(t)).join('')}</div>`;
  catPanel.hidden = false;
  catPanel.scrollIntoView({behavior:'smooth', block:'nearest'});
});

const input = document.getElementById('searchInput');
const results = document.getElementById('searchResults');
function doSearch(){
  const q = input.value.trim().toLowerCase();
  if(!q){ results.classList.remove('show'); return; }
  const matches = tools.filter(t=>t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  results.innerHTML = matches.length
    ? matches.map(t=>`<a class="search-item" href="${t.live ? t.url : '#'}" ${t.live ? '' : 'data-soon="1"'}><span>${t.icon}</span><div><strong>${t.name}</strong><br><span style="opacity:.7">${t.category}</span></div></a>`).join('')
    : `<div class="search-empty">Tidak ada tools yang cocok dengan "${input.value}"</div>`;
  results.classList.add('show');
}
input.addEventListener('input', doSearch);
input.addEventListener('focus', ()=>{ if(input.value) doSearch(); });
document.addEventListener('click', e=>{
  if(!e.target.closest('.search-bar') && !e.target.closest('.search-results')) results.classList.remove('show');
});

// Toast untuk tools yang belum tersedia
const toast=document.createElement('div');
toast.className='toast';toast.setAttribute('role','status');
document.body.appendChild(toast);
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-soon]');
  if(!a) return;
  e.preventDefault();
  toast.textContent='Tool ini segera hadir 🚧';
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2000);
});
