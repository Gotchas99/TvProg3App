define([], function () {
  // #region Observers
  const observers = {};

  function addObserver(topic, observer) {
    if (!(topic in observers)) observers.topic = [];
    // Add only if the exact reference is missing
    if (!observers.topic.includes(observer)) observers.topic.push(observer);
  }

  function removeObserver(topic, observer) {
    // Remove the observer if it exists
    const index = observers.topic.indexOf(observer);
    if (index !== -1) observers.topic.splice(index, 1);
  }
  
  function notifyObservers(topic, data) {
    if (topic in observers) observers.topic.forEach(observer => observer(data));
  }
  // #endregion

  let selectedProgram;

  function setSelectedProgram(aProgram) {
    selectedProgram = aProgram;
    notifyObservers("selectedProgram", selectedProgram);
  }
  function getSelectedProgram() {
    return selectedProgram;
  }

  function init() {
    // Initialize your application state here
    // console.log("Application state initialized");
  }
  init();
  return {
    addObserver: addObserver,
    removeObserver: removeObserver,
    setSelectedProgram: setSelectedProgram,
    getSelectedProgram: getSelectedProgram
  };
});
