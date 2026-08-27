// console.log("main loading");

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
  },
  urlArgs: "bust=" + new Date().getTime()
});

// eslint-disable-next-line no-unused-vars
function suppress_extension_notifications() {
  const ffMatch = navigator.userAgent.match(/Firefox\/(\d+)/);
  const ffVersion = ffMatch ? parseInt(ffMatch[1], 10) : 999;
  if (ffVersion === 999) return;
  // Suppress specific extension & browser feature policy noise in local dev
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    const origWarn = console.warn;
    const origError = console.error;

    console.warn = function (...args) {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Feature Policy: Skipping unsupported feature")
      )
        return;
      origWarn.apply(console, args);
    };

    console.error = function (...args) {
      if (typeof args[0] === "string" && args[0].includes("webclient-infield"))
        return;
      origError.apply(console, args);
    };
  }
}
// suppress_extension_notifications();

// Start the main app logic.
requirejs(["app", "polyfill"], function (_app, _polyfill) {
  // Detect Smart TV platforms (Tizen, webOS, Android TV, etc.)
  const isTV = /Tizen|Web0S|SmartTV|Maple|Appletv|CrKey|Vizio/i.test(
    navigator.userAgent
  );

  // If NOT a TV, add .is-pc to the <body> element
  if (!isTV) document.body.classList.add("is-pc");
});

// console.log("main loaded");
