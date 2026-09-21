/**
 * smoke-dom.mjs —— 极简 DOM 垫片（只服务 scripts/smoke-test.mjs）
 *
 * 目的：在 Node 里把 js/app.js 真正跑一遍，验证
 *   "加载内容 → 建立索引 → 渲染三个版块" 这条链路没有运行时错误。
 *
 * 它**不是**完整 DOM 实现，只实现本项目用到的那部分 API。
 * 真正的浏览器行为（样式、动画、音频）仍然需要人工在浏览器里看。
 */

class ClassList {
  constructor(el) { this.el = el; this.set = new Set(); }
  _sync(value) { this.set = new Set(String(value || '').split(/\s+/).filter(Boolean)); }
  add(...cs) { cs.forEach((c) => this.set.add(c)); this.el._classValue = [...this.set].join(' '); }
  remove(...cs) { cs.forEach((c) => this.set.delete(c)); this.el._classValue = [...this.set].join(' '); }
  contains(c) { return this.set.has(c); }
  toggle(c, force) {
    const on = force === undefined ? !this.set.has(c) : Boolean(force);
    if (on) this.set.add(c); else this.set.delete(c);
    this.el._classValue = [...this.set].join(' ');
    return on;
  }
  get value() { return [...this.set].join(' '); }
}

class Node {
  constructor(tag) {
    this.tagName = String(tag || '').toUpperCase();
    this.nodeType = 1;
    this.children = [];
    this.childNodes = this.children;
    this.parentNode = null;
    this.attributes = new Map();
    this.dataset = {};
    this.style = {};
    this._classValue = '';
    this._html = '';
    this._text = '';
    this.classList = new ClassList(this);
    this._listeners = new Map();
  }

  get className() { return this._classValue; }
  set className(v) { this._classValue = String(v || ''); this.classList._sync(v); }

  get outerHTML() { return this.outerHTMLValue(); }
  set outerHTML(html) {
    // 简化实现：就地替换内容（真实浏览器是替换节点本身，对本项目用途足够）
    this._html = String(html == null ? '' : html);
    this.children = parseChildren(this._html, this);
  }
  get innerHTML() { return this._html; }
  set innerHTML(v) {
    this._html = String(v == null ? '' : v);
    if (this.tagName === 'TEMPLATE') {
      this.content = new Node('#fragment');
      this.content.children = parseChildren(this._html, this.content);
      this.children = [];
    } else {
      this.children = parseChildren(this._html, this);
    }
  }
  get textContent() { return this._text; }
  set textContent(v) { this._text = String(v == null ? '' : v); this._html = this._text; }
  get firstChild() { return this.children[0] || null; }
  get firstElementChild() { return this.children[0] || null; }
  get lastElementChild() { return this.children[this.children.length - 1] || null; }

  outerHTMLValue() {
    const attrs = [...this.attributes.entries()].map(([k, v]) => ` ${k}="${v}"`).join('');
    return `<${this.tagName.toLowerCase()}${attrs}>${this._html || this._text}</${this.tagName.toLowerCase()}>`;
  }

  append(...nodes) { nodes.forEach((n) => this.appendChild(n)); }
  appendChild(n) {
    const node = typeof n === 'string' ? { nodeType: 3, textContent: n, parentNode: this } : n;
    node.parentNode = this;
    this.children.push(node);
    return node;
  }
  removeChild(n) { this.children = this.children.filter((c) => c !== n); return n; }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  setAttribute(k, v) {
    this.attributes.set(k, String(v));
    if (k === 'class') this.className = v;
    if (k.startsWith('data-')) {
      const key = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      this.dataset[key] = String(v);
    }
  }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  removeAttribute(k) { this.attributes.delete(k); }
  hasAttribute(k) { return this.attributes.has(k); }
  addEventListener(t, fn) { if (!this._listeners.has(t)) this._listeners.set(t, []); this._listeners.get(t).push(fn); }
  removeEventListener(t, fn) {
    const list = this._listeners.get(t) || [];
    this._listeners.set(t, list.filter((f) => f !== fn));
  }
  dispatch(type, event = {}) {
    const ev = { type, target: this, preventDefault() {}, stopPropagation() {}, ...event };
    for (const fn of this._listeners.get(type) || []) fn(ev);
    // 冒泡（只用于把点击送到 main 的委托监听上）
    if (this.parentNode && this.parentNode.dispatch) this.parentNode.dispatch(type, ev);
    return ev;
  }
  focus() {}
  click() { this.dispatch('click', {}); }
  closest(sel) {
    let node = this;
    while (node && node.nodeType === 1) {
      if (node.matches && node.matches(sel)) return node;
      node = node.parentNode;
    }
    return null;
  }
  matches(sel) {
    return String(sel).split(',').some((s) => matchSimple(this, s.trim()));
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  querySelectorAll(sel) {
    const out = [];
    const walk = (node) => {
      for (const c of node.children) {
        if (c.nodeType !== 1) continue;
        if (c.matches(sel)) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  getBoundingClientRect() { return { top: 0, left: 0, width: 800, height: 600 }; }
  get offsetWidth() { return 800; }
  get selectedOptions() { return this.children.filter((c) => c.selected); }
  setSelectionRange() {}
  scrollIntoView() {}

  /** 反射属性：hidden / disabled / checked / value / selected（本项目用到了这些） */
  get hidden() { return this.attributes.has('hidden'); }
  set hidden(v) { if (v) this.attributes.set('hidden', ''); else this.attributes.delete('hidden'); }
  get disabled() { return this.attributes.has('disabled'); }
  set disabled(v) { if (v) this.attributes.set('disabled', ''); else this.attributes.delete('disabled'); }
  get checked() { return this.attributes.has('checked'); }
  set checked(v) { if (v) this.attributes.set('checked', ''); else this.attributes.delete('checked'); }
  get selected() { return this.attributes.has('selected'); }
  set selected(v) { if (v) this.attributes.set('selected', ''); else this.attributes.delete('selected'); }
  get value() { return this._value != null ? this._value : (this.attributes.get('value') ?? ''); }
  set value(v) { this._value = String(v == null ? '' : v); }
  get files() { return this._files || []; }
  contains(node) {
    let cur = node;
    while (cur) { if (cur === this) return true; cur = cur.parentNode; }
    return false;
  }
  /** 汇总自身与后代的可见文本，便于断言"页面上真的出现了这段文字" */
  get deepText() {
    let out = this._text || '';
    for (const c of this.children) {
      out += c.nodeType === 1 ? ` ${c.deepText || c._text || ''}` : ` ${c.textContent || ''}`;
    }
    return out.replace(/\s+/g, ' ').trim();
  }
}

/** 只支持本项目用到的选择器：#id .class tag [attr] [attr="v"] */
function matchSimple(el, sel) {
  if (!sel) return false;
  let s = sel;
  const attrs = [];
  s = s.replace(/\[([^\]]+)\]/g, (_, inner) => { attrs.push(inner); return ''; });
  const classes = [];
  s = s.replace(/\.([A-Za-z0-9_-]+)/g, (_, c) => { classes.push(c); return ''; });
  const idMatch = /#([A-Za-z0-9_-]+)/.exec(s);
  const tag = s.replace(/#[A-Za-z0-9_-]+/g, '').trim().toLowerCase();

  if (idMatch && el.getAttribute('id') !== idMatch[1]) return false;
  if (tag && tag !== '*' && el.tagName.toLowerCase() !== tag) return false;
  for (const c of classes) if (!el.classList.contains(c)) return false;
  for (const a of attrs) {
    const m = /^([A-Za-z0-9_-]+)(?:=["']?([^"']*)["']?)?$/.exec(a);
    if (!m) continue;
    if (!el.hasAttribute(m[1])) return false;
    if (m[2] != null && m[2] !== '' && el.getAttribute(m[1]) !== m[2]) return false;
  }
  return Boolean(idMatch || tag || classes.length || attrs.length);
}

class Document extends Node {
  constructor() {
    super('#document');
    this.documentElement = new Node('html');
    this.documentElement.setAttribute('data-theme', 'light');
    this.body = new Node('body');
    this.documentElement.appendChild(this.body);
    this.appendChild(this.documentElement);
    this.visibilityState = 'visible';
    this._byId = new Map();
  }
  createElement(tag) {
    const el = new Node(tag);
    // <template> 需要 content 属性（fragment 容器）
    if (el.tagName === 'TEMPLATE') el.content = new Node('#fragment');
    return el;
  }
  createTextNode(t) { const n = new Node('#text'); n.nodeType = 3; n.textContent = t; return n; }
  createDocumentFragment() { return new Node('#fragment'); }
  getElementById(id) {
    if (this._byId.has(id)) return this._byId.get(id);
    const found = this.querySelector(`#${id}`);
    if (found) this._byId.set(id, found);
    return found || null;
  }
  registerIds() {
    this._byId.clear();
    this._byId.set('main', this._main);
    const walk = (node) => {
      for (const c of node.children) {
        if (!c || c.nodeType !== 1 || typeof c.getAttribute !== 'function') continue;
        const id = c.getAttribute('id');
        if (id) this._byId.set(id, c);
        walk(c);
      }
    };
    walk(this);
  }
  addEventListener(t, fn) { super.addEventListener(t, fn); }
}

/** 用 HTML 字符串填充一个容器的 innerHTML 并建立索引（够本项目用） */
export function parseInto(container, html) {
  container.innerHTML = html;
  container.children = parseChildren(String(html), container);
  return container;
}

/**
 * 极简 HTML 解析：只切分标签、属性、文本，够本项目渲染出的标记用。
 * 顶层节点会挂到 parent.children 上，并把 parentNode 指向 parent，
 * 这样事件冒泡链和 closest() 才是通的。
 */
export function parseChildren(html, parent) {
  const nodes = [];
  const stack = [{
    node: {
      children: nodes,
      nodeType: 1,
      appendChild(n) { n.parentNode = parent; this.children.push(n); return n; },
    },
    tag: null,
  }];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\/([A-Za-z0-9-]+)\s*>|<([A-Za-z0-9-]+)((?:\s+[^>]*?)?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const [full, closeTag, openTag, attrStr, selfClose, text] = m;
    if (full.startsWith('<!--') || full.startsWith('<![')) continue;
    if (closeTag) {
      for (let i = stack.length - 1; i > 0; i -= 1) {
        if (stack[i].tag === closeTag.toLowerCase()) { stack.length = i; break; }
      }
      continue;
    }
    if (openTag) {
      const tag = openTag.toLowerCase();
      if (!selfClose && tag === 'br') continue;
      const el = new Node(tag);
      applyAttrs(el, attrStr || '');
      const top = stack[stack.length - 1];
      top.node.appendChild(el);
      if (!selfClose && !VOID.has(tag)) stack.push({ node: el, tag });
      continue;
    }
    if (text != null) {
      const t = text.trim();
      if (!t) continue;
      const top = stack[stack.length - 1];
      const node = { nodeType: 3, textContent: decode(t), parentNode: top.node };
      top.node.children.push(node);
      if (!top.node._textValue) top.node._textValue = '';
      top.node._textValue += ' ' + node.textContent;
    }
  }
  parent.children = nodes;
  return nodes;
}

const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr']);

function applyAttrs(el, str) {
  const re = /([A-Za-z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(str))) {
    const name = m[1];
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    el.setAttribute(name, decode(value));
  }
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };
const decode = (s) => String(s).replace(/&(#?\w+);/g, (x, k) => ENT[k] ?? x);

/** 安装全局环境 */
export function installDom() {
  const doc = new Document();

  // index.html 的骨架
  doc.body.innerHTML = '';
  const topbar = new Node('header');
  topbar.setAttribute('class', 'topbar');
  topbar.innerHTML = `
    <div class="brand"><span class="brand-mark">∫</span></div>
    <nav class="mainnav" id="mainnav">
      <button type="button" class="navbtn" data-view="practice"><span data-icon="target"></span><span>组题组</span></button>
      <button type="button" class="navbtn" data-view="notebook"><span data-icon="notebook"></span><span>错题本</span><span class="badge" id="nav-notebook-badge" hidden>0</span></button>
      <button type="button" class="navbtn" data-view="textbook"><span data-icon="book"></span><span>教材定理定义</span></button>
    </nav>
    <div class="topbar-actions">
      <button type="button" class="iconbtn" id="btn-remind"><span data-icon="bell"></span><span class="badge" id="bell-badge" hidden>0</span></button>
      <button type="button" class="iconbtn" id="btn-favorites"><span data-icon="star"></span></button>
      <button type="button" class="iconbtn" id="btn-data"><span data-icon="settings"></span></button>
      <button type="button" class="iconbtn" id="btn-theme"><span data-icon="moon"></span></button>
    </div>`;
  // 注意：innerHTML 的解析补丁在下面几行才安装，这里显式解析一次，
  // 否则顶栏里的 #mainnav / #btn-* 不会进入 id 索引。
  topbar.children = parseChildren(topbar.innerHTML, topbar);
  doc.body.appendChild(topbar);

  const main = new Node('main');
  main.setAttribute('id', 'main');
  main.setAttribute('class', 'app-main');
  main.parentNode = doc.body; // 接上冒泡链：main -> body -> document
  doc.body.children.push(main);
  doc._main = main;

  const toastHost = new Node('div');
  toastHost.setAttribute('id', 'toast-host');
  toastHost.setAttribute('class', 'toast-host');
  doc.body.appendChild(toastHost);

  const modalHost = new Node('div');
  modalHost.setAttribute('id', 'modal-host');
  modalHost.setAttribute('class', 'modal-host');
  doc.body.appendChild(modalHost);

  doc.registerIds();

  // innerHTML 赋值后需要重建子节点树 —— 给 Node 打补丁
  const origSetter = Object.getOwnPropertyDescriptor(Node.prototype, 'innerHTML');
  Object.defineProperty(Node.prototype, 'innerHTML', {
    get() { return origSetter.get.call(this); },
    set(v) {
      origSetter.set.call(this, v);
      this.children = parseChildren(String(v ?? ''), this);
    },
  });

  const win = {
    document: doc,
    location: { hash: '', href: 'http://localhost/', replace() {}, assign() {} },
    history: { replaceState(_a, _b, url) { if (url) win.location.hash = url; } },
    localStorage: makeStorage(),
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    addEventListener() {},
    removeEventListener() {},
    scrollTo() {},
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: (fn, ms) => setInterval(fn, ms),
    clearInterval: (id) => clearInterval(id),
    requestAnimationFrame: (fn) => setTimeout(() => fn(0), 0),
    cancelAnimationFrame: (id) => clearTimeout(id),
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    URL: { createObjectURL: () => 'blob:mock', revokeObjectURL() {} },
    Blob: class { constructor(parts) { this.parts = parts; } },
    MutationObserver: class { observe() {} disconnect() {} },
    AudioContext: undefined,
    console,
  };
  win.window = win;
  win.self = win;
  win.globalThis = win;

  globalThis.window = win;
  globalThis.document = doc;
  globalThis.location = win.location;
  globalThis.history = win.history;
  globalThis.localStorage = win.localStorage;
  globalThis.matchMedia = win.matchMedia;
  globalThis.requestAnimationFrame = win.requestAnimationFrame;
  globalThis.MutationObserver = win.MutationObserver;
  globalThis.Blob = win.Blob;
  globalThis.URL = win.URL;
  globalThis.addEventListener = win.addEventListener;
  globalThis.getComputedStyle = win.getComputedStyle;

  return { doc, win };
}

function makeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
    get length() { return map.size; },
    key: (i) => [...map.keys()][i],
    _dump: () => Object.fromEntries(map),
  };
}

export { Node, Document };
