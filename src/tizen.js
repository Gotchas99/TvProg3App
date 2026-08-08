/** @type {any} */
window.tizen = window.tizen || {};
const tizen = window.tizen;

// Register Tizen TV Remote Keys on app load
function initTizenKeys() {
  if (typeof tizen === "undefined" || tizen.tvinputdevice) {
    console.warn("no tizen");
    return;
  }
  try {
    // Register the Return/Back key so the app receives it
    tizen.tvinputdevice.registerKey("Return");
    tizen.tvinputdevice.registerKey("MediaPlay");
    tizen.tvinputdevice.registerKey("MediaPause");
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
