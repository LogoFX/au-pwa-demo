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

    function shouldHandleFetch (event, opts) {
      var request            = event.request;
      var url                = new URL(request.url);
      var criteria           = {
        matchesPathPattern: !!(opts.cachePathPattern.exec(url.pathname)),
        isGETRequest      : request.method === 'GET',
        isFromMyOrigin    : url.origin === self.location.origin
      };
    
      // Create a new array with just the keys from criteria that have
      // failing (i.e. false) values.
      var failingCriteria    = Object.keys(criteria)
        .filter(criteriaKey => !criteria[criteriaKey]);
    
      // If that failing array has any length, one or more tests failed.
      return !failingCriteria.length;      
    }
  

    function onFetch (event, opts) {
      // 1. Determine what kind of asset this is… (above).
      if (resourceType === 'content') {
        // Use a network-first strategy.
        event.respondWith(
          fetch(request)
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => fetchFromCache(event))
            .catch(() => offlineResponse(opts))
        );
      } else {
        // Use a cache-first strategy.
        event.respondWith(
          fetchFromCache(event)
            .catch(() => fetch(request))
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => offlineResponse(resourceType, opts))
          );
      }
    }

    shouldHandleFetch(event, config)
      .then(onFetch(event, config))
      .catch(err => {
        log(err);        
      });
        
    /*
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
    */
});

function addToCache (cacheKey, request, response) {
  if (response.ok) {
    var copy = response.clone();
    caches.open(cacheKey).then( cache => {
      cache.put(request, copy);
    });
    return response;
  }
}


function fetchFromCache (event) {
  return caches.match(event.request).then(response => {
    if (!response) {
      // A synchronous error that will kick off the catch handler
      throw Error('${event.request.url} not found in cache');
    }
    return response;
  });
}


function offlineResponse (resourceType, opts) {
  if (resourceType === 'image') {
    return new Response(opts.offlineImage,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  } else if (resourceType === 'content') {
    return caches.match(opts.offlinePage);
  }
  return undefined;
}

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
