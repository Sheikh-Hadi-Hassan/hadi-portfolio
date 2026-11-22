const fs = require('node:fs');
const assert = require('node:assert/strict');

const read = path => fs.readFileSync(path, 'utf8');
const builder = read('scripts/build.py');
const head = read('src/components/head.html');
const css = read('src/styles/footer.css');
const html = read('src/components/footer.html');
const nextLayout = read('src/app/layout.jsx');
const nextWrapper = read('src/app/footer-motion.jsx');
const staticEntry = read('src/footer-static.js');
const runtime = read('src/footer-runtime.js');

assert.match(builder, /SRC\/'styles\/footer\.css'/);
assert.match(builder, /SRC\/'footer-runtime\.js'/);
assert.match(builder, /SRC\/'footer-static\.js'/);
assert.match(head, /<script type="module" src="\/footer-static\.js"><\/script>/);
assert.match(staticEntry, /import \{ initializeFooter \} from '\.\/footer-runtime\.js'/);
assert.match(nextWrapper, /import \{ initializeFooter \} from '\.\.\/footer-runtime'/);
assert.match(nextLayout, /<FooterMotion\/>/);
assert.ok(!nextLayout.includes('/footer-static.js'), 'static initializer must not run in Next.js');
assert.equal((html.match(/<footer class="v2ft-wrap hadi-footer"/g) || []).length, 1);
// Source design uses a deep-violet gradient and readable, scoped tokens.
assert.match(css, /footer\.v2ft-wrap\.hadi-footer\s*\{\s*--footer-ink: #f8f4ff;\s*--footer-muted: #d6c5ef;\s*--wordmark-ink: #e3c3ff;/);
assert.match(css, /linear-gradient\(120deg, #25074f 0%, #1b063c 55%, #23054b 100%\)/);
assert.match(css, /\.hadi-footer \.footer-wordmark-fallback\s*\{\s*color: var\(--wordmark-ink\)/);
assert.match(css, /\.hadi-footer a:focus-visible,/);
assert.match(runtime, /getPropertyValue\('--wordmark-ink'\)/);

// Conservative solid-color proxy for the lightest planned background glow.
// Real gradient contrast still requires rendered browser acceptance.
const luminance = (hex) => {
  const channels = hex.slice(1).match(/../g).map(s => parseInt(s, 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (a, b) => {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
for (const foreground of ['#f8f4ff', '#d6c5ef', '#e3c3ff']) {
  assert.ok(contrast(foreground, '#5c1aa0') >= 4.5,
    foreground + ' must meet AA against bright-violet reference');
}
assert.ok(contrast('#25074d', '#f2e9ff') >= 4.5, 'CTA contrast must meet AA');
assert.match(css, /@keyframes footer-dot-wave/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(css, /\.v2ft-wordmark\.is-ready \.footer-wordmark-fallback/);
assert.match(runtime, /document\.fonts\?\.ready/);
assert.match(runtime, /getImageData/);
assert.match(runtime, /pointermove/);
assert.match(runtime, /IntersectionObserver/);
console.log('PASS: static CSS, module loading, React parity and original footer design contract');
