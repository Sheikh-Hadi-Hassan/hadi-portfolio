const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

(async () => {
  const makeNode = () => ({
    events: {},
    addEventListener(type, fn) { this.events[type] = fn; },
    removeEventListener(type) { delete this.events[type]; }
  });
  const legal = makeNode(), close = makeNode(), copy = makeNode(), wrap = makeNode();
  copy.dataset = { footerCopy: 'hadi@intellignce.net' };
  const info = {
    ...makeNode(), open: false,
    querySelector: () => close,
    showModal() { this.open = true; },
    close() { this.open = false; },
    getBoundingClientRect: () => ({ left: 0, right: 200, top: 0, bottom: 200 })
  };
  const feedback = { textContent: '', classList: { add() {}, remove() {} } };
  const classes = new Set();
  let rendered = 0, disconnected = 0, written = '';
  const ctx = {
    clearRect() {}, beginPath() {}, fill() {}, setTransform() {}, fillText() {},
    arc() { rendered++; },
    measureText() { return { width: 750, actualBoundingBoxAscent: 80, actualBoundingBoxDescent: 20 }; },
    getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4).fill(255) }; }
  };
  const canvas = { getContext: () => ctx };
  wrap.clientWidth = 560;
  wrap.clientHeight = 110;
  wrap.querySelector = selector => selector === 'canvas' ? canvas : null;
  wrap.getBoundingClientRect = () => ({ left: 0, top: 0 });
  wrap.classList = { add(name) { classes.add(name); }, remove(name) { classes.delete(name); } };
  const footer = {
    querySelectorAll: selector => selector === '[data-footer-info-open]' ? [legal] : [],
    querySelector: selector => ({
      '[data-footer-copy]': copy,
      '.footer-copy-feedback': feedback,
      '[data-footer-wordmark]': wrap
    })[selector] || null
  };
  const document = {
    ...makeNode(), fonts: { ready: Promise.resolve() }, hidden: false,
    querySelector: selector => selector === '.hadi-footer' ? footer : null,
    getElementById: id => id === 'footer-info-dialog' ? info : null,
    createElement: () => canvas
  };
  const sandbox = {
    document, navigator: { clipboard: { async writeText(value) { written = value; } } },
    window: {
      devicePixelRatio: 1,
      matchMedia: query => ({ matches: query.includes('hover:hover') })
    },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    ResizeObserver: class { observe() {} disconnect() { disconnected++; } },
    IntersectionObserver: class { constructor(fn) { this.fn = fn; } observe() { this.fn([{ isIntersecting: true }]); } disconnect() { disconnected++; } },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {}, setTimeout: () => 1, clearTimeout() {},
    console
  };
  const source = fs.readFileSync('src/footer-runtime.js', 'utf8')
    .replace('export function initializeFooter', 'function initializeFooter');
  vm.runInNewContext(source + ';globalThis.startFooterTest = initializeFooter;', sandbox);
  const cleanup = sandbox.startFooterTest();
  const firstClick = legal.events.click;
  assert.equal(typeof firstClick, 'function', 'privacy control must bind a click handler');
  const duplicateCleanup = sandbox.startFooterTest();
  assert.equal(legal.events.click, firstClick, 'initializer must not install duplicate listeners');
  duplicateCleanup();
  firstClick();
  assert.equal(info.open, true);
  close.events.click();
  assert.equal(info.open, false);
  await copy.events.click();
  assert.equal(written, 'hadi@intellignce.net');
  assert.equal(feedback.textContent, 'Email copied');
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(rendered > 0, 'canvas wordmark should draw particles');
  assert.ok(classes.has('is-ready'), 'hide fallback only after successful canvas rendering');
  assert.equal(typeof wrap.events.pointermove, 'function');
  cleanup();
  assert.equal(legal.events.click, undefined);
  assert.equal(copy.events.click, undefined);
  assert.ok(!classes.has('is-ready'), 'fallback becomes available after cleanup');
  assert.equal(disconnected, 2, 'observers must disconnect');

  assert.ok(!fs.readFileSync('src/components/footer.html', 'utf8').includes('footer-project-dialog'));
  assert.ok(fs.readFileSync('src/components/footer.html', 'utf8').includes('data-lead-form'));
  console.log('PASS: shared footer controls, canvas particles, duplicate guard, cleanup and fallback');
})().catch(error => { console.error(error); process.exitCode = 1; });
