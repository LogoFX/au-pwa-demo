/* eslint-global-variables serviceWorkerOption */

const staticCachePrefix = 'static';
const staticCacheName = `${staticCachePrefix}-${VERSION}`;

function log(message, ...args) {
    console.log('[SW] ' + message, ...args);
}

self.addEventListener('install', (event) => {
    log('Installing SW version:', VERSION);
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                log('Caching app shell');
                cache.addAll(serviceWorkerOption.assets);  // This comes from serviceworker-webpack-plugin.
            }),
    );
});

self.addEventListener('activate', (event) => {
    log('Cleaning old cache shell');
    event.waitUntil(
        caches.keys()
            .then((keylist) => Promise.all(
                keylist
                    .filter((key) => key !== staticCacheName && key.startsWith(staticCachePrefix))
                    .map((key) => caches.delete(key))
            )),
    );
});

self.addEventListener('fetch', (event) => {
  log('fetch', event);
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            }),
    );
});

self.addEventListener('sync', (event) => {
    log('Receive event with tag', event.tag);
    if (event.tag !== TTRSS_ACTIONS_STORAGE_NAME) {
        return;
    }

    log('Synching ttrss actions');

    event.waitUntil(
      syncActions()
    );
});


function syncActions() {
  //TODO: Add sync code here
 }
