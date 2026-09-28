/* ReanTools — pustaka tools. Tambah tool baru: add('slug','Judul','KATEGORI · JENIS','Deskripsi',el=>{...}) */
const $=(s,r=document)=>r.querySelector(s),T={};
const add=(k,t,c,d,m)=>T[k]={title:t,cat:c,desc:d,mount:m};
const num=(v,d=0)=>{const n=parseFloat(v);return isNaN(n)?d:n};
const copy=(t,b)=>navigator.clipboard.writeText(t).then(()=>{const o=b.textContent;b.textContent='Tersalin ✓';setTimeout(()=>b.textContent=o,1500)});
const fmt=b=>b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(2)+' MB';
const S=a=>a.map(x=>`<div class="stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('');
const rows=a=>a.map(x=>`<div class="code"><b>${x[0]}</b><output>${x[1]}</output><button class="cbtn">Salin</button></div>`).join('');
const cd=el=>el.addEventListener('click',e=>{if(e.target.classList.contains('cbtn'))copy(e.target.previousElementSibling.textContent,e.target)});
const rnd=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n};
const sl=(id,l,min,max,v)=>`<div class="field"><label for="${id}">${l}: <span id="${id}v">${v}</span></label><input type="range" id="${id}" min="${min}" max="${max}" value="${v}"></div>`;
const words=s=>s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
const cv=(w,h,bg)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(bg){x.fillStyle=bg;x.fillRect(0,0,w,h)}return[c,x]};

/* ---------- helper: teks masuk -> teks keluar ---------- */
function textIO(el,o){
 el.innerHTML=`<div class="card"><label for="in">${o.label||'Teks'}</label><textarea id="in" style="min-height:160px" placeholder="${o.ph||'Tempel teks di sini...'}"></textarea><div class="actions">${o.btns.map((b,i)=>`<button class="${i?'btn-secondary':'btn-primary'}" data-i="${i}">${b[0]}</button>`).join('')}</div><div id="st" class="status" role="status"></div></div><div class="card"><label for="out">Hasil</label><textarea id="out" readonly style="min-height:160px"></textarea><div class="actions"><button class="btn-secondary" id="cp">Salin hasil</button></div></div>`;
 const inp=$('#in',el),out=$('#out',el),st=$('#st',el);
 el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{
  let r;try{r=o.btns[b.dataset.i][1](inp.value)}catch(e){r={msg:'✗ '+e.message,err:1,out:''}}
  if(typeof r=='string')r={out:r};
  out.value=r.out??'';st.textContent=r.msg||'';st.className='status'+(r.msg?(r.err?' err':' ok'):'');
 });
 $('#cp',el).onclick=e=>out.value&&copy(out.value,e.target);
}

/* ---------- helper: gambar masuk -> gambar keluar ---------- */
function imageTool(el,o){
 el.innerHTML=`<div class="card"><label class="drop" for="f">📁 Klik untuk pilih gambar<input type="file" id="f" accept="${o.accept||'image/*'}"></label>${o.ctl||''}</div><div class="card" id="res" hidden><img id="pv" alt="Pratinjau hasil"><p id="inf" style="text-align:center;margin-top:10px;font-size:14px"></p><div class="actions"><a class="btn-primary" id="dl" style="text-align:center;text-decoration:none">⬇ Download hasil</a></div></div>`;
 let img,file,url;const g=id=>$('#'+id,el),v=id=>g(id).value;
 const run=()=>{if(!img)return;const r=o.run(img,v);r.c.toBlob(b=>{if(!b)return;url&&URL.revokeObjectURL(url);url=URL.createObjectURL(b);g('pv').src=url;const a=g('dl');a.href=url;a.download=file.name.replace(/\.[^.]+$/,'')+'-'+o.suffix+'.'+r.ext;g('inf').textContent=`${r.c.width}×${r.c.height}px · ${fmt(b.size)} (asli ${fmt(file.size)})`;g('res').hidden=false},r.mime,r.q)};
 g('f').onchange=e=>{file=e.target.files[0];if(!file)return;const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{img=i;URL.revokeObjectURL(u);o.load&&o.load(img,g);run()};i.onerror=()=>alert('File bukan gambar yang valid.');i.src=u};
 el.oninput=e=>{if(e.target.id=='f')return;o.sync&&o.sync(e.target.id,img,g);run()};
}

/* ================= TEXT ================= */
add('character-counter','Character Counter','TEXT · COUNTER','Hitung karakter, huruf, angka, dan spasi. Bisa dengan batas karakter.',el=>{
 el.innerHTML=`<div class="card"><label for="in">Teks</label><textarea id="in" style="min-height:180px"></textarea><div class="row"><div class="field"><label for="lim">Batas karakter (opsional)</label><input type="number" id="lim" min="1" placeholder="contoh: 280"></div></div></div><div class="card"><div class="stats" id="s"></div></div>`;
 const i=$('#in',el),l=$('#lim',el);
 const u=()=>{const t=i.value,lim=num(l.value),a=[['Karakter',t.length],['Tanpa spasi',t.replace(/\s/g,'').length],['Huruf',(t.match(/\p{L}/gu)||[]).length],['Angka',(t.match(/\d/g)||[]).length],['Spasi',(t.match(/\s/g)||[]).length]];if(lim)a.push(['Sisa',lim-t.length]);$('#s',el).innerHTML=S(a)};
 i.oninput=l.oninput=u;u();
});
add('case-converter','Case Converter','TEXT · CASE','Ubah teks menjadi UPPERCASE, lowercase, Title Case, dan lainnya.',el=>textIO(el,{btns:[
 ['UPPERCASE',s=>s.toUpperCase()],['lowercase',s=>s.toLowerCase()],
 ['Title Case',s=>s.toLowerCase().replace(/(^|\s)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase())],
 ['Sentence case',s=>s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase())],
 ['camelCase',s=>words(s).map((w,i)=>i?w[0].toUpperCase()+w.slice(1):w).join('')],
 ['snake_case',s=>words(s).join('_')],['kebab-case',s=>words(s).join('-')]]}));
add('remove-duplicate-lines','Remove Duplicate Lines','TEXT · CLEANER','Hapus baris duplikat dari daftar teks dengan cepat.',el=>textIO(el,{label:'Daftar (satu item per baris)',btns:[
 ['Hapus duplikat',s=>{const l=s.split('\n'),u=[...new Set(l)];return{out:u.join('\n'),msg:`✓ ${l.length-u.length} baris duplikat dihapus`}}],
 ['Abaikan huruf besar/kecil',s=>{const seen=new Set();return s.split('\n').filter(x=>{const k=x.trim().toLowerCase();if(seen.has(k))return 0;seen.add(k);return 1}).join('\n')}],
 ['Urutkan A-Z',s=>[...new Set(s.split('\n'))].sort((a,b)=>a.localeCompare(b)).join('\n')],
 ['Hapus baris kosong',s=>s.split('\n').filter(x=>x.trim()).join('\n')]]}));
add('text-formatter','Text Formatter','TEXT · FORMAT','Rapikan spasi, baris kosong, dan format teks secara otomatis.',el=>textIO(el,{btns:[
 ['Rapikan spasi',s=>s.replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').trim()],
 ['Hapus baris kosong',s=>s.split('\n').filter(x=>x.trim()).join('\n')],
 ['Gabung jadi satu baris',s=>s.replace(/\s*\n\s*/g,' ').replace(/ +/g,' ').trim()],
 ['Balik urutan baris',s=>s.split('\n').reverse().join('\n')],
 ['Nomori baris',s=>s.split('\n').map((x,i)=>`${i+1}. ${x}`).join('\n')]]}));

/* ================= IMAGE ================= */
add('image-resizer','Image Resizer','IMAGE · RESIZE','Ubah ukuran gambar sesuai kebutuhan, langsung di browser.',el=>imageTool(el,{suffix:'resized',
 ctl:`<div class="row"><div class="field"><label for="w">Lebar (px)</label><input type="number" id="w" min="1"></div><div class="field"><label for="h">Tinggi (px)</label><input type="number" id="h" min="1"></div><div class="field"><label for="fm">Format</label><select id="fm"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></div></div><label style="margin-top:14px"><input type="checkbox" id="lk" checked> Kunci rasio</label>`,
 load:(i,g)=>{g('w').value=i.naturalWidth;g('h').value=i.naturalHeight},
 sync:(id,i,g)=>{if(!i||!g('lk').checked)return;const r=i.naturalWidth/i.naturalHeight;if(id=='w')g('h').value=Math.round(g('w').value/r);if(id=='h')g('w').value=Math.round(g('h').value*r)},
 run:(i,v)=>{const w=Math.max(1,num(v('w'),i.naturalWidth)),h=Math.max(1,num(v('h'),i.naturalHeight)),m=v('fm'),[c,x]=cv(w,h,m=='image/jpeg'&&'#fff');x.drawImage(i,0,0,w,h);return{c,mime:m,q:.92,ext:m.split('/')[1].replace('jpeg','jpg')}}}));
add('jpg-to-png','JPG to PNG','IMAGE · KONVERSI','Konversi gambar JPG ke format PNG.',el=>imageTool(el,{suffix:'converted',accept:'image/jpeg',
 run:i=>{const[c,x]=cv(i.naturalWidth,i.naturalHeight);x.drawImage(i,0,0);return{c,mime:'image/png',ext:'png'}}}));
add('png-to-jpg','PNG to JPG','IMAGE · KONVERSI','Konversi gambar PNG ke format JPG (latar transparan jadi putih).',el=>imageTool(el,{suffix:'converted',accept:'image/png',
 ctl:`<div class="field" style="margin-top:14px"><label for="q">Kualitas: <span id="qv">90</span>%</label><input type="range" id="q" min="10" max="100" value="90"></div>`,
 sync:(id,i,g)=>{g('qv').textContent=g('q').value},
 run:(i,v)=>{const[c,x]=cv(i.naturalWidth,i.naturalHeight,'#fff');x.drawImage(i,0,0);return{c,mime:'image/jpeg',q:v('q')/100,ext:'jpg'}}}));
add('image-cropper','Image Cropper','IMAGE · CROP','Potong gambar sesuai area dan rasio yang diinginkan.',el=>imageTool(el,{suffix:'crop',
 ctl:`<div class="row"><div class="field"><label for="rt">Rasio</label><select id="rt"><option value="0">Bebas</option><option value="1">1:1</option><option value="1.3333">4:3</option><option value="1.7778">16:9</option><option value="0.75">3:4</option><option value="0.5625">9:16</option></select></div><div class="field"><label for="cx">X</label><input type="number" id="cx" min="0"></div><div class="field"><label for="cy">Y</label><input type="number" id="cy" min="0"></div><div class="field"><label for="cw">Lebar</label><input type="number" id="cw" min="1"></div><div class="field"><label for="ch">Tinggi</label><input type="number" id="ch" min="1"></div></div>`,
 load:(i,g)=>{g('cx').value=0;g('cy').value=0;g('cw').value=i.naturalWidth;g('ch').value=i.naturalHeight},
 sync:(id,i,g)=>{if(!i)return;const r=+g('rt').value,W=i.naturalWidth,H=i.naturalHeight;
  if(id=='rt'&&r){let w=W,h=Math.round(w/r);if(h>H){h=H;w=Math.round(h*r)}g('cw').value=w;g('ch').value=h;g('cx').value=Math.round((W-w)/2);g('cy').value=Math.round((H-h)/2)}
  else if(r&&id=='cw')g('ch').value=Math.round(g('cw').value/r);else if(r&&id=='ch')g('cw').value=Math.round(g('ch').value*r)},
 run:(i,v)=>{const W=i.naturalWidth,H=i.naturalHeight,x=Math.min(Math.max(0,num(v('cx'))),W-1),y=Math.min(Math.max(0,num(v('cy'))),H-1),w=Math.min(Math.max(1,num(v('cw'),W)),W-x),h=Math.min(Math.max(1,num(v('ch'),H)),H-y),[c,k]=cv(w,h);k.drawImage(i,x,y,w,h,0,0,w,h);return{c,mime:'image/png',ext:'png'}}}));

/* ================= DEVELOPER ================= */
add('json-validator','JSON Validator','DEVELOPER · JSON','Cek apakah JSON kamu valid dan lihat letak kesalahannya.',el=>textIO(el,{label:'JSON',ph:'{"nama":"Rean"}',btns:[
 ['Validasi',s=>{if(!s.trim())throw Error('Masukkan JSON dulu');return{out:JSON.stringify(JSON.parse(s),null,2),msg:'✓ JSON valid'}}]]}));
add('base64-encoder','Base64 Encoder','DEVELOPER · BASE64','Encode dan decode teks ke Base64 (aman untuk emoji & huruf non-Latin).',el=>textIO(el,{btns:[
 ['Encode',s=>btoa([...new TextEncoder().encode(s)].map(b=>String.fromCharCode(b)).join(''))],
 ['Decode',s=>{try{return new TextDecoder().decode(Uint8Array.from(atob(s.trim()),c=>c.charCodeAt(0)))}catch{throw Error('Base64 tidak valid')}}]]}));
const fmtHTML=s=>{const V=/^<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr|!)/i;let l=0;
 return s.replace(/(<[^>]+>)/g,'\n$1\n').split('\n').map(x=>x.trim()).filter(Boolean).map(t=>{
  if(/^<\//.test(t))l=Math.max(l-1,0);const r='  '.repeat(l)+t;
  if(/^<[a-z]/i.test(t)&&!V.test(t)&&!/\/>$/.test(t))l++;return r}).join('\n')};
add('html-formatter','HTML Formatter','DEVELOPER · HTML','Rapikan atau perkecil kode HTML secara otomatis.',el=>textIO(el,{label:'Kode HTML',btns:[
 ['Format',fmtHTML],['Minify',s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s+/g,' ').trim()]]}));
add('css-minifier','CSS Minifier','DEVELOPER · CSS','Perkecil ukuran file CSS dengan menghapus spasi dan komentar.',el=>textIO(el,{label:'Kode CSS',btns:[
 ['Minify CSS',s=>{const o=s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{};,>])\s*/g,'$1').replace(/:\s+/g,':').replace(/;}/g,'}').trim();return{out:o,msg:s.length?`✓ Hemat ${s.length-o.length} karakter (${Math.round((1-o.length/s.length)*100)}%)`:''}}]]}));

/* ================= DESIGN ================= */
add('gradient-generator','Gradient Generator','DESIGN · GRADIENT','Buat gradient warna dan salin kode CSS-nya.',el=>{
 el.innerHTML=`<div class="card"><div class="row"><div class="field"><label for="c1">Warna 1</label><input type="color" id="c1" value="#F5D742"></div><div class="field"><label for="c2">Warna 2</label><input type="color" id="c2" value="#3FBFB0"></div><div class="field"><label for="ty">Tipe</label><select id="ty"><option value="linear">Linear</option><option value="radial">Radial</option></select></div></div><label for="an" style="margin-top:14px">Sudut: <span id="av">90</span>°</label><input type="range" id="an" min="0" max="360" value="90"><div class="preview" id="pr" style="margin-top:16px;height:160px"></div></div><div class="card"><label for="cs">Kode CSS</label><textarea id="cs" readonly style="min-height:70px"></textarea><div class="actions"><button class="btn-secondary" id="cp">Salin CSS</button></div></div>`;
 const g=i=>$('#'+i,el),u=()=>{const a=g('an').value;g('av').textContent=a;const x=g('ty').value=='linear'?`linear-gradient(${a}deg, ${g('c1').value}, ${g('c2').value})`:`radial-gradient(circle, ${g('c1').value}, ${g('c2').value})`;g('pr').style.background=x;g('cs').value=`background: ${x};`};
 el.oninput=u;g('cp').onclick=e=>copy(g('cs').value,e.target);u();
});
const h2r=h=>{h=h.replace('#','');if(h.length==3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const r2h=(r,g,b)=>'#'+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join('').toUpperCase();
const r2l=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b);let h=0,s=0,l=(M+m)/2;if(M!=m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M==r?(g-b)/d+(g<b?6:0):M==g?(b-r)/d+2:(r-g)/d+4;h*=60}return[Math.round(h),Math.round(s*100),Math.round(l*100)]};
const l2r=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]};
const parseColor=s=>{s=s.trim();let m;
 if(m=s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i))return h2r(m[1]);
 if(m=s.match(/^rgb\(?\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*\)?$/i))return m.slice(1,4).map(Number);
 if(m=s.match(/^hsl\(?\s*(\d+)[\s,]+(\d+)%?[\s,]+(\d+)%?\s*\)?$/i))return l2r(+m[1],+m[2],+m[3]).map(Math.round);
 return null};
add('color-converter','Color Converter','DESIGN · WARNA','Konversi kode warna antara HEX, RGB, dan HSL.',el=>{
 el.innerHTML=`<div class="card"><label for="ci">Masukkan warna (HEX, RGB, atau HSL)</label><input type="text" id="ci" value="#3FBFB0" placeholder="#3FBFB0 · rgb(63,191,176) · hsl(174,50%,50%)"><div class="preview" id="sw" style="height:80px;margin-top:16px"></div><div class="codes" id="cd" style="margin-top:16px"></div></div>`;
 const u=()=>{const c=parseColor($('#ci',el).value);if(!c){$('#cd',el).innerHTML='<p>Format warna tidak dikenali.</p>';return}
  const[r,g,b]=c.map(x=>Math.min(255,x)),[h,s,l]=r2l(r,g,b);$('#sw',el).style.background=r2h(r,g,b);
  $('#cd',el).innerHTML=rows([['HEX',r2h(r,g,b)],['RGB',`rgb(${r}, ${g}, ${b})`],['HSL',`hsl(${h}, ${s}%, ${l}%)`]])};
 el.oninput=u;cd(el);u();
});
add('shadow-generator','Shadow Generator','DESIGN · SHADOW','Buat CSS box-shadow secara visual dan salin kodenya.',el=>{
 el.innerHTML=`<div class="card"><div class="row">${sl('x','Horizontal',-50,50,6)}${sl('y','Vertikal',-50,50,6)}${sl('b','Blur',0,100,0)}${sl('s','Spread',-50,50,0)}${sl('o','Opacity %',0,100,100)}</div><div class="row"><div class="field"><label for="c">Warna</label><input type="color" id="c" value="#111111"></div><div class="field"><label><input type="checkbox" id="in"> Inset</label></div></div></div><div class="card"><div class="preview" style="display:flex;align-items:center;justify-content:center;height:200px;background:#fff"><div id="bx" style="width:120px;height:120px;background:var(--yellow);border:3px solid #111;border-radius:14px"></div></div><label for="cs" style="margin-top:16px">Kode CSS</label><textarea id="cs" readonly style="min-height:60px"></textarea><div class="actions"><button class="btn-secondary" id="cp">Salin CSS</button></div></div>`;
 const g=i=>$('#'+i,el),u=()=>{['x','y','b','s','o'].forEach(k=>g(k+'v').textContent=g(k).value);const[r,gr,bl]=h2r(g('c').value),v=`${g('in').checked?'inset ':''}${g('x').value}px ${g('y').value}px ${g('b').value}px ${g('s').value}px rgba(${r}, ${gr}, ${bl}, ${g('o').value/100})`;g('bx').style.boxShadow=v;g('cs').value=`box-shadow: ${v};`};
 el.oninput=u;g('cp').onclick=e=>copy(g('cs').value,e.target);u();
});

/* ================= CALCULATOR ================= */
add('percentage-calculator','Percentage Calculator','CALCULATOR · PERSEN','Hitung persentase dengan cepat: bagian, perbandingan, dan perubahan.',el=>{
 const I=(id,v)=>`<input type="number" id="${id}" class="inl" value="${v}">`;
 el.innerHTML=`<div class="card"><label>Hitung ${I('a1',20)} % dari ${I('b1',500)}</label><div class="res" id="r1"></div></div><div class="card"><label>${I('a2',50)} adalah berapa % dari ${I('b2',200)}</label><div class="res" id="r2"></div></div><div class="card"><label>Perubahan dari ${I('a3',100)} ke ${I('b3',150)}</label><div class="res" id="r3"></div></div>`;
 const n=i=>num($('#'+i,el).value),f=x=>(+x.toFixed(4)).toLocaleString('id-ID');
 const u=()=>{$('#r1',el).textContent=f(n('a1')/100*n('b1'));
  $('#r2',el).textContent=n('b2')?f(n('a2')/n('b2')*100)+'%':'—';
  const c=n('a3')?(n('b3')-n('a3'))/n('a3')*100:null;$('#r3',el).textContent=c===null?'—':`${c>=0?'Naik':'Turun'} ${f(Math.abs(c))}%`};
 el.oninput=u;u();
});
const U={Panjang:{m:1,km:1000,cm:.01,mm:.001,mil:1609.344,kaki:.3048,inci:.0254},Berat:{kg:1,g:.001,mg:1e-6,ton:1000,pon:.45359237,ons:.028349523},Volume:{l:1,ml:.001,'m³':1000,galon:3.785411784,cup:.2365882365},Kecepatan:{'m/s':1,'km/jam':1/3.6,mph:.44704,knot:.514444},Suhu:{'°C':0,'°F':0,K:0}};
add('unit-converter','Unit Converter','CALCULATOR · SATUAN','Konversi satuan panjang, berat, volume, kecepatan, dan suhu.',el=>{
 el.innerHTML=`<div class="card"><div class="row"><div class="field"><label for="k">Kategori</label><select id="k">${Object.keys(U).map(k=>`<option>${k}</option>`).join('')}</select></div></div><div class="row"><div class="field"><label for="v">Nilai</label><input type="number" id="v" value="1"></div><div class="field"><label for="a">Dari</label><select id="a"></select></div><div class="field"><label for="b">Ke</label><select id="b"></select></div></div><div class="res" id="r"></div></div>`;
 const g=i=>$('#'+i,el);
 const fill=()=>{const o=Object.keys(U[g('k').value]).map(u=>`<option>${u}</option>`).join('');g('a').innerHTML=o;g('b').innerHTML=o;g('b').selectedIndex=1};
 const u=()=>{const k=g('k').value,x=num(g('v').value),a=g('a').value,b=g('b').value;let r;
  if(k=='Suhu'){const c=a=='°C'?x:a=='°F'?(x-32)*5/9:x-273.15;r=b=='°C'?c:b=='°F'?c*9/5+32:c+273.15}
  else r=x*U[k][a]/U[k][b];
  g('r').textContent=`${x} ${a} = ${+r.toPrecision(8)} ${b}`};
 el.oninput=e=>{if(e.target.id=='k')fill();u()};fill();u();
});
add('age-calculator','Age Calculator','CALCULATOR · UMUR','Hitung umur tepat berdasarkan tanggal lahir.',el=>{
 const today=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
 el.innerHTML=`<div class="card"><div class="row"><div class="field"><label for="bd">Tanggal lahir</label><input type="date" id="bd" max="${today}"></div><div class="field"><label for="td">Hitung sampai</label><input type="date" id="td" value="${today}"></div></div></div><div class="card"><div class="stats" id="s"></div><p id="nb" style="margin-top:14px;text-align:center"></p></div>`;
 const P=i=>new Date($('#'+i,el).value+'T00:00');
 const u=()=>{const b=P('bd'),t=P('td'),s=$('#s',el),nb=$('#nb',el);
  if(isNaN(b)||isNaN(t)||b>t){s.innerHTML='';nb.textContent='Isi tanggal lahir yang valid.';return}
  let y=t.getFullYear()-b.getFullYear(),m=t.getMonth()-b.getMonth(),d=t.getDate()-b.getDate();
  if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate()}if(m<0){y--;m+=12}
  const days=Math.floor((t-b)/864e5),n=new Date(t.getFullYear(),b.getMonth(),b.getDate());if(n<t)n.setFullYear(t.getFullYear()+1);
  s.innerHTML=S([['Tahun',y],['Bulan',m],['Hari',d],['Total hari',days.toLocaleString('id-ID')],['Total minggu',Math.floor(days/7).toLocaleString('id-ID')]]);
  nb.textContent=`Ulang tahun berikutnya dalam ${Math.round((n-t)/864e5)} hari 🎂`};
 el.oninput=u;u();
});
add('discount-calculator','Discount Calculator','CALCULATOR · DISKON','Hitung harga akhir setelah diskon (termasuk diskon bertingkat).',el=>{
 el.innerHTML=`<div class="card"><div class="row"><div class="field"><label for="p">Harga awal (Rp)</label><input type="number" id="p" min="0" value="100000"></div><div class="field"><label for="d">Diskon (%)</label><input type="number" id="d" min="0" max="100" value="20"></div><div class="field"><label for="d2">Diskon tambahan (%)</label><input type="number" id="d2" min="0" max="100" value="0"></div></div></div><div class="card"><div class="stats" id="s"></div></div>`;
 const R=x=>'Rp '+Math.round(x).toLocaleString('id-ID'),n=i=>num($('#'+i,el).value);
 const u=()=>{const p=n('p'),f=p*(1-n('d')/100)*(1-n('d2')/100);$('#s',el).innerHTML=S([['Harga akhir',R(f)],['Kamu hemat',R(p-f)],['Total diskon',(p?+((1-f/p)*100).toFixed(2):0)+'%']])};
 el.oninput=u;u();
});

/* ================= OTHER ================= */
add('password-generator','Password Generator','OTHER · KEAMANAN','Buat password acak yang kuat, dibuat langsung di browser.',el=>{
 el.innerHTML=`<div class="card"><label for="len">Panjang: <span id="lv">16</span></label><input type="range" id="len" min="6" max="64" value="16"><div class="opts"><label><input type="checkbox" id="up" checked> A-Z</label><label><input type="checkbox" id="lo" checked> a-z</label><label><input type="checkbox" id="di" checked> 0-9</label><label><input type="checkbox" id="sy" checked> !@#$</label></div><div class="actions"><button class="btn-primary" id="gen">Generate ulang</button></div></div><div class="card"><label for="pw">Password</label><input type="text" id="pw" readonly class="big"><p id="str" style="margin-top:10px;font-weight:600"></p><div class="actions"><button class="btn-secondary" id="cp">Salin</button></div></div>`;
 const g=i=>$('#'+i,el);
 const gen=()=>{const sets=[['up','ABCDEFGHIJKLMNOPQRSTUVWXYZ'],['lo','abcdefghijklmnopqrstuvwxyz'],['di','0123456789'],['sy','!@#$%^&*()-_=+[]{};:,.?']].filter(s=>g(s[0]).checked).map(s=>s[1]);
  g('lv').textContent=g('len').value;
  if(!sets.length){g('pw').value='';g('str').textContent='Pilih minimal satu jenis karakter.';return}
  const all=sets.join(''),n=+g('len').value,p=Array.from({length:n},()=>all[rnd(all.length)]);
  sets.forEach((s,i)=>p[i]=s[rnd(s.length)]);
  for(let i=n-1;i>0;i--){const j=rnd(i+1);[p[i],p[j]]=[p[j],p[i]]}
  g('pw').value=p.join('');const e=n*Math.log2(all.length);
  g('str').textContent='Kekuatan: '+(e<40?'Lemah':e<60?'Sedang':e<80?'Kuat':'Sangat kuat')};
 el.oninput=gen;g('gen').onclick=gen;g('cp').onclick=e=>g('pw').value&&copy(g('pw').value,e.target);gen();
});
add('pomodoro-timer','Pomodoro Timer','OTHER · PRODUKTIVITAS','Kelola waktu fokus dan istirahat dengan teknik pomodoro.',el=>{
 const M={'Fokus':25,'Istirahat':5,'Istirahat panjang':15};let mode='Fokus',left=1500,t=null;
 el.innerHTML=`<div class="card" style="text-align:center"><div class="row" style="justify-content:center">${Object.keys(M).map(k=>`<button class="btn-secondary" data-m="${k}">${k}</button>`).join('')}</div><div id="tm" style="font-size:72px;font-weight:700;margin:24px 0">25:00</div><div class="actions" style="justify-content:center"><button class="btn-primary" id="st" style="flex:none">Mulai</button><button class="btn-secondary" id="rs">Reset</button></div><p id="md" style="margin-top:14px;font-weight:600"></p></div>`;
 const g=i=>$('#'+i,el),two=n=>String(n).padStart(2,'0');
 const draw=()=>{const s=two(Math.floor(left/60))+':'+two(left%60);g('tm').textContent=s;document.title=(t?s+' · ':'')+'Pomodoro Timer — ReanTools';g('md').textContent=mode;el.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m==mode))};
 const stop=()=>{clearInterval(t);t=null;g('st').textContent='Mulai'};
 const beep=()=>{try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();setTimeout(()=>{o.stop();c.close()},700)}catch{}};
 g('st').onclick=()=>{if(t){stop();draw();return}g('st').textContent='Jeda';const end=Date.now()+left*1000;
  t=setInterval(()=>{left=Math.max(0,Math.round((end-Date.now())/1000));if(!left){stop();beep();draw();g('md').textContent=mode+' selesai 🎉';return}draw()},250)};
 g('rs').onclick=()=>{stop();left=M[mode]*60;draw()};
 el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;stop();left=M[mode]*60;draw()});
 draw();
});
add('random-generator','Random Generator','OTHER · ACAK','Hasilkan angka acak, pilih dari daftar, atau lempar koin dan dadu.',el=>{
 el.innerHTML=`<div class="card"><h2>Angka acak</h2><div class="row"><div class="field"><label for="mn">Min</label><input type="number" id="mn" value="1"></div><div class="field"><label for="mx">Maks</label><input type="number" id="mx" value="100"></div><div class="field"><label for="cn">Jumlah</label><input type="number" id="cn" value="1" min="1" max="100"></div></div><div class="actions"><button class="btn-primary" id="g1">Acak angka</button></div><div class="res" id="r1"></div></div><div class="card"><h2>Pilih dari daftar</h2><textarea id="ls" placeholder="Satu item per baris" aria-label="Daftar item"></textarea><div class="actions"><button class="btn-primary" id="g2">Pilih acak</button></div><div class="res" id="r2"></div></div><div class="card"><h2>Koin &amp; dadu</h2><div class="actions"><button class="btn-primary" id="g3">🪙 Lempar koin</button><button class="btn-secondary" id="g4">🎲 Lempar dadu</button></div><div class="res" id="r3"></div></div>`;
 const g=i=>$('#'+i,el);
 g('g1').onclick=()=>{let a=Math.ceil(num(g('mn').value)),b=Math.floor(num(g('mx').value,100));if(a>b)[a,b]=[b,a];const c=Math.min(100,Math.max(1,num(g('cn').value,1)));g('r1').textContent=Array.from({length:c},()=>a+rnd(b-a+1)).join(', ')};
 g('g2').onclick=()=>{const l=g('ls').value.split('\n').map(x=>x.trim()).filter(Boolean);g('r2').textContent=l.length?l[rnd(l.length)]:'Isi daftar dulu.'};
 g('g3').onclick=()=>g('r3').textContent=rnd(2)?'Kepala 🙂':'Ekor 🪙';
 g('g4').onclick=()=>g('r3').textContent='🎲 '+(1+rnd(6));
});
