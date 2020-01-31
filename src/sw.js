/* eslint-global-variables serviceWorkerOption */

const DEFAULT_CATEGORY = 'unread';
const DYNAMIC_DB_NAME = 'aurss';
const DYNAMIC_DB_SCHEMA_VERSION = 1;
// In ms.
const REFRESH_INTERVAL = 30 * 60 * 1000;
const STATE_STORAGE_KEY = 'aurss-storage';
const TTRSS_ACTIONS_STORAGE_NAME = 'ttrss-actions';
// This is used by the ServiceWorker.
const VERSION = '1.0.0';

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
        syncTTRSSActions()
    );
});


function syncTTRSSActions() {
    const processedActionIds = [];

    return idb.openDB(DYNAMIC_DB_NAME, DYNAMIC_DB_SCHEMA_VERSION)
        .then((db) => {
            const tx = db.transaction(TTRSS_ACTIONS_STORAGE_NAME);
            return tx.store.getAll();
        })
        .then((actions) => {
            const fetchActions = actions.map((action) => {
                    return fetchFromAction(action).then(
                        () => processedActionIds.push(action.id),
                        () => log(`Failed to process ${action.id}`),
                    );
                },
            );
            return Promise.all(fetchActions);
        })
        .then(() => idb.openDB(DYNAMIC_DB_NAME, DYNAMIC_DB_SCHEMA_VERSION))
        .then((db) => {
            const deleteRequests = processedActionIds.map((id) => db.delete(TTRSS_ACTIONS_STORAGE_NAME, id));
            return Promise.all(deleteRequests);
        })
        .catch((error) => log('Failed to sync', error));
}

function fetchFromAction(action) {
    return fetch(action.url, action.payload);
}
