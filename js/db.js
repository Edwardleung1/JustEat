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
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipes
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  // add new document
  db.collection("recipes")
    .add(recipe)
    .catch((err) => console.log(err));

  // empty fields
  form.title.value = "";
  form.ingredients.value = "";
});

// delete a recipe
const recipeContainer = document.querySelector(".recipes");
recipeContainer.addEventListener("click", (evt) => {
  // console.log(evt);
  // check if user clicks on delete icon
  if (evt.target.tagName === "I") {
    // get id
    const id = evt.target.getAttribute("data-id");
    // delete id
    db.collection("recipes").doc(id).delete();
  }
});
