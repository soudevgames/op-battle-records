const cacheName = "DefaultCompany-op-bets-1.03";
const contentToCache = [
    "Build/WebGL.loader.js",
    "Build/WebGL.framework.js",
    "Build/WebGL.data",
    "Build/WebGL.wasm",
    "TemplateData/style.css"

];

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [cacheName, "UnityCache_DefaultCompany-op-bets"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      await deleteOldCaches();
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
     const cache = await caches.open(cacheName);
      let response = await cache.match(e.request);
      if (response) 
      { 
        console.log(`[Service Worker] Fetched resource from cache: ${e.request.url}`);
        return response; 
      }

      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      response = await fetch(e.request);

      if(e.request.url.includes("AssetBundles/WebGL"))
      {
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
      }
      
      return response;
    })());
});
