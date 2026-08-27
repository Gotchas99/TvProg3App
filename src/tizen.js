// console.log("tizen function loading");

define(["util"], function (util) {
  function registerTizenKeys() {
    const keysToRegister = [
      "MediaPlay",
      "MediaPause",
      "MediaPlayPause"
      // "MediaStop",
      // "MediaFastForward",
      // "MediaRewind",
      // "0",
      // "1",
      // "2",
      // "3",
      // "4",
      // "5",
      // "6",
      // "7",
      // "8",
      // "9"
    ];

    keysToRegister.forEach(function (keyName) {
      try {
        tizen.tvinputdevice.registerKey(keyName);
      } catch (err) {
        console.warn("Failed to register Tizen key:", keyName, err);
        util.logThis("Failed to register Tizen key: " + keyName + " - " + err);
      }
    });
    util.logThis("keys registered");
  }

  // Register Tizen TV Remote Keys on app load
  function initTizenKeys() {
    if (typeof window.tizen === "undefined" || window.tizen === null) {
      console.log("Not tizen");
      util.logThis("Not tizen");
      return;
    } else util.logThis("this is tizen");

    // const suppkeys = tizen.tvinputdevice.getSupportedKeys();
    // util.logThis(suppkeys);

    try {
      registerTizenKeys();
    } catch (e) {
      console.warn("Failed to register Tizen input keys:", e);
      util.logThis("Failed to register Tizen keys: ");
    }
    // util.logThis(getStringifiedSupportedKeys());
  }
  // Handle hardware Back / Return key on Tizen remote
  window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 10009: // Tizen Return / Back key
        console.log("Back key pressed");
        if (confirm("Exit application?"))
          tizen.application.getCurrentApplication().exit();
        break;
    }
  });

  /**
   * Tizen 4 (Chromium 56) Web Feature Matrix
   */
  const Tizen4Features = {
    // CSS Features
    cssGrid: window.CSS && CSS.supports("display", "grid"),
    cssFlexbox: window.CSS && CSS.supports("display", "flex"),
    cssVariables: window.CSS && CSS.supports("--custom-prop", "0"),
    cssSticky: window.CSS && CSS.supports("position", "sticky"),

    // JavaScript & Async APIs
    promises: typeof Promise !== "undefined",
    fetchApi: typeof fetch !== "undefined",
    asyncAwait: false, // Will test via eval below

    // HTML5 & Media APIs
    webSockets: typeof WebSocket !== "undefined",
    localStorage: (function () {
      try {
        localStorage.setItem("__test", "1");
        localStorage.removeItem("__test");
        return true;
      } catch (e) {
        return false;
      }
    })(),
    intersectionObserver: typeof IntersectionObserver !== "undefined",
    resizeObserver: typeof ResizeObserver !== "undefined", // Not native in Chromium 56

    // Video Codecs / Formats (HTMLVideoElement probing)
    h264: (function () {
      const v = document.createElement("video");
      return (
        v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.42E01E"') !== ""
      );
    })(),
    h265_hevc: (function () {
      const v = document.createElement("video");
      return (
        v.canPlayType &&
        v.canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"') !== ""
      );
    })()
  };

  // Test ES6 Async/Await syntax support safely
  try {
    eval("async function _test() {}");
    Tizen4Features.asyncAwait = true;
  } catch (e) {
    Tizen4Features.asyncAwait = false;
  }

  function getStringifiedSupportedKeys() {
    if (!window.tizen || !tizen.tvinputdevice) {
      return JSON.stringify(
        {
          error: "Tizen TV Input Device API unavailable (not running on TV)"
        },
        null,
        2
      );
    }

    try {
      var supportedKeys = tizen.tvinputdevice.getSupportedKeys();

      // Map objects to simple plain JS objects for clean JSON stringification
      var keyList = supportedKeys.map(function (key) {
        return {
          name: key.name,
          code: key.code
        };
      });

      return JSON.stringify(
        {
          totalKeys: keyList.length,
          keys: keyList
        },
        null,
        2
      );
    } catch (error) {
      return JSON.stringify(
        {
          error: error.name || "UnknownError",
          message: error.message
        },
        null,
        2
      );
    }
  }

  // console.log("Tizen 4 Feature Capabilities: " + Tizen4Features);
  console.log("Tizen 4 Feature Capabilities:", Tizen4Features);

  initTizenKeys();
});

// console.log("tizen function loaded");
