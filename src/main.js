console.log("main loading");

requirejs.config({
  //By default load any module IDs from js/lib
  // baseUrl: "js/lib",
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  // paths: {
  //   app: "../app"
  // }
  shim: {
    "3rd_party/spatial_navigation": {
      exports: "SpatialNavigation"
    }
  }
});

// require(["3rd_party/domReady"], function (domReady) {
//   domReady(function () {
//     //This function is called once the DOM is ready.
//     //It will be safe to query the DOM and manipulate
//     //DOM nodes in this function.
//   });
// });

// Start the main app logic.
requirejs(["app"], function (_app) {});

console.log("main loaded");
