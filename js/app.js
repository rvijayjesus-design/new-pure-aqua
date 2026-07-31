/* ==========================================================================
   Pure Aqua — app.js
   Lightweight localStorage data layer standing in for a real backend.
   Swap PureAqua.* functions for real API calls when Firebase/Phase 2 lands.
   ========================================================================== */

const PureAqua = (() => {
  const DB_KEY = 'pa_db_v1';
  const SESSION_KEY = 'pa_session_v1';

  const CAN_CATALOG = [
    { id: 'can20', name: '20L Purified Can', tamil: '20 லிட்டர் கேன்', price: 40, icon: 'drop' },
    { id: 'can20mineral', name: '20L Mineral Can', tamil: '20 லிட்டர் மினரல்', price: 55, icon: 'drop' },
    { id: 'can1', name: '1L Bottle (pack of 12)', tamil: '1 லிட்டர் பாட்டில் (12)', price: 90, icon: 'bottle' },
  ];

  function seedDb() {
    return { users: {}, orders: [], nextOrderId: 1001 };
  }

  function getDb() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const fresh = seedDb();
      localStorage.setItem(DB_KEY, JSON.stringify(fresh));
      return fresh;
    }
    try { return JSON.parse(raw); } catch (e) { return seedDb(); }
  }

  function saveDb(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

  function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function setSession(phone) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ phone }));
  }

  function clearSession() { localStorage.removeItem(SESSION_KEY); }

  function currentUser() {
    const session = getSession();
    if (!session) return null;
    const db = getDb();
    return db.users[session.phone] || null;
  }

  function register({ name, phone, password, address }) {
    const db = getDb();
    if (db.users[phone]) return { ok: false, error: 'இந்த எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது / Phone already registered' };
    db.users[phone] = { name, phone, password, address, wallet: 100, joined: Date.now() };
    saveDb(db);
    setSession(phone);
    return { ok: true };
  }

  function login({ phone, password }) {
    const db = getDb();
    const user = db.users[phone];
    if (!user || user.password !== password) {
      return { ok: false, error: 'எண் அல்லது கடவுச்சொல் தவறு / Invalid phone or password' };
    }
    setSession(phone);
    return { ok: true };
  }

  function logout() { clearSession(); }

  function updateProfile(fields) {
    const db = getDb();
    const session = getSession();
    if (!session) return { ok: false };
    Object.assign(db.users[session.phone], fields);
    saveDb(db);
    return { ok: true };
  }

  function placeOrder({ canId, qty, address, slot }) {
    const db = getDb();
    const session = getSession();
    if (!session) return { ok: false, error: 'Not logged in' };
    const user = db.users[session.phone];
    const can = CAN_CATALOG.find(c => c.id === canId);
    const total = can.price * qty;
    if (user.wallet < total) return { ok: false, error: 'போதிய இருப்பு இல்லை / Insufficient wallet balance' };

    user.wallet -= total;
    const order = {
      id: db.nextOrderId++,
      phone: session.phone,
      canId, canName: can.name, qty, total, address, slot,
      status: 'placed',
      placedAt: Date.now(),
    };
    db.orders.unshift(order);
    saveDb(db);
    return { ok: true, order };
  }

  function getOrders() {
    const db = getDb();
    const session = getSession();
    if (!session) return [];
    return db.orders.filter(o => o.phone === session.phone);
  }

  function progressOrder(orderId) {
    const db = getDb();
    const order = db.orders.find(o => o.id === orderId);
    if (!order) return;
    const stages = ['placed', 'confirmed', 'out_for_delivery', 'delivered'];
    const idx = stages.indexOf(order.status);
    if (idx < stages.length - 1 && Date.now() - order.placedAt > idx * 15000) {
      order.status = stages[idx + 1];
      saveDb(db);
    }
  }

  function addMoney(amount) {
    const db = getDb();
    const session = getSession();
    if (!session) return { ok: false };
    db.users[session.phone].wallet += amount;
    saveDb(db);
    return { ok: true, wallet: db.users[session.phone].wallet };
  }

  function requireAuth() {
    if (!currentUser()) window.location.href = 'login.html';
  }

  function redirectIfAuthed(target) {
    if (currentUser()) window.location.href = target;
  }

  return {
    CAN_CATALOG, register, login, logout, currentUser, updateProfile,
    placeOrder, getOrders, progressOrder, addMoney, requireAuth, redirectIfAuthed,
  };
})();

/* --- shared UI helpers --- */
function paToast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function paFormatMoney(n) { return '₹' + Number(n).toFixed(0); }

function paTimeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.bottom-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
  const nameEls = document.querySelectorAll('[data-user-name]');
  const user = PureAqua.currentUser();
  if (user) nameEls.forEach(el => el.textContent = user.name.split(' ')[0]);
});
