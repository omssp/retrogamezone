// sw.js 

// CACHE_NAMESPACE
// CacheStorage is shared between all sites under same domain.
// A namespace can prevent potential name conflicts and mis-deletion.
const CACHE_NAMESPACE = 'rgz-'

const PRECACHE = CACHE_NAMESPACE + 'precache-v1'
const PRECACHE_LIST = [
  './',
  './index2',
  './source/nes.js',
  './lib/gamelist.js',
  './source/omssp.js',
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/MaterialColorThief.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/dynamicaudio-min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/ppu.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/keyboard.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/main.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/utils.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/jquery.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/ui.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/nespad.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/fshelper.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/homepad.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/gamelist.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/mappers.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/nes.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/cpu.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/rom.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/jquery-3.2.1.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/swapplayers.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/audioUI.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/omssp.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/cookie.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/papu.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/util.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/slugify.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/skel.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/emu/emu.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/emu/save.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/gamepad.min.js",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/fullS.png",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/mute.png",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/unmute.png",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/power.png",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/pause.png",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/play.png",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/zoom-in.ico",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/zoom-out.ico",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/nespad.ico",
  "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/css/main.css",
]
const RUNTIME = CACHE_NAMESPACE + 'runtime-v1'
const expectedCaches = [PRECACHE, RUNTIME]


self.oninstall = (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
    .then(cache => cache.addAll(PRECACHE_LIST))
    .then(self.skipWaiting())
    .catch(err => console.log(err))
  )
}

self.onactivate = (event) => {
  // delete any cache not match expectedCaches for migration.
  // noticed that we delete by cache instead of by request here.
  // so we MUST filter out caches opened by this app firstly.
  // check out sw-precache or workbox-build for an better way.
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames
        .filter(cacheName => cacheName.startsWith(CACHE_NAMESPACE))
        .filter(cacheName => !expectedCaches.includes(cacheName))
        .map(cacheName => caches.delete(cacheName))
    ))
  )
}

self.onfetch = (event) => {
  // Fastest-while-revalidate 
  const cached = caches.match(event.request);
  const fixedUrl = `${event.request.url}?${Date.now()}`;
  const fetched = fetch(fixedUrl, {cache: "no-store"});
  const fetchedCopy = fetched.then(resp => resp.clone());
  console.log(`fetch ${fixedUrl}`)
  
  // Call respondWith() with whatever we get first.
  // If the fetch fails (e.g disconnected), wait for the cache.
  // If there’s nothing in cache, wait for the fetch. 
  // If neither yields a response, return offline pages.
  event.respondWith(
    Promise.race([fetched.catch(_ => cached), cached])
      .then(resp => resp || fetched)
      .catch(_ => caches.match('index.html'))
  );

  // Update the cache with the version we fetched (only for ok status)
  event.waitUntil(
    Promise.all([fetchedCopy, caches.open(RUNTIME)])
      .then(([response, cache]) => response.ok && cache.put(event.request, response))
      .catch(_ => {/* eat any errors */})
  );
}


