function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;

  // Trigger callback once the browser finishes loading the file
  script.onload = function () {
    if (callback) callback();
  };

  document.head.appendChild(script);
}

// load css
loadScript("src/styles.js", function () {
  const CSS_PATH = "src/assets/css/";
  const stylesheets = [
    "style.css"
    // 'components.css',
    // 'layout.css'
  ];
  stylesheets.forEach(file => window.injectCSS(CSS_PATH + file));
  //   console.log("Utils loaded, styles injected!");
});
