define(["announcer"], function (announcerModule) {
  let selectedProgram;
  const announcer = new announcerModule.Announcer();

  function setSelectedProgram(aProgram) {
    if (aProgram === selectedProgram) return;
    selectedProgram = aProgram;
    announcer.announce(new SelectedProgramEvent());
  }
  function getSelectedProgram() {
    return selectedProgram;
  }

  class SelectedProgramEvent extends announcerModule.Announcement {}

  function init() {
    // Initialize your application state here
    // console.log("Application state initialized");
  }
  init();
  return {
    announcer: announcer,
    setSelectedProgram: setSelectedProgram,
    getSelectedProgram: getSelectedProgram,
    SelectedProgramEvent: SelectedProgramEvent
  };
});
