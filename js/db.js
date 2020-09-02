// offline data
db.enablePersistence().catch((err) => {
  if (err.code == "failed-precondition") {
    // probably multiple tabs opened at once
    console.log("persistence failed");
  } else if (err.code == "unimplemented") {
    // lack of browser support
    console.log("persistence is not available");
  }
});

// get recipe collection in db, real-time listener
db.collection("recipes").onSnapshot((snapshot) => {
  // get the changes that happened since we last got a snapshot
  // console.log(snapshot.docChanges());
  // cycle through the array changes
  snapshot.docChanges().forEach((change) => {
    // log the change and the ingredient change
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      // add the document data to the web page
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      // remove the document data from the web page
    }
  });
});
