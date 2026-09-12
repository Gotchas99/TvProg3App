// console.log("app loading");

define(["tizen", "panels/sidemenu"], function (_tizen, _sidemnu) {
  function initApp() {
    // Hantera kryssruta för att visa TV-layout även på PC
    const tvCheckbox = document.getElementById("showAsTvLabel");
    if (tvCheckbox)
      tvCheckbox.addEventListener("change", event => {
        if (event.target.checked) document.body.classList.remove("is-pc");
        else document.body.classList.add("is-pc");
      });
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
// console.log("app loaded");
