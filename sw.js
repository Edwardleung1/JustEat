// cache name
const staticCacheName = "site-static-v3";
const dynamicCacheName = "site-dynamic-v2";

// array of asset to cache
const assets = [
  // store request url
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://use.fontawesome.com/releases/v5.14.0/css/all.css",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "/pages/fallback.html",
];

// limit cache size function
const limitCacheSize = (name, size) => {
  // open whatever cache we put in
  caches.open(name).then((cache) => {
    // get keys of the cache
    cache.keys().then((keys) => {
      // we have an array of keys
      if (keys.length > size) {
        // delete first item in the cache array, and call function again.
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install service worker event (when file changes)
self.addEventListener("install", (evt) => {
  //console.log("service worker has been installed");
  // it doesn't finish the install event until this promise is resolved
  evt.waitUntil(
    // access caches api, it's asycn task
    caches.open(staticCacheName).then((cache) => {
      // add item to the cache using assets array
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate service worker event
self.addEventListener("activate", (evt) => {
  //console.log("service worker has been activated");
  // it doesn't finish the activate event until this promise is resolved
  evt.watchUntil(
    //asyn tasks that returns a promise
    caches.keys().then((keys) => {
      // it will get the keys and take it in the callback function
      // console.log(keys);
      return Promise.all(
        keys
          // take it an array of promises
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName) // if the key is not equal then goes to filter arr
          // delete the cache that is passed (old cache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (evt) => {
  if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
    // pause fetch event and respond with our custom event
    evt.respondWith(
      // see if a match with request
      caches
        .match(evt.request)
        .then((cacheRes) => {
          // return cache if we have it or the initial fetch request
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              // store dynamic cache
              return caches.open(dynamicCacheName).then((cache) => {
                // store the new response in the dynamic cache
                cache.put(evt.request.url, fetchRes.clone());
                // check if cache is over limit size
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
          // serve up the fallback page if the fetch fails
        })
        .catch(() => {
          // searches the string .html and returns an integer position
          if (evt.request.url.indexOf(".html") > -1) {
            // indeed a html page we are requesting
            return caches.match("/pages/fallback.html");
          }
        })
    );
  }
});
