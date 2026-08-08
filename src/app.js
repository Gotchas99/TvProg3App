console.log("app loading");

define(["util", "nav"], function (_util, _nav) {
  function initApp() {
    // const scripts = ["util", "style", "focus", "nav", "tizen"];
    // scripts.forEach(fname => {
    //   loadScript("src/" + fname + ".js");
    // });
  }

  /**
 * @param {String} src - Text to log.
 */
  // eslint-disable-next-line no-unused-vars
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script is already present
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(undefined);
        return;
      }

      const script = document.createElement("script");
      script.src = src;

      // Dynamically created scripts defaults to async = true.
      // Set to false if load order between multiple dynamic scripts matters.
      script.async = true;

      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      document.head.appendChild(script);
    });
  }

  // Behövdes utan require.js
  // document.addEventListener("DOMContentLoaded", initApp);

  initApp();
});
console.log("app loaded");
