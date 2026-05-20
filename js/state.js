// ─────────────────────────────────────────────
//  STATE.JS — Estado reativo (qty + dados admin)
// ─────────────────────────────────────────────

const State = (() => {
  const QTY_KEY  = 'hagana_qty';
  const DATA_KEY = 'hagana_data';
  const ADMIN_KEY = 'hagana_admin_code';

  // ── HASH simples para o código admin ──
  // Código padrão: HAGANA2025  →  hash sha-like via djb2
  function hashCode(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
    return (h >>> 0).toString(16);
  }

  // Hash do código padrão "HAGANA2025"
  const STORED_HASH = hashCode('HAGANA2025');

  function checkCode(code) {
    return hashCode(code.toUpperCase()) === STORED_HASH;
  }

  // ── Dados (admin pode editar) ──
  function getData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return JSON.parse(JSON.stringify(DEFAULT_DATA)); // deep clone
  }

  function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  // ── Quantidades ──
  function getQty() {
    try {
      const raw = localStorage.getItem(QTY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }

  function saveQty(qty) {
    localStorage.setItem(QTY_KEY, JSON.stringify(qty));
  }

  function clearQty() {
    localStorage.removeItem(QTY_KEY);
  }

  return { getData, saveData, getQty, saveQty, clearQty, checkCode };
})();
