// ===================== THEME =====================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-icon').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Load saved theme
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';
})();

// ===================== NAVBAR SCROLL =====================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===================== SMOOTH SCROLL =====================
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ===================== MATRIX RAIN =====================
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let cols, drops;
  const chars = '01アイウエオカキクケコサシスセソタチツテトHECKERINTERNASIONAL{}[]<>/\\|@#$%';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 18);
    drops = Array(cols).fill(1);
  }

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? 'rgba(8,13,20,0.05)' : 'rgba(240,244,248,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00e5ff';
    ctx.font = '14px Share Tech Mono';
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 18, drops[i] * 18);
      if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 60);
})();

// ===================== COUNTER ANIMATION =====================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('id-ID');
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ===================== INTERSECTION OBSERVER =====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Counter
      if (entry.target.classList.contains('stat-num')) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
      // Hat cards staggered reveal
      if (entry.target.classList.contains('hat-card')) {
        observer.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .stat-num, .value-item, .hat-card').forEach(el => observer.observe(el));

// Stagger feature cards
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

// ===================== MEMBERS TICKER =====================
const fakeMembers = [
  { name: 'Moch-Iqbaalz', level: '🔴' }, { name: 'SecurityNinja_ID', level: '🟡' },
  { name: 'CyberWolf', level: '⚪' }, { name: 'ByteHunter', level: '🔵' },
  { name: 'PhantomCoder', level: '🔴' }, { name: 'NullPointer_X', level: '🟡' },
  { name: 'DarkScript_99', level: '🟢' }, { name: 'r00t_master', level: '⚪' },
  { name: 'NetReaper', level: '🔵' }, { name: 'CipherGhost', level: '🔴' },
  { name: 'ZeroDay_ID', level: '⚪' }, { name: 'PacketSniffer', level: '🟡' },
  { name: 'MalwareMike', level: '🟢' }, { name: 'ShadowByte', level: '🔵' },
  { name: 'Exploit_Kun', level: '🔴' }, { name: 'ReverseEngineer', level: '🟡' },
  { name: 'SQLSlayer_ID', level: '🟢' }, { name: 'KernelPanic', level: '⚪' },
  { name: 'BinaryBuron-121', level: '🔵' }, { name: 'VulnerabilityVixen', level: '🔴' },
];

function buildTicker() {
  const track = document.getElementById('ticker');
  if (!track) return;
  const doubled = [...fakeMembers, ...fakeMembers];
  track.innerHTML = doubled.map(m => `
    <div class="ticker-card">
      <div class="ticker-avatar">${m.name[0]}</div>
      <span>${m.level} ${m.name}</span>
      <span style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--accent);margin-left:4px;">AKTIF</span>
    </div>
  `).join('');
}
buildTicker();

// ===================== NOTIFICATIONS =====================
let notifCount = 3;
const notifSettings = { member: true, post: true, event: true, chat: true, sound: 'beep' };

function loadNotifSettings() {
  const saved = localStorage.getItem('notifSettings');
  if (saved) {
    const s = JSON.parse(saved);
    Object.assign(notifSettings, s);
    document.getElementById('notif-member').checked = s.member ?? true;
    document.getElementById('notif-post').checked = s.post ?? true;
    document.getElementById('notif-event').checked = s.event ?? true;
    document.getElementById('notif-chat').checked = s.chat ?? true;
    if (document.getElementById('notif-sound')) document.getElementById('notif-sound').value = s.sound ?? 'beep';
  }
}
loadNotifSettings();

function saveNotifSettings() {
  notifSettings.member = document.getElementById('notif-member').checked;
  notifSettings.post = document.getElementById('notif-post').checked;
  notifSettings.event = document.getElementById('notif-event').checked;
  notifSettings.chat = document.getElementById('notif-chat').checked;
  notifSettings.sound = document.getElementById('notif-sound').value;
  localStorage.setItem('notifSettings', JSON.stringify(notifSettings));
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('hidden');
}

function showNotif(title, body, type = 'member') {
  if (!notifSettings[type]) return;
  const container = document.getElementById('notif-container');
  const notif = document.createElement('div');
  notif.className = 'notif-item';
  notif.innerHTML = `
    <span class="notif-close" onclick="dismissNotif(this)">✕</span>
    <div class="notif-title">${title}</div>
    <div class="notif-body">${body}</div>
  `;
  container.appendChild(notif);
  notifCount++;
  const badge = document.getElementById('notif-badge');
  if (badge) badge.textContent = notifCount > 9 ? '9+' : notifCount;
  setTimeout(() => dismissNotif(null, notif), 5000);
}

function dismissNotif(btn, notifEl) {
  const el = notifEl || btn?.closest('.notif-item');
  if (!el) return;
  el.classList.add('exit');
  setTimeout(() => el.remove(), 350);
}

// Auto notifications
const notifQueue = [
  { title: '🔔 ANGGOTA BARU', body: 'ByteHunter baru saja bergabung!', type: 'member' },
  { title: '📝 POSTINGAN BARU', body: 'Tutorial Metasploit untuk Pemula oleh r00t_master', type: 'post' },
  { title: '🎤 EVENT MENDATANG', body: 'CTF Weekend dimulai dalam 3 hari!', type: 'event' },
  { title: '💬 CHAT AKTIF', body: 'Diskusi SQL Injection sedang ramai!', type: 'chat' },
  { title: '🔔 ANGGOTA BARU', body: 'ShadowByte telah bergabung dengan komunitas!', type: 'member' },
];

// Show initial notifications on load
setTimeout(() => showNotif('🔔 SELAMAT DATANG', 'Kamu mengunjungi website HECKER INTERNASIONAL!', 'member'), 1500);
setTimeout(() => showNotif('🎤 EVENT MENDATANG', 'CTF Weekend dimulai dalam 3 hari — Daftar sekarang!', 'event'), 3500);

// Random notifications
let qIdx = 0;
setInterval(() => {
  const n = notifQueue[qIdx % notifQueue.length];
  showNotif(n.title, n.body, n.type);
  qIdx++;
}, 15000);

// ===================== COMMUNITY CHAT =====================
const communityMessages = [
  { name: 'r00t_master', text: 'Ada yang bisa bantu debug script python untuk port scanning?', time: '5 menit lalu', level: '⚪' },
  { name: 'CyberWolf', text: 'Coba pakai scapy bro, lebih fleksibel dari socket biasa', time: '4 menit lalu', level: '🔴' },
  { name: 'ByteHunter', text: 'Ane baru selesai CTF kemarin, soalnya susah banget haha', time: '3 menit lalu', level: '🔵' },
  { name: 'ZeroDay_ID', text: 'Yang mau belajar OSINT, join webinar Jumat malam ya!', time: '2 menit lalu', level: '⚪' },
  { name: 'PhantomCoder', text: 'Ada yang punya resource buat belajar reverse engineering?', time: '1 menit lalu', level: '🔴' },
];

function renderCommunityMessages() {
  const container = document.getElementById('community-messages');
  container.innerHTML = communityMessages.slice(-20).map(m => `
    <div class="msg comm-msg">
      <div class="msg-name">${m.level} ${m.name}</div>
      <div class="msg-bubble">${m.text}</div>
      <span class="msg-time">${m.time}</span>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}
renderCommunityMessages();

const userNickname = 'Kamu';
function sendCommunityMsg() {
  const input = document.getElementById('comm-input');
  const text = input.value.trim();
  if (!text) return;
  communityMessages.push({ name: userNickname, text, time: 'Baru saja', level: '🟢' });
  input.value = '';
  renderCommunityMessages();
  if (notifSettings.chat) {
    setTimeout(() => {
      const replies = [
        { name: 'CyberWolf', text: `Good point! ${text.includes('?') ? 'Coba cek dokumentasi resminya ya.' : 'Setuju banget!'}`, level: '🔴' },
        { name: 'NullPointer_X', text: 'Mantap! Lanjutkan diskusinya 🔥', level: '🟡' },
        { name: 'r00t_master', text: 'Iya bener tuh, ane juga pernah ngalamin hal yang sama.', level: '⚪' },
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      communityMessages.push({ ...reply, time: 'Baru saja' });
      renderCommunityMessages();
    }, 2000 + Math.random() * 2000);
  }
}

// Update online count
setInterval(() => {
  const base = 247;
  const el = document.getElementById('online-count');
  if (el) el.textContent = (base + Math.floor(Math.random() * 20 - 10)) + ' online';
}, 10000);

// ===================== AI CHATBOT =====================
const knowledgeBase = {
  ctf: {
    keywords: ['ctf', 'capture', 'flag', 'kompetisi', 'lomba', 'tantangan', 'challenge'],
    response: `**CTF (Capture The Flag)** adalah kompetisi keamanan siber di mana peserta memecahkan tantangan untuk menemukan "flag" (string tersembunyi). \n\n🏆 **Kategori CTF Umum:**\n• Web Exploitation — SQL Injection, XSS, SSRF\n• Binary Exploitation — Buffer overflow, ROP chains\n• Cryptography — Dekripsi cipher & hash\n• Reverse Engineering — Analisis binary\n• OSINT — Open Source Intelligence\n\nKomunitas HECKER INTERNASIONAL rutin mengadakan CTF Weekend! Join grup kami untuk informasi event.`
  },
  tools: {
    keywords: ['tools', 'tool', 'aplikasi', 'software', 'program', 'pemula', 'beginner', 'alat'],
    response: `🔧 **Tools Hacking Etis untuk Pemula:**\n\n**Scanning & Reconnaissance:**\n• Nmap — Network scanner\n• Shodan — Search engine IoT\n• theHarvester — Email & domain OSINT\n\n**Web Testing:**\n• Burp Suite — Web proxy\n• OWASP ZAP — Vulnerability scanner\n• SQLmap — SQL injection testing\n\n**System:**\n• Kali Linux — OS untuk security testing\n• Metasploit — Exploitation framework\n• Wireshark — Packet analyzer\n\n⚠️ Gunakan hanya di environment yang kamu miliki izinnya ya!`
  },
  join: {
    keywords: ['bergabung', 'gabung', 'join', 'daftar', 'cara', 'masuk', 'ikut'],
    response: `✅ **Cara Bergabung HECKER INTERNASIONAL:**\n\n1. Klik tombol **"Buka di FB"** di navbar atas\n2. Login dengan akun Facebook kamu\n3. Klik **"+ Bergabung"** di halaman grup\n4. Tunggu persetujuan admin (biasanya < 24 jam)\n5. Perkenalkan dirimu di grup! 🎉\n\n📌 **Grup:** facebook.com/groups/208337657534538\n\nGratisss dan terbuka untuk semua orang yang tertarik dengan cyber security!`
  },
  sql: {
    keywords: ['sql', 'injection', 'sqli', 'database', 'query'],
    response: `**SQL Injection** adalah serangan yang menyisipkan perintah SQL berbahaya ke dalam input aplikasi web.\n\n**Contoh Sederhana:**\n\`' OR '1'='1\` — bypass login\n\`'; DROP TABLE users;--\` — menghapus tabel\n\n**Cara Mencegah:**\n• Gunakan Prepared Statements / Parameterized Queries\n• Input validation & sanitization\n• Least privilege principle untuk database user\n• Web Application Firewall (WAF)\n\n**Tools untuk Testing (dengan izin):**\n• SQLmap — automated SQL injection\n• Burp Suite — manual testing\n\n⚠️ Gunakan pengetahuan ini hanya untuk defensive purposes dan ethical hacking!`
  },
  osint: {
    keywords: ['osint', 'intelijen', 'informasi', 'terbuka', 'reconnaissance', 'recon', 'footprinting'],
    response: `**OSINT (Open Source Intelligence)** adalah pengumpulan informasi dari sumber publik yang tersedia secara legal.\n\n🔍 **Sumber OSINT:**\n• Media sosial (Facebook, Instagram, LinkedIn)\n• Domain & WHOIS records\n• Google Dorking\n• Shodan & Censys\n• Wayback Machine\n• Public records & databases\n\n🛠️ **Tools Populer:**\n• Maltego — visualisasi data\n• SpiderFoot — automated OSINT\n• Recon-ng — modular framework\n• theHarvester — email & subdomain\n\nOSINT digunakan secara luas oleh jurnalis, investigator, dan security professional!`
  },
  linux: {
    keywords: ['linux', 'kali', 'ubuntu', 'command', 'terminal', 'bash', 'shell'],
    response: `🐧 **Linux untuk Hacker Etis:**\n\n**Distribusi Populer:**\n• Kali Linux — Paling populer untuk pentesting\n• Parrot OS — Lebih ringan dari Kali\n• BlackArch — Tools paling lengkap\n\n**Command Dasar yang Wajib Tahu:**\n\`nmap -sV -sC target\` — scan service\n\`netstat -tulpn\` — lihat port aktif\n\`ps aux\` — lihat proses berjalan\n\`find / -perm -4000\` — cari SUID files\n\nTips: Coba install Kali Linux di VirtualBox dulu sebelum dual boot!`
  },
  default: {
    keywords: [],
    response: null
  }
};

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (key === 'default') continue;
    if (data.keywords.some(k => lower.includes(k))) {
      return data.response;
    }
  }
  // Fallback to Anthropic API
  return null;
}

async function askAI(userMessage) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `Kamu adalah HeckerBot, asisten AI untuk komunitas HECKER INTERNASIONAL — forum edukasi cyber security terbesar di Indonesia dengan 66.200+ anggota. 
Tugas kamu: menjawab pertanyaan tentang cyber security, hacking etis, CTF, tools, dan komunitas dengan bahasa Indonesia yang friendly dan informatif.
Format jawaban: gunakan emoji yang relevan, markdown bold untuk poin penting, singkat tapi komprehensif (max 300 kata).
PENTING: Selalu tekankan etika dan legalitas dalam cyber security. Jangan berikan instruksi untuk aktivitas ilegal.
Jika ditanya di luar topik cyber security, arahkan kembali ke topik komunitas.`,
        messages: [{ role: "user", content: userMessage }]
      })
    });
    const data = await response.json();
    return data.content?.[0]?.text || "Maaf, aku tidak bisa menjawab saat ini. Coba tanya lagi ya!";
  } catch (e) {
    return "⚠️ Koneksi ke AI terputus. Tapi aku tetap bisa menjawab berdasarkan knowledge base lokal!\n\nCoba tanya tentang: CTF, SQL Injection, Tools hacking, Linux, OSINT, atau cara bergabung dengan komunitas kami.";
  }
}

let isAITyping = false;

async function askBot(question) {
  if (isAITyping) return;
  const input = document.getElementById('ai-input');
  if (input) input.value = question;

  const container = document.getElementById('ai-messages');
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user-msg';
  userMsg.innerHTML = `<div class="msg-bubble">${question}</div><span class="msg-time">Baru saja</span>`;
  container.appendChild(userMsg);

  const typing = document.createElement('div');
  typing.className = 'msg ai-msg typing-bubble';
  typing.innerHTML = `<div class="msg-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;

  isAITyping = true;
  const btn = document.getElementById('send-ai-btn');
  if (btn) btn.disabled = true;

  // Check local knowledge base first
  const localResponse = getBotResponse(question);
  let finalResponse;

  if (localResponse) {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    finalResponse = localResponse;
  } else {
    finalResponse = await askAI(question);
  }

  typing.remove();
  isAITyping = false;
  if (btn) btn.disabled = false;
  if (input) input.value = '';

  // Render markdown-like formatting
  const formatted = finalResponse
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,229,255,0.1);padding:2px 6px;border-radius:4px;font-family:Share Tech Mono,monospace;font-size:12px">$1</code>')
    .replace(/\n/g, '<br>');

  const aiMsg = document.createElement('div');
  aiMsg.className = 'msg ai-msg';
  aiMsg.innerHTML = `
    <div class="msg-name">🤖 HeckerBot</div>
    <div class="msg-bubble">${formatted}</div>
    <span class="msg-time">Baru saja</span>
  `;
  container.appendChild(aiMsg);
  container.scrollTop = container.scrollHeight;

  // Show notification for chat
  if (notifSettings.chat) {
    showNotif('💬 HECKERBOT', 'HeckerBot telah menjawab pertanyaanmu!', 'chat');
  }
}

function askBotFromInput() {
  const input = document.getElementById('ai-input');
  const text = input.value.trim();
  if (!text || isAITyping) return;
  askBot(text);
}

function clearAIChat() {
  const container = document.getElementById('ai-messages');
  container.innerHTML = `
    <div class="msg ai-msg">
      <div class="msg-bubble">
        Chat dibersihkan! Aku <strong>HeckerBot</strong> 🤖 siap membantu kamu lagi. Tanya apa saja tentang cyber security!
      </div>
      <span class="msg-time">Sekarang</span>
    </div>
  `;
}

// ===================== FOOTER MEMBER COUNTER =====================
(function animateFooterCounter() {
  let count = 66200;
  setInterval(() => {
    count += Math.floor(Math.random() * 3);
    const el = document.getElementById('footer-count');
    if (el) el.textContent = count.toLocaleString('id-ID');
  }, 8000);
})();

// ===================== FAB BADGE =====================
// Hide fab badge after chat section visited
const chatObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    const badge = document.getElementById('fab-badge');
    if (badge) badge.style.display = 'none';
  }
}, { threshold: 0.3 });
const chatSection = document.getElementById('chat');
if (chatSection) chatObserver.observe(chatSection);
