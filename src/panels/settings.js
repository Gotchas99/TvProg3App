define([], function () {
  console.log("settings loading");

  function init() {}
  function show() {}
  function hide() {}
  function finalize() {}
  init();
  console.log("settings loaded");
  return {
    init: init,
    show: show,
    hide: hide,
    finalize: finalize
  };
});
