/**
 * Halo Hair Design - Client Interactions
 * Mobile navigation drawer & marquee pause controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const toggleBtn = document.getElementById('mobileNavToggle');
  const closeBtn = document.getElementById('mobileNavClose');
  const drawer = document.getElementById('mobileNavDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on any internal navigation link click
    const links = drawer.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Marquee Pause on Mobile Touch Hold
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  marqueeTracks.forEach(track => {
    track.addEventListener('touchstart', () => {
      track.classList.add('is-paused');
    }, { passive: true });

    track.addEventListener('touchend', () => {
      track.classList.remove('is-paused');
    }, { passive: true });

    track.addEventListener('touchcancel', () => {
      track.classList.remove('is-paused');
    }, { passive: true });
  });
});
