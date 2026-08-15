// Section loader
//
// The page is split into one HTML fragment per menu section under sections/
// (see CLAUDE.md). This fetches each fragment and injects it into
// .main-content, in the same order as the sidebar nav (js/script.js indexes
// into document.querySelectorAll(".section") positionally, so this order
// must match .aside .nav's <li> order). js/script.js itself is only loaded
// afterwards, since it expects every .section element to already be in the
// DOM.
(function () {
  "use strict";

  var sectionNames = [
    "home",
    "about",
    "teaching",
    "certificate",
    "publication",
    "project",
    "contact",
  ];

  var mainContent = document.querySelector(".main-content");

  Promise.all(
    sectionNames.map(function (name) {
      return fetch("sections/" + name + ".html").then(function (response) {
        if (!response.ok) {
          throw new Error(
            "Failed to load sections/" + name + ".html (" + response.status + ")"
          );
        }
        return response.text();
      });
    })
  )
    .then(function (htmlFragments) {
      mainContent.innerHTML = htmlFragments.join("\n");

      var mainScript = document.createElement("script");
      mainScript.src = "js/script.js";
      document.body.appendChild(mainScript);
    })
    .catch(function (error) {
      console.error("Could not load page sections:", error);
    });
})();
