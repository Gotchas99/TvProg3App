define([
  "3rd_party/spatial_navigation",
  "repo/repo",
  "AppState",
  "util"
], function (SpatialNavigation, repo, AppState, util) {
  // console.log("show_details loading");
  let program = [];

  function handleProgramSelect(targetCard) {
    const program_id = targetCard.getAttribute("data-id");
    const name = targetCard.querySelector(".card-name").textContent;

    console.log("Action triggered on: ", name, " that has id: ", program_id);
    util.logThis("Action triggered on: " + name);

    // Example UI response: visual active feedback
    const currentActive = document.querySelector(".program-card.active");
    if (currentActive) currentActive.classList.remove("active");
    targetCard.classList.add("active");
  }

  // --- 5. Event Delegation Listeners ---
  function initEventDelegation() {
    const gridContainer = document.getElementById("program-grid");
    if (!gridContainer) return;

    // A. Click Event Listener (Handles Mouse / Remote Pointer)
    /**
     * @param {!Event} event - The '!' means this parameter cannot be null
     */
    gridContainer.addEventListener("click", function (event) {
      const card = event.target.closest(".program-card");
      if (card) handleProgramSelect(card);
    });

    // B. Keydown Listener (Handles D-Pad Enter / OK key on Smart TVs)
    gridContainer.addEventListener("keydown", function (event) {
      const key = event.key;
      const keyCode = event.keyCode || event.which;

      // Check for Enter key (Code 13) or Remote OK key
      if (key === "Enter" || keyCode === 13) {
        // Prevent browser's automatic synthesized click to avoid duplicate firing
        event.preventDefault();

        const card = event.target.closest(".program-card");
        if (card) handleProgramSelect(card);
      }
    });

    const refresh = document.getElementById("btn-refresh");
    if (!refresh) return;

    refresh.addEventListener("click", async function (_evt) {
      util.logThis("refresh button clicked");
      const showlistrepo = repo.show_repo;
      // shows = showlistrepo.getShows();
      shows = await showlistrepo.getServer();
      renderProgramGrid(shows);
    });
    refresh.addEventListener("keydown", async function (e) {
      util.logThis("refresh button something: " + e.keyCode + " - " + e.key);
      switch (e.keyCode) {
        case 13: // Tizen Enter key
          util.logThis("refresh button press enter");
          const showlistrepo = repo.show_repo;
          // shows = showlistrepo.getShows();
          shows = await showlistrepo.getServer();
          renderProgramGrid(shows);
          // event.preventDefault();
          break;
      }
    });
  }
  function removeEventDelegation() {
    const gridContainer = document.getElementById("program-grid");
    if (!gridContainer) return;

    // gridContainer.removeEventListener("click",
  }

  async function init() {
    console.log("init entry");
    const showlistrepo = repo.show_repo;
    console.log("init exit");
  }
  function show() {
    console.log("show entry");
    renderProgramGrid(shows);
    initEventDelegation();
    console.log("show exit");
  }
  function hide() {
    removeEventDelegation();
  }
  function finalize() {}

  init();
  // console.log("show_details loaded");
  return {
    init: init,
    show: show,
    hide: hide,
    finalize: finalize
  };
});
