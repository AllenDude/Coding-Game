/* =========================================================
   main.js — boot the app.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Register the service worker for offline/installable use once this
// is hosted over http(s) (e.g. GitHub Pages). Most browsers refuse to
// register service workers on file:// origins, so this quietly does
// nothing when you're just opening index.html directly — that's fine,
// the app itself already works fully offline via localStorage.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('CodeQuest: service worker registration failed.', err);
    });
  });
}
