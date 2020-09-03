// See if it exists in the navigator object
if ("serviceWorker" in navigator) {
  // promise asynchronous
  // register a service worker
  navigator.serviceWorker
    .register("/sw.js")
    // async task (tasks some time) and returns a promise
    // execute when the promise is resolved
    .then((reg) => console.log("service worker registered", reg))
    // catch any errors if it is rejected
    .catch((err) => console.log("service worker not registered", err));
}
