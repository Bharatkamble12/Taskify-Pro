/* desktop-only.js
   Shared logic to block app pages on narrow screens (mobile)
   - Uses width-based detection (window.innerWidth)
   - Injects a full-screen overlay message and hides the app
   - Listens for resize/orientation to re-evaluate
*/
(function () {
  var MOBILE_MAX = 768; // px threshold for mobile

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  function showOverlay() {
    if (document.querySelector('.desktop-required-overlay')) return;
    try { document.body.setAttribute('data-desktop-blocked', 'true'); } catch (e) {}

    var overlay = document.createElement('div');
    overlay.className = 'desktop-required-overlay';

    var card = document.createElement('div');
    card.className = 'desktop-required-card';
    card.innerHTML = '<h2>Desktop Experience Required</h2>' +
      '<p>Taskify Pro is currently optimized for desktop screens.</p>' +
      '<p>Please access this application from a laptop or desktop device.</p>' +
      '<p>Alternatively, you may enable your browser\'s <strong>Desktop site</strong> (in settings) to preview the experience.</p>' +
      '<p class="muted">Mobile support is coming soon. Thank you for your understanding.</p>';

    overlay.appendChild(card);
    document.body.insertBefore(overlay, document.body.firstChild);
    document.body.style.overflow = 'hidden';
  }

  function removeOverlay() {
    var el = document.querySelector('.desktop-required-overlay');
    if (el) el.remove();
    try { document.body.removeAttribute('data-desktop-blocked'); } catch (e) {}
    document.body.style.overflow = '';
  }

  function evaluate() {
    if (isMobile()) showOverlay(); else removeOverlay();
  }

  // Run as soon as possible
  evaluate();

  // Re-evaluate on resize and orientation change
  window.addEventListener('resize', evaluate, { passive: true });
  window.addEventListener('orientationchange', function () { setTimeout(evaluate, 200); }, { passive: true });
})();
