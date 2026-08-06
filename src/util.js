console.log("util loading");

define([], function () {
  const el = document.getElementById("log");
  if (!(el instanceof HTMLTextAreaElement)) {
    console.error("LogEl not found");
    return;
  }
  const logEl = el;
  logEl.value = "AppLog\n------\n";

  /**
   * @param {String} txt - Text to log.
   */
  function logThis(txt) {
    if (logEl) logEl.value += txt + "\n";
    else console.error("LogEl not found");
  }

  return {
    logThis
  };
});

console.log("util loaded");
