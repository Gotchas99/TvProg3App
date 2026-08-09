define([], function () {
  console.log("default loading");

  function init() {}
  function show() {}
  function hide() {}
  function finalize() {}
  init();
  console.log("default loaded");
  return {
    init: init,
    show: show,
    hide: hide,
    finalize: finalize
  };
});
