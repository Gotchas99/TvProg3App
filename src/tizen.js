/** @type {any} */
window.tizen = window.tizen || {};
const tizen = window.tizen;

function registerTizenKeys() {
  const keysToRegister = [
    "MediaPlay",
    "MediaPause",
    "MediaStop",
    "MediaFastForward",
    "MediaRewind",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
  ];

  keysToRegister.forEach(function (keyName) {
    try {
      tizen.tvinputdevice.registerKey(keyName);
    } catch (err) {
      console.warn("Failed to register Tizen key:", keyName, err);
    }
  });
}

// Register Tizen TV Remote Keys on app load
function initTizenKeys() {
  if (typeof tizen === "undefined" || tizen.tvinputdevice) {
    console.warn("no tizen");
    return;
  }
  try {
    registerTizenKeys();
  } catch (e) {
    console.warn("Failed to register Tizen input keys:", e);
  }
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
initTizenKeys();

// console.log("tizen function loaded");
