// cache name
const staticCacheName = "site-static";
// array of asset to cache
const assets = [
  // store request url
  ["/"],
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://use.fontawesome.com/releases/v5.14.0/css/all.css",
];

// Install service worker event (when file changes)
self.addEventListener("install", (evt) => {
  //console.log("service worker has been installed");
  // it doesn't finish the install event until this promise is resolved
  evt.waitUntil(
    // access caches api, it's asycn task
    caches.open("staticCacheName").then((cache) => {
      // add item to the cache using assets array
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate service worker event
self.addEventListener("activate", (evt) => {
  //console.log("service worker has been activated");
});

// fetch event
self.addEventListener("fetch", (evt) => {
  //console.log("fetch event", evt);
});
