// give your cache a name
const cacheName = 'my-cache';

// put the static assets and routes you want to cache here
const filesToCache = [
  '/',
  '/about/',
  '/nl/',
  '/contact/',
  '/static/img/aaron-peters-profile-400x400.jpg',
  '/blog/',
  '/blog/ev-certificates-make-the-web-slow-and-unreliable/',
  '/blog/state-of-ssl-tls-certificates-in-nl/',
  '/blog/optimized-js-snippet-for-firebase-performance-monitoring/',
  '/blog/10-great-web-performance-blogs/',
  '/static/img/logo-pitchup.png',
  '/static/img/logo-vodafone-portrait.jpg',
  '/static/img/logo-tsr.png',
  '/static/img/logo-coxmediagroup.png',
  '/static/img/logo-hollandsnieuwe.png',
  '/static/img/logo-kruidvat.png',
  '/static/img/logo-snsbank.png',
  '/static/img/logo-fbto.png',
  '/static/img/logo-beslist-59h.png',
  '/static/img/Logo-Kruidvat-2019-Rood-SVG-RGB-zonder-outline.png'
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
  );
});

// the fetch event handler, to intercept requests and serve all 
// static assets from the cache
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
    .then(response => response ? response : fetch(e.request))
  )
});