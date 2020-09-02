// get recipe collection in db, real-time listener
db.collection("recipes").onSnapshot((snapshot) => {
  // get the changes that happened since we last got a snapshot
  // console.log(snapshot.docChanges());
  // cycle through the array changes
  snapshot.docChanges().forEach((change) => {
    // log the change and the ingredient change
    console.log(change, change.doc.data(), change.doc.id);
  });
});
