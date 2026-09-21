/**
 * dom.js —— 极简 DOM 工具（不引入任何框架）
 */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** 由 HTML 字符串创建元素（取第一个元素节点） */
export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** 创建元素并设置属性/子节点 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };

/** 事件委托：在 root 上监听，选择器匹配时才触发 */
export function delegate(root, eventName, selector, handler) {
  const fn = (e) => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  };
  root.addEventListener(eventName, fn);
  return () => root.removeEventListener(eventName, fn);
}

/** 滚动到元素，考虑吸顶栏高度 */
export function scrollToEl(node, offset = 78) {
  if (!node) return;
  const y = node.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: prefersReduced() ? 'auto' : 'smooth' });
}

export const prefersReduced = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Toast ---------- */
let toastTimer = new WeakMap();

export function toast(message, kind = 'info', ms = 2200) {
  const host = document.getElementById('toast-host');
  if (!host) return;
  const node = h(`<div class="toast" role="status">${kind === 'ok' ? '✅' : kind === 'warn' ? '⚠️' : kind === 'bad' ? '❌' : 'ℹ️'} <span></span></div>`);
  node.querySelector('span').textContent = message;
  host.append(node);
  const t = setTimeout(() => {
    node.classList.add('is-out');
    setTimeout(() => node.remove(), 260);
  }, ms);
  toastTimer.set(node, t);
  // 最多同时显示 4 条
  while (host.children.length > 4) host.firstElementChild.remove();
}

/* ---------- 简单音效（Web Audio，无需音频文件） ---------- */
export function chime(kind = 'remind') {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = kind === 'ok' ? [660, 880] : kind === 'bad' ? [300, 220] : [784, 1046];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.16);
      g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + i * 0.16 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.16 + 0.28);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.16);
      o.stop(ctx.currentTime + i * 0.16 + 0.32);
    });
    setTimeout(() => ctx.close && ctx.close(), 900);
  } catch {
    /* 音效失败不影响功能 */
  }
}

/* ---------- 弹窗 ---------- */
const modalStack = [];

/**
 * 打开弹窗
 * @param {{title:string, body:string, footer?:string, wide?:boolean, onMount?:(modalEl:HTMLElement, close:Function)=>void, dismissable?:boolean}} opt
 * @returns {Function} close
 */
export function openModal(opt) {
  const host = document.getElementById('modal-host');
  const mask = h(`
    <div class="modal-mask" role="dialog" aria-modal="true" aria-label="${(opt.title || '对话框').replace(/"/g, '&quot;')}">
      <div class="modal${opt.wide ? ' wide' : ''}">
        <div class="modal-head">
          <h2></h2>
          <button type="button" class="iconbtn" data-close aria-label="关闭"></button>
        </div>
        <div class="modal-body"></div>
        ${opt.footer ? '<div class="modal-foot"></div>' : ''}
      </div>
    </div>`);
  mask.querySelector('.modal-head h2').textContent = opt.title || '';
  mask.querySelector('[data-close]').innerHTML =
    '<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></span>';
  mask.querySelector('.modal-body').innerHTML = opt.body || '';
  if (opt.footer) mask.querySelector('.modal-foot').innerHTML = opt.footer;

  const close = () => {
    const i = modalStack.indexOf(close);
    if (i >= 0) modalStack.splice(i, 1);
    mask.remove();
    if (!modalStack.length) document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => {
    if (e.key === 'Escape' && opt.dismissable !== false) close();
  };

  mask.addEventListener('click', (e) => {
    if (e.target === mask && opt.dismissable !== false) close();
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', onKey);
  host.append(mask);
  document.body.style.overflow = 'hidden';
  modalStack.push(close);

  // 恢复后关闭按钮的 SVG（上面已内联）
  requestAnimationFrame(() => {
    const focusable = mask.querySelector('button, [href], input, select, textarea');
    if (focusable) focusable.focus({ preventScroll: true });
  });

  if (opt.onMount) opt.onMount(mask, close);
  return close;
}

/** 确认框 */
export function confirmDialog(message, { title = '确认', okText = '确定', danger = false } = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    const close = openModal({
      title,
      body: `<p>${String(message).replace(/</g, '&lt;')}</p>`,
      footer: `<button type="button" class="btn" data-close>取消</button>
               <button type="button" class="btn ${danger ? 'btn-warn' : 'btn-primary'}" data-ok>${okText}</button>`,
      onMount(mask, closeFn) {
        mask.querySelector('[data-close]').addEventListener('click', () => done(false));
        mask.querySelector('[data-ok]').addEventListener('click', () => { done(true); closeFn(); });
        mask.addEventListener('click', (e) => { if (e.target === mask) done(false); });
      },
    });
    void close;
  });
}

/** date -> 人类可读的“还有多久” */
export function humanizeDue(ts, now = Date.now()) {
  const d = ts - now;
  const abs = Math.abs(d);
  const min = 60000, hour = 3600000, day = 86400000;
  const fmt = (v, unit) => `${v} ${unit}`;
  let text;
  if (abs < min) text = d <= 0 ? '现在' : '不到 1 分钟';
  else if (abs < hour) text = fmt(Math.round(abs / min), '分钟');
  else if (abs < day) text = fmt(Math.round(abs / hour), '小时');
  else text = fmt(Math.round(abs / day), '天');
  if (text === '现在') return '现在就该复习';
  return d <= 0 ? `已过期 ${text}` : `还要 ${text}`;
}

export function formatDateTime(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
