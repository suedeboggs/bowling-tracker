/* Strike — Bowling Tracker · Shared Data Layer */
'use strict';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'strike_v1_games';
const DRAFT_KEY   = 'strike_v1_draft';

// ─── Database ─────────────────────────────────────────────────────────────────

const DB = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  save(game) {
    const games = this.getAll();
    const idx = games.findIndex(g => g.id === game.id);
    if (idx >= 0) {
      games[idx] = game;
    } else {
      games.unshift(game); // newest first
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  delete(id) {
    const games = this.getAll().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  getDraft() {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    } catch {
      return null;
    }
  },

  saveDraft(draft) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  },

  clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Service Worker Registration ──────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW registration failed — app still works, just won't be offline-first
    });
  });
}
