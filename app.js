'use strict';

/* ============================================================
   KATAKCODE — AI koding Buggames Studio
   Gratis via Pollinations, atau API key milik pengguna.
   Tidak ada server; key hanya ditembak langsung ke provider.
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2));

const DB_NAME = 'katakcode-db';
const DB_VERSION = 1;
const CHATS = 'chats';

const SYSTEM_PROMPT = () => `Kamu KatakCode — asisten koding & teknologi besutan Buggames Studio.
Jawab dalam Bahasa Indonesia kecuali pengguna meminta bahasa lain.
Gaya: praktis, langsung ke solusi, contoh kode nyata dalam code block bertag bahasa (\`\`\`javascript).
Untuk error: sebutkan penyebab paling mungkin dulu, baru solusinya.
Tanggal hari ini: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
Jangan mengarang API/library yang tidak ada. Kalau tidak yakin, bilang tidak yakin.`;

/* ================= KODOK SVG (maskot, tanpa emoji) ================= */
const frogJump = (size = 150) => `<svg class="frog frog-jump" width="${size}" height="${Math.round(size * 0.82)}" viewBox="0 0 160 132" role="img" aria-label="Kodok Buggames melompat">
  <ellipse cx="80" cy="120" rx="34" ry="6" fill="#e6e3d9"/>
  <path d="M34 98c-10 2-14 10-10 14 6 5 22 2 30-4z" fill="#3d8f57"/><path d="M126 98c10 2 14 10 10 14-6 5-22 2-30-4z" fill="#3d8f57"/>
  <ellipse cx="80" cy="84" rx="46" ry="34" fill="#4aa768"/><ellipse cx="80" cy="90" rx="30" ry="20" fill="#8ed1a4"/>
  <circle cx="56" cy="48" r="14" fill="#4aa768"/><circle cx="104" cy="48" r="14" fill="#4aa768"/>
  <circle cx="56" cy="46" r="9" fill="#fff"/><circle cx="104" cy="46" r="9" fill="#fff"/>
  <circle cx="57" cy="47" r="4.4" fill="#1f1e1c"/><circle cx="103" cy="47" r="4.4" fill="#1f1e1c"/>
  <circle cx="58.7" cy="45.3" r="1.5" fill="#fff"/><circle cx="104.7" cy="45.3" r="1.5" fill="#fff"/>
  <path d="M62 76q18 13 36 0" stroke="#1f1e1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="66" cy="82" r="2.3" fill="#e58aa0" opacity=".75"/><circle cx="94" cy="82" r="2.3" fill="#e58aa0" opacity=".75"/>
</svg>`;

const frogTyping = () => `<svg class="frog frog-type" width="62" height="52" viewBox="0 0 78 56" role="img" aria-label="Kodok mengetik di laptop dan menekan ENTER">
  <ellipse cx="39" cy="51" rx="30" ry="3.4" fill="#e6e3d9"/>
  <ellipse cx="24" cy="22" rx="15" ry="12" fill="#4aa768"/><ellipse cx="54" cy="22" rx="15" ry="12" fill="#4aa768"/>
  <circle cx="24" cy="18.6" r="8.2" fill="#4aa768"/><circle cx="54" cy="18.6" r="8.2" fill="#4aa768"/>
  <circle cx="24" cy="17.3" r="5" fill="#fff"/><circle cx="54" cy="17.3" r="5" fill="#fff"/>
  <circle cx="25" cy="18.2" r="2.4" fill="#1f1e1c"/><circle cx="55" cy="18.2" r="2.4" fill="#1f1e1c"/>
  <rect x="8" y="33" width="62" height="13" rx="2.4" fill="#2b2a28"/>
  <rect x="12" y="36" width="54" height="7" rx="1.3" fill="#3d3b34"/>
  <path d="M16 39.5h8" stroke="#e6c26b" stroke-width="1.5" stroke-linecap="round"/>
  <rect class="enter-key" x="46" y="36" width="17" height="7" rx="1.4" fill="#d8d4c8"/>
  <text class="enter-text" x="54.5" y="41.6" text-anchor="middle" font-size="4.4" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="#26241f">ENTER</text>
  <ellipse class="hand" cx="28" cy="35" rx="4" ry="2.3" fill="#4aa768"/><ellipse class="hand r" cx="37" cy="35" rx="4" ry="2.3" fill="#4aa768"/>
</svg>`;

const frogDoc = () => `<svg class="frog frog-doc" width="62" height="55" viewBox="0 0 78 60" role="img" aria-label="Kodok membuka dokumen">
  <ellipse cx="30" cy="42" rx="17" ry="11.5" fill="#4aa768"/>
  <circle cx="22.5" cy="30" r="6.4" fill="#4aa768"/><circle cx="37.5" cy="30" r="6.4" fill="#4aa768"/>
  <circle cx="22.5" cy="28.6" r="4" fill="#fff"/><circle cx="37.5" cy="28.6" r="4" fill="#fff"/>
  <circle cx="23.3" cy="29.2" r="1.9" fill="#1f1e1c"/><circle cx="38.3" cy="29.2" r="1.9" fill="#1f1e1c"/>
  <path d="M25 37.5q5.5 3.8 11 0" stroke="#1f1e1c" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <path d="M46 4h13l7 7v28a3.4 3.4 0 0 1-3.4 3.4H46z" fill="#ffffff" stroke="#d8d4c8" stroke-width="2"/>
  <path d="M46 4v7h7" fill="none" stroke="#d8d4c8" stroke-width="2"/>
  <path class="code-line" d="M51 17h10M51 22h10M51 27h7" stroke="#d97757" stroke-width="1.7" stroke-linecap="round"/>
</svg>`;

const frogDizzy = () => `<svg class="frog frog-dizzy" width="74" height="62" viewBox="0 0 150 126" role="img" aria-label="Kodok pusing">
  <ellipse cx="75" cy="112" rx="32" ry="6" fill="#e6e3d9"/>
  <ellipse cx="75" cy="78" rx="44" ry="32" fill="#4aa768"/>
  <path d="M46 40l10 8M56 40l-10 8" stroke="#1f1e1c" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M94 40l10 8M104 40l-10 8" stroke="#1f1e1c" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M52 84q23 16 46 0" stroke="#1f1e1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>`;

/* ================= IndexedDB ================= */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(CHATS)) db.createObjectStore(CHATS, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
const reqP = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const dbAllChats = async () => { const db = await openDB(); return reqP(db.transaction(CHATS, 'readonly').objectStore(CHATS).getAll()); };
const dbSaveChat = async (chat) => { const db = await openDB(); chat.updatedAt = Date.now(); await reqP(db.transaction(CHATS, 'readwrite').objectStore(CHATS).put(chat)); };
const dbDeleteChat = async (id) => { const db = await openDB(); await reqP(db.transaction(CHATS, 'readwrite').objectStore(CHATS).delete(id)); };
const dbClearChats = async () => { const db = await openDB(); await reqP(db.transaction(CHATS, 'readwrite').objectStore(CHATS).clear()); };

/* ================= PROVIDER & PENGATURAN ================= */
const PROVIDERS = [
  { id: 'pollinations', label: 'Pollinations', desc: 'Gratis · tanpa API key · langsung jalan (±1 balasan / 45 dtk)', icon: 'i-flower', keyHint: 'sk-… (opsional — kosongkan = gratis anon)', model: 'openai', modelLabel: 'MODEL (default: openai)' },
  { id: 'openrouter', label: 'OpenRouter', desc: 'Satu key, ratusan model: Gemini, GPT, Claude, dan lainnya', icon: 'i-shuffle', keyHint: 'sk-or-…', model: 'google/gemini-2.5-flash', modelLabel: 'MODEL (mis. google/gemini-2.5-flash)' },
  { id: 'gemini', label: 'Gemini (Google)', desc: 'API key dari Google AI Studio · ada tier gratis · bisa Mode Web', icon: 'i-sparkle', keyHint: 'AIza…', model: 'gemini-2.5-flash', modelLabel: 'MODEL (mis. gemini-2.5-flash)' },
  { id: 'openai', label: 'OpenAI', desc: 'GPT-4o / 4.1 · API key dari platform.openai.com', icon: 'i-oai', keyHint: 'sk-…', model: 'gpt-4o-mini', modelLabel: 'MODEL (mis. gpt-4o-mini)' },
];
const LS = {
  get provider() { return localStorage.getItem('kc_provider') || 'pollinations'; },
  set provider(v) { localStorage.setItem('kc_provider', v); },
  key: (p) => localStorage.getItem('kc_key_' + p) || '',
  setKey: (p, v) => localStorage.setItem('kc_key_' + p, v),
  model: (p) => localStorage.getItem('kc_model_' + p) || PROVIDERS.find(x => x.id === p).model,
  setModel: (p, v) => localStorage.setItem('kc_model_' + p, v),
  get grounding() { return localStorage.getItem('kc_grounding') === '1'; },
  set grounding(v) { localStorage.setItem('kc_grounding', v ? '1' : '0'); },
};
const providerDef = () => PROVIDERS.find(p => p.id === LS.provider);
const providerReady = (p = LS.provider) => p === 'pollinations' || LS.key(p).trim().length > 8;

function renderProviderList() {
  const box = $('#providerList');
  box.innerHTML = PROVIDERS.map(p => `
    <button class="provider${p.id === LS.provider ? ' on' : ''}" data-provider="${p.id}" role="radio" aria-checked="${p.id === LS.provider}">
      <span class="prov-ic"><svg><use href="#${p.icon}"/></svg></span>
      <span class="prov-meta"><b>${p.label}</b><small>${p.desc}</small></span>
      <span class="radio"></span>
    </button>`).join('');
  $$('.provider', box).forEach(btn => btn.addEventListener('click', () => {
    LS.provider = btn.dataset.provider;
    renderProviderList();
    syncKeyBox();
    updateModelPill();
    showToast(`Otak kodok: ${providerDef().label}`);
  }));
}
function syncKeyBox() {
  const p = providerDef();
  $('#apiKeyLabel').textContent = p.id === 'pollinations' ? 'API KEY (OPSIONAL)' : 'API KEY';
  $('#apiKeyInput').placeholder = p.keyHint;
  $('#apiKeyInput').value = LS.key(p.id);
  $('#modelLabel').textContent = p.modelLabel;
  $('#modelInput').value = LS.model(p.id);
  $('#modelInput').placeholder = p.model;
  $('#groundingRow').hidden = p.id !== 'gemini';
  $('#groundingToggle').checked = LS.grounding;
}
$('#providerList').addEventListener('input', () => {});
$('#apiKeyInput').addEventListener('input', (e) => LS.setKey(LS.provider, e.target.value.trim()));
$('#modelInput').addEventListener('input', (e) => LS.setModel(LS.provider, e.target.value.trim()));
$('#groundingToggle').addEventListener('change', (e) => { LS.grounding = e.target.checked; showToast(e.target.checked ? 'Mode Web aktif (Google Search)' : 'Mode Web mati'); });
$('#btnClearHistory').addEventListener('click', async () => {
  await dbClearChats();
  state.chats = [];
  state.currentId = null;
  state.messages = [];
  renderAll();
  showToast('Semua riwayat dihapus');
});

function updateModelPill() {
  const p = providerDef();
  let extra = '';
  if (p.id === 'pollinations') extra = ' · Gratis';
  else if (!providerReady(p.id)) extra = ' · butuh key';
  $('#modelPillText').textContent = p.label + extra;
}

/* Buka/tutup pengaturan */
$('#btnSettingsDesk').addEventListener('click', openSettings);
$('#btnSettingsTop').addEventListener('click', openSettings);
$('#modelPill').addEventListener('click', openSettings);
$('#btnCloseSettings').addEventListener('click', () => { $('#settingsView').hidden = true; });
function openSettings() { renderProviderList(); syncKeyBox(); $('#settingsView').hidden = false; }

/* ================= STATE ================= */
const state = {
  chats: [],
  currentId: null,
  messages: [],          // [{role, content, attachments?:[{name,size,text}], t}]
  streaming: false,
  attachments: [],       // lampiran belum terkirim
  project: null,         // { name, files: [{ path, text, size }] }
  abortCtrl: null,
  lastAiId: null,
};

const fileToAttachment = (file) => new Promise((resolve) => {
  if (file.size > 120 * 1024) { resolve({ name: file.name, size: file.size, text: '', tooBig: true }); return; }
  const reader = new FileReader();
  reader.onload = () => resolve({ name: file.name, size: file.size, text: String(reader.result) });
  reader.onerror = () => resolve({ name: file.name, size: file.size, text: '', tooBig: true });
  reader.readAsText(file);
});

/* ================= RENDER PESAN ================= */
function linkifyHTML(text) {
  const escaped = escapeHTML(text);
  return escaped.replace(/(https?:\/\/[^\s<]+[^\s<.,!?)\]"'])/g, (url) => {
    try {
      const u = new URL(url);
      const fav = `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
      return `<a class="link-card" href="${url}" target="_blank" rel="noopener noreferrer"><img src="${fav}" alt="" onerror="this.remove()" loading="lazy"><span class="link-url">${escapeHTML(u.hostname + u.pathname.slice(0, 40))}</span></a>`;
    } catch { return url; }
  });
}

function highlight(code) {
  return escapeHTML(code)
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-c">$1</span>')
    .replace(/(#[^\n]*)/g, '<span class="tok-c">$1</span>')
    .replace(/("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/g, '<span class="tok-s">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|async|await|import|export|from|default|class|extends|new|typeof|try|catch|switch|case|break|throw|interface|type|enum|public|private|static|readonly|def|elif|lambda|with|as|pass|raise|in|not|and|or|of|null|undefined|true|false|None|True|False)\b/g, '<span class="tok-k">$1</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-n">$1</span>');
}

function renderContent(raw) {
  const parts = String(raw).split(/```/);
  let html = '';
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      const nl = part.indexOf('\n');
      const lang = nl > -1 ? part.slice(0, nl).trim() : 'code';
      const code = nl > -1 ? part.slice(nl + 1) : part;
      html += `<div class="codeblock"><div class="code-head"><span>${escapeHTML(lang || 'code')}</span><button class="copy-btn" data-copy>Salin</button></div><pre>${highlight(code.replace(/\n$/, ''))}</pre></div>`;
    } else {
      html += linkifyHTML(part);
    }
  });
  return html;
}

function bubbleHTML(msg, id) {
  if (msg.role === 'user') {
    const proj = msg.project ? `<span class="file-chip project-chip"><svg><use href="#i-folder"/></svg><b>${escapeHTML(msg.project)}</b>proyek</span>` : '';
    const chips = (msg.attachments || []).filter(a => a && a.name).map(a => `<span class="file-chip"><svg><use href="#i-file"/></svg><b>${escapeHTML(a.name)}</b>${a.size ? (a.size / 1024).toFixed(0) + ' KB' : ''}</span>`).join('');
    const allChips = proj + chips;
    return `<div class="msg user">${allChips ? `<div class="attach-chips">${allChips}</div>` : ''}<div class="bubble">${linkifyHTML(msg.content)}</div></div>`;
  }
  return `<div class="msg assistant" data-msg-id="${id}">
    <div class="bubble">${renderContent(msg.content)}</div>
    <div class="msg-assistant-tools">
      <button class="tool-btn" data-copy-msg title="Salin jawaban"><svg><use href="#i-copy"/></svg></button>
      <button class="tool-btn" data-speak-msg title="Baca jawaban"><svg><use href="#i-speaker"/></svg></button>
    </div>
  </div>`;
}

function renderMessages() {
  const box = $('#messages');
  box.innerHTML = state.messages.map((m, i) => bubbleHTML(m, i)).join('');
  box.scrollTop = box.scrollHeight;
  $('#emptyState').classList.toggle('visible', state.messages.length === 0);
  box.classList.toggle('has-content', state.messages.length > 0);
}

function renderThinking(kind) {
  removeThinking();
  const box = $('#messages');
  const div = document.createElement('div');
  div.className = 'msg assistant think-row';
  div.id = 'thinkingRow';
  const label = kind === 'code' ? 'Kodok lagi ngetik &amp; tekan ENTER' : kind === 'doc' ? 'Kodok baca dokumen kamu' : 'Kodok melompat memikirkan jawaban';
  const frog = kind === 'code' ? frogTyping() : kind === 'doc' ? frogDoc() : `<span style="transform:scale(.45);transform-origin:left center;display:inline-flex;width:70px">${frogJump(120)}</span>`;
  div.innerHTML = `${frog}<span class="think-txt">${label}<span class="think-dots"><i></i><i></i></span></span>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function removeThinking() { const t = $('#thinkingRow'); if (t) t.remove(); }

function showErrorBubble(text) {
  removeThinking();
  const box = $('#messages');
  const div = document.createElement('div');
  div.className = 'msg assistant error';
  div.innerHTML = `${frogDizzy()}<div class="bubble">${escapeHTML(text)}</div><div class="msg-assistant-tools"><button class="tool-btn" data-retry><svg><use href="#i-refresh"/></svg></button></div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

/* ================= RIWAYAT ================= */
function groupLabel(ts) {
  const day = (t) => new Date(t).toDateString();
  const today = day(Date.now()), y = day(Date.now() - 86400000);
  if (day(ts) === today) return 'Hari ini';
  if (day(ts) === y) return 'Kemarin';
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function renderHistory() {
  const groups = new Map();
  [...state.chats].sort((a, b) => b.updatedAt - a.updatedAt).forEach(c => {
    const g = groupLabel(c.updatedAt);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(c);
  });
  const html = groups.size
    ? [...groups].map(([g, items]) => `<div class="hist-group">${g}</div>${items.map(c => `
        <button class="hist-item${c.id === state.currentId ? ' active' : ''}" data-chat="${c.id}">
          <span class="hist-title">${escapeHTML(c.title || 'Chat tanpa judul')}</span>
          <span class="hist-del" data-del-chat="${c.id}" role="button" aria-label="Hapus chat" title="Hapus"><svg><use href="#i-trash"/></svg></span>
        </button>`).join('')}`).join('')
    : '<p class="hist-empty">Belum ada riwayat. Chat baru kamu otomatis tersimpan di sini — tersimpan lokal di perangkat ini.</p>';
  $('#historyListDesk').innerHTML = html;
  $('#historyListMobile').innerHTML = html;
}
function bindHistoryClicks(containerSel) {
  $$(containerSel).forEach(box => box.addEventListener('click', async (e) => {
    const del = e.target.closest('[data-del-chat]');
    if (del) { e.stopPropagation(); await dbDeleteChat(del.dataset.delChat); if (state.currentId === del.dataset.delChat) newChat(); await reloadChats(); return; }
    const item = e.target.closest('[data-chat]');
    if (item) { openChat(item.dataset.chat); $('#historyDrawer').hidden = true; }
  }));
}
bindHistoryClicks('#historyListDesk');
bindHistoryClicks('#historyListMobile');

function openChat(id) {
  const chat = state.chats.find(c => c.id === id);
  if (!chat) return;
  state.currentId = id;
  state.messages = (chat.messages || []).map(m => ({ ...m }));
  state.attachments = [];
  state.project = chat.project || null;
  renderAttachRow();
  renderMessages();
  renderHistory();
}
function newChat() {
  state.currentId = null;
  state.messages = [];
  state.attachments = [];
  state.project = null;
  renderAttachRow();
  renderMessages();
  renderHistory();
  $('#input').focus();
}
$('#btnNewChat').addEventListener('click', newChat);
$('#btnNewChatMobile').addEventListener('click', () => { newChat(); $('#historyDrawer').hidden = true; });
$('#btnMenu').addEventListener('click', () => { $('#historyDrawer').hidden = !$('#historyDrawer').hidden; });
$('#btnCloseHistory').addEventListener('click', () => { $('#historyDrawer').hidden = true; });

async function reloadChats() {
  state.chats = (await dbAllChats()).sort((a, b) => b.updatedAt - a.updatedAt);
  renderHistory();
}
async function persistChat() {
  if (!state.currentId) state.currentId = uid();
  const firstUser = state.messages.find(m => m.role === 'user');
  const title = firstUser ? firstUser.content.slice(0, 48) : 'Chat tanpa judul';
  let chat = state.chats.find(c => c.id === state.currentId);
  if (!chat) { chat = { id: state.currentId, createdAt: Date.now(), provider: LS.provider, model: LS.model(LS.provider) }; state.chats.unshift(chat); }
  chat.title = title;
  chat.provider = LS.provider;
  chat.model = LS.model(LS.provider);
  chat.messages = state.messages;
  chat.project = state.project || null;
  await dbSaveChat(chat);
  renderHistory();
}

/* ================= LAMPIRAN ================= */
$('#btnAttach').addEventListener('click', () => $('#fileInput').click());
const PROJECT_EXTS = /\.(js|jsx|ts|tsx|mjs|cjs|py|java|c|cc|cpp|h|hpp|cs|go|rs|rb|php|swift|kt|kts|m|html|css|scss|less|vue|svelte|json|md|txt|ya?ml|toml|ini|env|sh|bash|ps1|sql|xml|gradle|properties|cfg|conf|dockerfile|gitignore|lock)$/i;

$('#btnProject').addEventListener('click', () => $('#projectInput').click());
$('#emptyAddProject').addEventListener('click', () => $('#projectInput').click());
$('#projectInput').addEventListener('change', async (e) => {
  const files = [...e.target.files];
  e.target.value = '';
  if (!files.length) return;
  const docs = [];
  let total = 0;
  for (const f of files) {
    if (docs.length >= 40) break;
    if (f.size > 80 * 1024) continue;
    if (!PROJECT_EXTS.test(f.name) && !/^(dockerfile|makefile|readme)$/i.test(f.name)) continue;
    let text = '';
    try { text = await f.text(); } catch { continue; }
    if (text.includes('\0')) continue;
    const slice = text.slice(0, 55 * 1024);
    if (total + slice.length > 200 * 1024) break;
    total += slice.length;
    docs.push({ path: f.webkitRelativePath || f.name, text: slice, size: f.size });
  }
  if (!docs.length) { showToast('Tidak ada file kode/teks yang terbaca di folder itu'); return; }
  const projectName = (files[0].webkitRelativePath || files[0].name).split('/')[0] || 'proyek';
  state.project = { name: projectName, files: docs };
  renderAttachRow();
  showToast(`Proyek "${projectName}" dimuat — ${docs.length} file dibaca`);
});

$('#fileInput').addEventListener('change', async (e) => {
  const files = [...e.target.files].slice(0, 6);
  let total = state.attachments.reduce((s, a) => s + (a.text || '').length, 0);
  for (const file of files) {
    if (state.attachments.length >= 6) { showToast('Maksimal 6 file per pesan'); break; }
    const att = await fileToAttachment(file);
    if (att.tooBig) { showToast(`“${file.name}” > 120 KB dilewati`); continue; }
    if (total + att.text.length > 250 * 1024) { showToast('Total lampiran kepenuhan (250 KB)'); break; }
    total += att.text.length;
    state.attachments.push(att);
  }
  renderAttachRow();
  e.target.value = '';
});
function renderAttachRow() {
  const row = $('#attachRow');
  const items = [];
  if (state.project) {
    const totalText = state.project.files.reduce((s, f) => s + (f.text || '').length, 0);
    const sizeLabel = totalText < 1024 ? `${totalText} B` : `${(totalText / 1024).toFixed(1)} KB`;
    items.push(`<span class="file-chip project-chip"><svg><use href="#i-folder"/></svg><b>${escapeHTML(state.project.name)}</b>${state.project.files.length} file · ${sizeLabel}<button data-detach-project aria-label="Lepas proyek" title="Lepas proyek"><svg><use href="#i-close"/></svg></button></span>`);
  }
  state.attachments.forEach((a, i) => {
    items.push(`<span class="file-chip"><svg><use href="#i-file"/></svg><b>${escapeHTML(a.name)}</b>${(a.size / 1024).toFixed(0)} KB<button data-detach="${i}" aria-label="Lepas file" title="Lepas"><svg><use href="#i-close"/></svg></button></span>`);
  });
  if (!items.length) { row.hidden = true; row.innerHTML = ''; return; }
  row.hidden = false;
  row.innerHTML = items.join('');
  $$('[data-detach]', row).forEach(btn => btn.addEventListener('click', () => { state.attachments.splice(+btn.dataset.detach, 1); renderAttachRow(); }));
  const dp = $('[data-detach-project]', row);
  if (dp) dp.addEventListener('click', () => { state.project = null; renderAttachRow(); showToast('Proyek dilepas'); });
}

/* ================= SUARA ================= */
let speakEnabled = false;
$('#btnSpeak').addEventListener('click', () => {
  speakEnabled = !speakEnabled;
  $('#btnSpeak').setAttribute('aria-pressed', speakEnabled);
  if (!speakEnabled) speechSynthesis.cancel();
  showToast(speakEnabled ? 'Kodok akan membacakan jawaban' : 'Suara mati');
});
function speak(text) {
  if (!speakEnabled || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(String(text).replace(/```[\s\S]*?```/g, ' [kode] ').slice(0, 1200));
  u.lang = 'id-ID';
  u.rate = 1.02;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRec) { $('#btnMic').style.display = 'none'; }
else {
  const rec = new SpeechRec();
  rec.lang = 'id-ID'; rec.interimResults = true; rec.maxAlternatives = 1;
  let listening = false;
  $('#btnMic').addEventListener('click', () => {
    if (listening) { rec.stop(); return; }
    try { rec.start(); listening = true; $('#btnMic').setAttribute('aria-pressed', 'true'); showToast('Kodok mendengarkan… bicara'); } catch { listening = false; }
  });
  rec.addEventListener('result', (e) => {
    let txt = '';
    for (const r of e.results) txt += r[0].transcript;
    $('#input').value = txt;
  });
  rec.addEventListener('end', () => { listening = false; $('#btnMic').setAttribute('aria-pressed', 'false'); });
  rec.addEventListener('error', () => { listening = false; $('#btnMic').setAttribute('aria-pressed', 'false'); });
}

/* ================= KIRIM & STREAMING ================= */
function buildMessages() {
  const projectCtx = state.project
    ? `\n\n=== PROYEK PENGGUNA: ${state.project.name} (${state.project.files.length} file) ===\nStruktur:\n${state.project.files.map(f => f.path).join('\n')}\n${(() => {
        let budget = 22000, out = '';
        for (const f of state.project.files) {
          const block = `\n--- FILE: ${f.path} ---\n${f.text}\n`;
          if (budget - block.length < 0) { out += `\n--- FILE: ${f.path} --- [tidak dimuat — terlalu besar]\n`; continue; }
          budget -= block.length; out += block;
        }
        return out;
      })()}\n=== AKHIR PROYEK ===`
    : '';
  const sys = { role: 'system', content: SYSTEM_PROMPT() + projectCtx };
  const history = state.messages.slice(-24).map(m => {
    let content = m.content;
    if (m.attachments?.length) {
      const attText = m.attachments.map(a => `\n\n--- FILE: ${a.name} (${(a.size / 1024).toFixed(0)} KB) ---\n${a.text || '[tidak terbaca]'}`).join('');
      content += attText;
    }
    return { role: m.role === 'assistant' ? 'assistant' : 'user', content };
  });
  return [sys, ...history];
}

const CODE_HINT = /\b(kode|code|coding|bug|error|fungsi|function|script|api|javascript|typescript|python|html|css|sql|server|deploy|git|regex|json|react|node|express|java|golang|rust|laravel|php|debug|algorithm|stack|array|loop|kompilasi|syntax|compile)\b/i;

async function readLinksFromMessage(text) {
  const urls = [...String(text).matchAll(/https?:\/\/[^\s)]+/g)].map(m => m[0].replace(/[.,;:!?'"]+$/, '')).slice(0, 3);
  if (!urls.length) return '';
  showToast('Kodok membuka link…');
  const chunks = [];
  for (const url of urls) {
    let content = null;
    try {
      const r = await fetch(`https://proxy.corsfix.com/?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(15000) });
      if (r.ok) content = await r.text();
    } catch { /* coba fallback */ }
    if (!content) {
      try {
        const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(15000) });
        if (r.ok) content = await r.text();
      } catch { /* lewati */ }
    }
    if (content) {
      const textOnly = content.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      chunks.push(`\n\n--- ISI LINK (${url}) diambil sekarang ---\n${textOnly.slice(0, 5000)}\n--- AKHIR LINK ---`);
    }
  }
  return chunks.join('');
}

function buildRequest(messages) {
  const p = LS.provider;
  const model = LS.model(p);
  const key = LS.key(p).trim();
  if (p === 'gemini') {
    const sys = messages.find(m => m.role === 'system');
    const contents = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
    const body = { contents, systemInstruction: sys ? { parts: [{ text: sys.content }] } : undefined };
    if (LS.grounding) body.tools = [{ google_search: {} }];
    return { url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body, parser: 'gemini' };
  }
  const body = { model, messages, stream: true };
  if (p === 'pollinations') return { url: 'https://text.pollinations.ai/openai', headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: `Bearer ${key}` } : {}) }, body, parser: 'openai' };
  if (p === 'openrouter') return { url: 'https://openrouter.ai/api/v1/chat/completions', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, 'HTTP-Referer': location.origin, 'X-Title': 'KatakCode' }, body, parser: 'openai' };
  return { url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body, parser: 'openai' };
}

async function streamAnswer(request, onToken) {
  const res = await fetch(request.url, { method: 'POST', headers: request.headers, body: JSON.stringify(request.body), signal: state.abortCtrl.signal });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { const t = await res.text(); detail = t.slice(0, 300); } catch { /* abaikan */ }
    throw new Error(detail);
  }
  if (!res.body) throw new Error('Browser tidak mendukung streaming');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let produced = 0;

  const handleDataLine = (data) => {
    if (!data || data === '[DONE]') return;
    let json;
    try { json = JSON.parse(data); } catch { return; }
    if (request.parser === 'openai') {
      const delta = json.choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta) { produced += delta.length; onToken(delta); }
    } else {
      const parts = json.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (typeof part.text === 'string' && part.text) { produced += part.text.length; onToken(part.text); }
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n');
    buffer = events.pop() || '';
    for (const raw of events) {
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      handleDataLine(line.slice(5).trim());
    }
  }
  if (produced === 0) {
    // fallback non-stream: parse jawaban utuh jika server membalas penuh (bukan SSE)
    const rest = buffer.trim();
    if (rest.startsWith('{')) {
      try {
        const json = JSON.parse(rest);
        const text = json.choices?.[0]?.message?.content || json.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
        if (text) onToken(text);
      } catch { /* abaikan */ }
    }
  }
}

async function sendMessage(text) {
  const content = text.trim();
  if (!content && !state.attachments.length) return;
  if (state.streaming) return;

  const provider = LS.provider;
  if (!providerReady(provider)) {
    showToast('Isi API key dulu di Pengaturan AI');
    openSettings();
    return;
  }

  // Sisipkan link yang dilampirkan ke pesan
  const linkContext = await readLinksFromMessage(content);

  state.messages.push({ role: 'user', content, attachments: [...state.attachments], project: state.project ? state.project.name : null, t: Date.now() });
  if (linkContext) {
    const last = state.messages[state.messages.length - 1];
    last.content = content + linkContext;
  }
  state.attachments = [];
  renderAttachRow();
  renderMessages();
  if (!state.currentId) await persistChat();

  const messages = buildMessages();
  const hasDocs = state.messages[state.messages.length - 1].attachments?.length || /^https?:\/\//m.test(content);
  const kind = hasDocs ? 'doc' : (CODE_HINT.test(content) ? 'code' : 'chat');

  state.streaming = true;
  state.abortCtrl = new AbortController();
  $('#btnSend').hidden = true;
  $('#btnStop').hidden = false;
  renderThinking(kind);

  let acc = '';
  const assistantMsg = { role: 'assistant', content: '', t: Date.now() };

  const paintAssistant = () => {
    removeThinking();
    let el = $('#messages .msg.assistant:last-child');
    if (!el || el.classList.contains('think-row')) {
      const tmp = document.createElement('div');
      tmp.className = 'msg assistant streaming';
      tmp.innerHTML = bubbleHTML(assistantMsg, state.messages.length);
      $('#messages').appendChild(tmp);
      el = tmp;
    }
    el.querySelector('.bubble').innerHTML = renderContent(assistantMsg.content) + '<span class="typing-caret"></span>';
    $('#messages').scrollTop = $('#messages').scrollHeight;
  };

  try {
    const request = buildRequest(messages);
    await streamAnswer(request, (token) => { acc += token; assistantMsg.content = acc; paintAssistant(); });
    assistantMsg.content = acc || '(kosong — coba lagi)';
    state.messages.push(assistantMsg);
    state.streaming = false;
    state.abortCtrl = null;
    $('#btnSend').hidden = false;
    $('#btnStop').hidden = true;
    renderMessages();
    await persistChat();
    speak(assistantMsg.content);
  } catch (err) {
    state.streaming = false;
    state.abortCtrl = null;
    $('#btnSend').hidden = false;
    $('#btnStop').hidden = true;
    if (err.name === 'AbortError') {
      assistantMsg.content = acc + (acc ? '\n\n*(dihentikan)*' : '');
      if (acc) { state.messages.push(assistantMsg); renderMessages(); await persistChat(); } else renderMessages();
      return;
    }
    const detail = String(err.message || err).replace(/<[^>]+>/g, ' ').slice(0, 260);
    showErrorBubble(`Kodok gagal menjawab.\n${detail}`);
  }
}

$('#btnSend').addEventListener('click', () => {
  const text = $('#input').value;
  $('#input').value = '';
  $('#input').style.height = 'auto';
  sendMessage(text);
});
$('#btnStop').addEventListener('click', () => { if (state.abortCtrl) state.abortCtrl.abort(); });
$('#input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#btnSend').click(); }
});
$('#input').addEventListener('input', function autosize() { this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 150) + 'px'; });

/* Kirim via klik gelembung balon salin/suara/retry */
$('#messages').addEventListener('click', (e) => {
  const copyCode = e.target.closest('[data-copy]');
  if (copyCode) {
    const pre = copyCode.closest('.codeblock')?.querySelector('pre');
    if (pre) navigator.clipboard?.writeText(pre.innerText).then(() => { copyCode.textContent = 'Tersalin'; setTimeout(() => (copyCode.textContent = 'Salin'), 1600); });
    return;
  }
  const copyMsg = e.target.closest('[data-copy-msg]');
  if (copyMsg) {
    const el = copyMsg.closest('.msg');
    navigator.clipboard?.writeText(el?.querySelector('.bubble')?.innerText || '').then(() => showToast('Jawaban disalin'));
    return;
  }
  const speakMsg = e.target.closest('[data-speak-msg]');
  if (speakMsg) {
    const el = speakMsg.closest('.msg');
    const text = el?.querySelector('.bubble')?.innerText || '';
    const was = speakEnabled; speakEnabled = true; speak(text); speakEnabled = was;
    return;
  }
  const retry = e.target.closest('[data-retry]');
  if (retry) { const lastUser = [...state.messages].reverse().find(m => m.role === 'user'); if (lastUser) sendMessage(lastUser.content.split('\n\n--- ISI LINK')[0]); return; }
});

/* Saran */
$$('#suggestRow .chip').forEach(chip => chip.addEventListener('click', () => {
  if (chip.id === 'emptyAddProject') return;
  $('#input').value = chip.textContent;
  $('#input').focus();
}));

/* ================= TOAST ================= */
let toastTimer;
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ================= SW & INIT ================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

$('#frogHero').innerHTML = frogJump(160);
(async function init() {
  await reloadChats();
  renderMessages();
  updateModelPill();
})();
