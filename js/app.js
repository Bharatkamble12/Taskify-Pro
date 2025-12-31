// Splash logo animation: move splash logo into navbar logo position (GPU-accelerated)
document.addEventListener('DOMContentLoaded', function () {
	const splash = document.getElementById('splash');
	const splashImg = document.getElementById('splash-logo-img');
	const navLogo = document.querySelector('.navbar .logo-img');

	if (!splash || !splashImg || !navLogo) return;

	const SHOW_MS = 1000;
	// read CSS variable for duration (fallback to 600ms)
	const computed = getComputedStyle(document.documentElement).getPropertyValue('--splash-anim-ms') || '600ms';
	const ANIM_MS = parseInt(computed, 10) || 600;

	function centerOf(rect) { return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; }

	setTimeout(() => {
		const startRect = splashImg.getBoundingClientRect();
		const endRect = navLogo.getBoundingClientRect();

		if (startRect.width === 0 || startRect.height === 0) {
			// nothing to animate
			cleanup();
			return;
		}

		const startCenter = centerOf(startRect);
		const endCenter = centerOf(endRect);
		const deltaX = Math.round(endCenter.x - startCenter.x);
		const deltaY = Math.round(endCenter.y - startCenter.y);
		const scale = Math.max(0.1, endRect.width / startRect.width);

		// prepare nav logo hidden state
		navLogo.style.transition = 'opacity 220ms ease';
		navLogo.style.visibility = 'hidden';
		navLogo.style.opacity = '0';

		// move splash image to fixed coordinates matching its visual start
		splashImg.style.position = 'fixed';
		splashImg.style.left = `${startRect.left}px`;
		splashImg.style.top = `${startRect.top}px`;
		splashImg.style.margin = '0';
		splashImg.style.zIndex = '10000';
		splashImg.style.willChange = 'transform, opacity';
		splashImg.style.transform = 'translate3d(0,0,0) scale(1)';

		// force a reflow so the browser picks up the fixed positioning
		// eslint-disable-next-line no-unused-expressions
		splashImg.getBoundingClientRect();

		// animate using translate3d for better performance
		requestAnimationFrame(() => {
			splashImg.style.transition = `transform ${ANIM_MS}ms cubic-bezier(.2,.9,.25,1), opacity 220ms ease`;
			splashImg.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`;
		});

		// After animation completes, reveal navbar logo and remove splash
		const onEnd = (e) => {
			if (e.propertyName !== 'transform') return;
			splashImg.removeEventListener('transitionend', onEnd);

			navLogo.style.visibility = 'visible';
			navLogo.style.opacity = '1';

			// fade out splash container and remove
			splash.style.opacity = '0';
			setTimeout(() => { if (splash && splash.parentNode) splash.parentNode.removeChild(splash); }, 240);
		};

		splashImg.addEventListener('transitionend', onEnd);

		// cleanup fallback: make sure we always remove splash after ANIM_MS + small buffer
		setTimeout(() => {
			if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
			navLogo.style.visibility = 'visible';
			navLogo.style.opacity = '1';
		}, SHOW_MS + ANIM_MS + 300);

		function cleanup() {
			if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
			navLogo.style.visibility = 'visible';
			navLogo.style.opacity = '1';
		}
	}, SHOW_MS);
});
