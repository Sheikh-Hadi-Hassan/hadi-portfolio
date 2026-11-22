// Loaded only by the generated static HTML template, not by Next.js.
import { initializeFooter } from './footer-runtime.js';

const mount = () => initializeFooter();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
