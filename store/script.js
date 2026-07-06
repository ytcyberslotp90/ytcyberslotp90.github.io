// ═══════════════════════════════════════════
// DATA — loaded from appsinfo.json
// ═══════════════════════════════════════════
let apps = [], codes = [], websites = [], allItems = [];

const CATEGORY_ICONS  = { Terminal: 'fa-solid fa-terminal', GDI: 'fa-solid fa-wand-magic-sparkles', Tools: 'fa-solid fa-toolbox'};
const CATEGORY_LABELS = { GDI: 'GDI / Visuals' };
const CATEGORY_COLOR  = { Terminal: 'var(--accent)', GDI: 'var(--accent2)', Tools: 'var(--accent3)'};

function categoryIcon(cat){ return CATEGORY_ICONS[cat] || 'fa-solid fa-tag'; }
function categoryLabel(cat){ return cat === 'all' ? 'All Apps' : (CATEGORY_LABELS[cat] || cat); }
function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function domainOf(url){ try { return new URL(url).hostname.replace(/^www\./,''); } catch(e){ return url; } }

// ═══════════════════════════════════════════
// GRID DENSITY
// ═══════════════════════════════════════════
let gridDensity = 'cozy';
function applyGridClass(){
  document.querySelectorAll('.grid-tiles').forEach(g => {
    g.classList.remove('grid-cols-cozy','grid-cols-dense');
    g.classList.add(gridDensity === 'dense' ? 'grid-cols-dense' : 'grid-cols-cozy');
  });
}

// ═══════════════════════════════════════════
// TILE BUILDERS
// ═══════════════════════════════════════════
function tileIconHTML(item){
  if (item._type === 'site') {
    const dom = domainOf(item.url);
    return `<div class="tile-icon" style="background:var(--surface3)"><img src="https://${encodeURIComponent(dom)}/favicon.ico" alt="" onerror="this.style.display='none'"></div>`;
  }
  if (item._type === 'code') {
    return `<div class="tile-icon mono" style="background:linear-gradient(135deg,#3d1425,#7a1f42);color:#ffd7e2;font-size:.65rem;font-weight:700">CODE</div>`;
  }
  return item.iconUrl
    ? `<div class="tile-icon"><img src="${item.iconUrl}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.parentElement.innerHTML='${item.iconFallback||'📦'}'"></div>`
    : `<div class="tile-icon" style="background:${item.iconBg}">${item.iconFallback||'📦'}</div>`;
}
function tileMeta(item){
  if (item._type === 'site') return domainOf(item.url);
  if (item._type === 'code') return item.lang ? item.lang.toUpperCase() : 'Snippet';
  return categoryLabel(item.category);
}
function makeTile(item){
  const d = document.createElement('div');
  d.className = 'tile';
  d.innerHTML = `${tileIconHTML(item)}<div class="tile-name">${escapeHtml(item.name)}</div><div class="tile-meta">${escapeHtml(tileMeta(item))}</div>`;
  d.onclick = () => openDetailById(item.id, true);
  return d;
}
function renderGrid(id, list){
  const g = document.getElementById(id);
  g.innerHTML = '';
  list.forEach(item => g.appendChild(makeTile(item)));
  applyGridClass();
  observeReveal();
}

// ═══════════════════════════════════════════
// PAGES / NAV
// ═══════════════════════════════════════════
function showPage(name){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('mainScroll').scrollTop = 0;
}
function setNav(id){
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function routeHome(){
  document.getElementById('searchInput').value = ''; // Clears the search text bar
  showPage('home');
  if (location.pathname !== '/') history.pushState({page:'home'}, '', '/');
}

// ═══════════════════════════════════════════
// CATALOG
// ═══════════════════════════════════════════
function filterCategory(cat){
  showPage('catalog');
  document.getElementById('catalog-bc').textContent = cat === 'all' ? 'All Apps' : categoryLabel(cat);
  document.querySelectorAll('#chip-bar .chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  const list = cat === 'all' ? apps : apps.filter(a => a.category === cat);
  renderGrid('catalog-grid', list);
  document.getElementById('catalog-empty').classList.toggle('hidden', !!list.length);
  setNav('nav-' + (cat === 'all' ? 'all' : cat));
}
function chipClick(el){
  const cat = el.dataset.cat;
  document.querySelectorAll('#chip-bar .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('catalog-bc').textContent = cat === 'all' ? 'All Apps' : categoryLabel(cat);
  const list = cat === 'all' ? apps : apps.filter(a => a.category === cat);
  renderGrid('catalog-grid', list);
  document.getElementById('catalog-empty').classList.toggle('hidden', !!list.length);
  setNav('nav-' + (cat === 'all' ? 'all' : cat));
}

// ═══════════════════════════════════════════
// DETAIL (generalized across app / code / site)
// ═══════════════════════════════════════════
function openDetailById(id, pushHistory){
  const item = allItems.find(a => a.id === id);
  if (!item) { showToast('Item not found: ' + id); return; }
  showPage('detail');
  setNav('');

  const type = item._type;
  document.getElementById('detail-hero').style.setProperty('--dh-tint',
    type === 'code' ? 'rgba(251,111,146,.10)' : type === 'site' ? 'rgba(45,212,167,.10)' : 'rgba(34,211,238,.10)');

  document.getElementById('detail-bc-name').textContent = item.name;
  const catLink = document.getElementById('detail-bc-cat');
  if (type === 'app') { catLink.textContent = categoryLabel(item.category); catLink.onclick = () => filterCategory(item.category); }
  else if (type === 'code') { catLink.textContent = 'Codes'; catLink.onclick = () => showPage('codes'); }
  else { catLink.textContent = 'Websites'; catLink.onclick = () => showPage('websites'); }

  const dIcon = document.getElementById('detail-icon');
  dIcon.className = 'detail-icon';
  if (type === 'app') {
    dIcon.style.background = item.iconUrl ? 'transparent' : item.iconBg;
    dIcon.innerHTML = item.iconUrl ? `<img src="${item.iconUrl}" alt="">` : `<span style="font-size:2.2rem">${item.iconFallback||'📦'}</span>`;
  } else if (type === 'code') {
    dIcon.style.background = 'linear-gradient(135deg,#3d1425,#7a1f42)';
    dIcon.innerHTML = `<i class="fa-solid fa-code" style="color:#ffd7e2;font-size:1.7rem"></i>`;
  } else {
    dIcon.style.background = 'var(--surface3)';
    dIcon.innerHTML = `<img src="https://${encodeURIComponent(domainOf(item.url))}/favicon.ico" alt="">`;
  }

  document.getElementById('detail-name').textContent = item.name;
  document.getElementById('detail-short-desc').textContent = item.description || item.desc || '';

  const catPill = document.getElementById('detail-cat-pill');
  const verPill = document.getElementById('detail-ver-pill');
  if (type === 'app') { catPill.textContent = categoryLabel(item.category); verPill.textContent = item.version; verPill.classList.remove('hidden'); }
  else if (type === 'code') { catPill.textContent = item.lang ? item.lang.toUpperCase() : 'Code'; verPill.classList.add('hidden'); }
  else { catPill.textContent = domainOf(item.url); verPill.classList.add('hidden'); }

  const actions = document.getElementById('detail-actions');
  const bodyApp = document.getElementById('detail-body-app');
  const bodyCode = document.getElementById('detail-body-code');

  if (type === 'app') {
    bodyApp.classList.remove('hidden'); bodyCode.classList.add('hidden');
    actions.innerHTML = `
      <a href="${item.dl}" target="_blank" class="btn-accent"><i class="fa-solid fa-download"></i> Download</a>
      <a href="${item.repo}" target="_blank" class="btn-glass"><i class="fa-brands fa-github"></i> Source</a>
      ${item.yt ? `<a href="${item.yt}" target="_blank" class="btn-glass"><i class="fa-brands fa-youtube"></i> Demo</a>` : ''}`;
    document.getElementById('detail-about').textContent = item.about || '';
    document.getElementById('detail-tags').innerHTML = (item.tags||[]).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('');
    document.getElementById('detail-info').innerHTML = [
      ['Version', item.version], ['Platform', item.platform], ['Language', item.language],
      ['Size', item.size], ['License', item.license], ['Developer', 'Cyber Slot'], ['Category', categoryLabel(item.category)]
    ].map(([l,v])=>`<div class="info-row"><span class="info-label">${l}</span><span class="info-value">${escapeHtml(v||'—')}</span></div>`).join('');
  } else if (type === 'code') {
    bodyApp.classList.add('hidden');
    bodyCode.classList.remove('hidden');
    actions.innerHTML = '';
    
    document.getElementById('detail-code-lang').textContent = item.lang ? item.lang.toUpperCase() : 'CODE';
    
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
      const container = document.getElementById('detail-code-editor');
      container.innerHTML = ''; 
      
      window.monacoEditor = monaco.editor.create(container, {
        value: item.code || '',
        language: item.lang ? item.lang.toLowerCase() : 'plaintext',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true,
        fontSize: 13.5,
        fontFamily: 'JetBrains Mono, monospace',
        lineHeight: 21,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 14, bottom: 14 },
        backgroundColor: '#05070c'
      });
    });
  } else {
    bodyApp.classList.remove('hidden'); bodyCode.classList.add('hidden');
    actions.innerHTML = `<a href="${item.url}" target="_blank" class="btn-accent"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Website</a>`;
    document.getElementById('detail-about').textContent = item.description || '';
    document.getElementById('detail-tags').innerHTML = (item.tags||[]).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('');
    document.getElementById('detail-info').innerHTML = [
      ['Domain', domainOf(item.url)], ['URL', item.url], ['Category', item.category || 'General']
    ].map(([l,v])=>`<div class="info-row"><span class="info-label">${l}</span><span class="info-value" style="word-break:break-all">${escapeHtml(v||'—')}</span></div>`).join('');
  }

  if (pushHistory) history.pushState({id}, '', '/?id=' + encodeURIComponent(id));
}

function copyCode(){
  if (window.monacoEditor) {
    const textToCopy = window.monacoEditor.getValue();
    const btn = document.getElementById('detail-copy-btn');
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showToast('Code copied to clipboard');
        if (btn) {
          btn.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> Copied!`;
          btn.classList.add('text-emerald-400');
          setTimeout(() => {
            btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
            btn.classList.remove('text-emerald-400');
          }, 2000);
        }
      })
      .catch(() => {
        showToast('Copy failed');
      });
  } else {
    showToast('No code instance found to copy');
  }
}

// ═══════════════════════════════════════════
// URL ROUTING — /id?=<id>
// ═══════════════════════════════════════════
function parseRouteAndOpen(){
  const params = new URLSearchParams(location.search);
  const val = params.get('id');
  
  if (val) { 
    openDetailById(val, false); 
    return; 
  }
  showPage('home'); 
  setNav('nav-home');
}
window.addEventListener('popstate', parseRouteAndOpen);

// ═══════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════
let stimer;
function handleSearch(val){
  clearTimeout(stimer);
  if (!val.trim()) { routeHome(); setNav('nav-home'); return; }
  stimer = setTimeout(() => {
    showPage('search'); setNav('');
    const q = val.toLowerCase();
    
    // Filter across the combined allItems array
    const res = allItems.filter(item => {
      const name = (item.name || "").toLowerCase();
      const desc = (item.description || item.desc || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      const lang = (item.lang || "").toLowerCase();
      const url = (item.url || "").toLowerCase();
      const tags = (item.tags || []).join(" ").toLowerCase();
      
      // Combine all searchable property values into a single matchable string
      return (name + " " + desc + " " + category + " " + lang + " " + url + " " + tags).includes(q);
    });
    
    const empty = document.getElementById('search-empty');
    const grid = document.getElementById('search-grid');
    const count = document.getElementById('search-count');
    
    if (!res.length) { 
      empty.classList.remove('hidden'); 
      grid.classList.add('hidden'); 
      count.textContent = `No results for "${val}"`; 
    } else { 
      empty.classList.add('hidden'); 
      grid.classList.remove('hidden'); 
      count.textContent = `${res.length} result${res.length>1?'s':''} for "${val}"`; 
      
      // Render the mixed results into the search grid container
      renderGrid('search-grid', res); 
    }
  }, 180);
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
function openSettings(){ document.getElementById('settings-panel').classList.add('open'); document.getElementById('settings-overlay').classList.add('open'); }
function closeSettings(){ document.getElementById('settings-panel').classList.remove('open'); document.getElementById('settings-overlay').classList.remove('open'); }

function toggleCompact(el){ el.classList.toggle('on'); document.documentElement.dataset.compact = el.classList.contains('on') ? 'true' : 'false'; showToast('Layout updated'); save('compact', el.classList.contains('on')); }
function toggleGlass(el){
  el.classList.toggle('on'); const on = el.classList.contains('on');
  const style = document.getElementById('no-glass-style') || (() => { const s=document.createElement('style'); s.id='no-glass-style'; document.head.appendChild(s); return s; })();
  style.textContent = on ? '' : '.glass,.glass-2,.topbar,.sidebar,.settings-panel{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}';
  showToast(on ? 'Glassmorphism on' : 'Glassmorphism off'); save('glass', on);
}
function toggle3D(el){ el.classList.toggle('on'); document.documentElement.dataset.no3d = el.classList.contains('on') ? '' : 'true'; showToast(el.classList.contains('on') ? 'Hover lift on' : 'Hover lift off'); save('3d', el.classList.contains('on')); }
function toggleOrbs(el){ el.classList.toggle('on'); const on = el.classList.contains('on'); document.querySelectorAll('.glow').forEach(o => o.style.display = on ? '' : 'none'); showToast(on ? 'Ambient glow on' : 'Ambient glow off'); save('orbs', on); }
function toggleMotion(el){ el.classList.toggle('on'); const on = el.classList.contains('on'); document.documentElement.dataset.reduced = on ? 'true' : 'false'; showToast(on ? 'Reduced motion on' : 'Animations on'); save('motion', on); }

function setAccent(el){
  document.querySelectorAll('.duo-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.documentElement.style.setProperty('--accent', el.dataset.c1);
  document.documentElement.style.setProperty('--accent2', el.dataset.c2);
  document.documentElement.style.setProperty('--tint', el.dataset.c1 + '14');
  showToast('Accent pair updated'); save('accent', {c1: el.dataset.c1, c2: el.dataset.c2});
}
function font_class(size){
  ['sm','md','lg'].forEach(s => document.getElementById('font-'+s).classList.remove('active'));
  document.getElementById('font-'+size).classList.add('active');
  document.documentElement.dataset.fontsize = size;
  showToast('Font size: ' + size); save('font', size);
}
function setFont(size){ font_class(size); }
function setGrid(density){
  gridDensity = density;
  ['cozy','dense'].forEach(d => document.getElementById('grid-'+d).classList.remove('active'));
  document.getElementById('grid-'+density).classList.add('active');
  applyGridClass(); showToast('Grid: ' + density); save('grid', density);
}

function save(key, val){ try { localStorage.setItem('css_'+key, JSON.stringify(val)); } catch(e){} }
function load(key, def){ try { const v = localStorage.getItem('css_'+key); return v !== null ? JSON.parse(v) : def; } catch(e){ return def; } }

function loadSettings(){
  const compact = load('compact', false), glass = load('glass', true), t3d = load('3d', true),
        orbs = load('orbs', true), motion = load('motion', false), accent = load('accent', null),
        font = load('font', 'sm'), grid = load('grid', 'cozy');
  if (compact) { document.getElementById('toggle-compact').classList.add('on'); document.documentElement.dataset.compact = 'true'; }
  if (!glass) { document.getElementById('toggle-glass').classList.remove('on'); toggleGlass(document.getElementById('toggle-glass')); }
  if (!t3d) { document.getElementById('toggle-3d').classList.remove('on'); document.documentElement.dataset.no3d = 'true'; }
  if (!orbs) { document.getElementById('toggle-orbs').classList.remove('on'); document.querySelectorAll('.glow').forEach(o=>o.style.display='none'); }
  if (motion) { document.getElementById('toggle-motion').classList.add('on'); document.documentElement.dataset.reduced = 'true'; }
  if (accent) { const sw = document.querySelector(`[data-c1="${accent.c1}"]`); if (sw) setAccent(sw); }
  setFont(font); setGrid(grid);
}

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ═══════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.getElementById('searchInput').focus(); }
  if (e.key === 'Escape') closeSettings();
});

// ═══════════════════════════════════════════
// SCROLL — progress bar, subtle parallax, reveal-on-scroll
// ═══════════════════════════════════════════
const mainScroll = document.getElementById('mainScroll');
function onMainScroll(){
  const max = mainScroll.scrollHeight - mainScroll.clientHeight;
  const pct = max > 0 ? (mainScroll.scrollTop / max) * 100 : 0;
  document.getElementById('scrollProgress').style.width = pct + '%';
  if (!document.documentElement.dataset.reduced) {
    document.getElementById('bgGrid').style.transform = `translateY(${-mainScroll.scrollTop * 0.04}px)`;
  }
}
mainScroll.addEventListener('scroll', onMainScroll, { passive: true });

let revealObserver;
function observeReveal(){
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in-view'); revealObserver.unobserve(en.target); } });
    }, { root: mainScroll, threshold: 0.12 });
  }
  document.querySelectorAll('.reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
}

// ═══════════════════════════════════════════
// BUILD UI
// ═══════════════════════════════════════════
function buildCategoryNav(){
  const cats = [...new Set(apps.map(a => a.category))];
  document.getElementById('nav-categories').innerHTML = cats.map(cat => {
    const count = apps.filter(a => a.category === cat).length;
    return `<div class="nav-item" id="nav-${cat}" onclick="filterCategory('${cat}');setNav('nav-${cat}')">
      <i class="${categoryIcon(cat)}" style="color:${CATEGORY_COLOR[cat]}"></i> ${categoryLabel(cat)}
      <span class="nav-count">${count}</span>
    </div>`;
  }).join('');
  document.getElementById('count-all').textContent = apps.length;
  document.getElementById('count-codes').textContent = codes.length;
  document.getElementById('count-websites').textContent = websites.length;
  document.getElementById('stat-count').textContent = allItems.length;
  document.getElementById('hstat-apps').textContent = apps.length;
  document.getElementById('hstat-codes').textContent = codes.length;
  document.getElementById('hstat-sites').textContent = websites.length;
}
function buildChipBar(){
  const cats = [...new Set(apps.map(a => a.category))];
  document.getElementById('chip-bar').innerHTML = '<div class="chip active" data-cat="all" onclick="chipClick(this)">All</div>' +
    cats.map(cat => `<div class="chip" data-cat="${cat}" onclick="chipClick(this)">${categoryLabel(cat)}</div>`).join('');
}
function buildHomeGrids(){
  renderGrid('home-featured', apps.filter(a => a.featured));
  renderGrid('home-all', apps);
}
function buildLibraryPages(){
  renderGrid('codes-grid', codes);
  document.getElementById('codes-empty').classList.toggle('hidden', !!codes.length);
  document.getElementById('codes-grid').classList.toggle('hidden', !codes.length);

  renderGrid('websites-grid', websites);
  document.getElementById('websites-empty').classList.toggle('hidden', !!websites.length);
  document.getElementById('websites-grid').classList.toggle('hidden', !websites.length);

  const ct = document.getElementById('home-codes-teaser');
  if (codes.length) renderGrid('home-codes-teaser', codes.slice(0,5));
  else ct.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-code"></i><h4>No snippets yet</h4><p>Raw code dropped into <code>appsinfo.json → codes[]</code> will show up here.</p></div>`;

  const wt = document.getElementById('home-sites-teaser');
  if (websites.length) renderGrid('home-sites-teaser', websites.slice(0,5));
  else wt.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-link"></i><h4>No links yet</h4><p>Links dropped into <code>appsinfo.json → websites[]</code> will show up here.</p></div>`;
}
function buildHeroShowcase(){
  const el = document.getElementById('heroShowcase');
  el.innerHTML = '';
  apps.slice(0, 6).forEach(a => {
    const d = document.createElement('div');
    d.className = 'showcase-icon';
    d.title = a.name;
    d.onclick = () => openDetailById(a.id, true);
    d.innerHTML = a.iconUrl ? `<img src="${a.iconUrl}" alt="${escapeHtml(a.name)}">` : `<span style="font-size:1.4rem">${a.iconFallback||'📦'}</span>`;
    el.appendChild(d);
  });
}

document.getElementById('yr').textContent = new Date().getFullYear();

async function init(){
  try {
    const res = await fetch('appsinfo.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    apps = data.apps || [];
    codes = data.codes || [];
    websites = data.websites || [];
    apps.forEach(a => a._type = 'app');
    codes.forEach(c => c._type = 'code');
    websites.forEach(w => w._type = 'site');
    allItems = [...apps, ...codes, ...websites];

    buildCategoryNav();
    buildChipBar();
    buildHomeGrids();
    buildLibraryPages();
    buildHeroShowcase();
    applyGridClass();
    loadSettings();

    parseRouteAndOpen();
    observeReveal();
    onMainScroll();
  } catch (err) {
    console.error('Failed to load appsinfo.json:', err);
    showPage('load-error');
  }
}
init();