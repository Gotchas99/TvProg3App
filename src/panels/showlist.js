define([
  "3rd_party/spatial_navigation",
  "repo/repo",
  "AppState",
  "nav",
  "util"
], function (SpatialNavigation, repo, AppState, nav, util) {
  // console.log("showlist loading");
  let firstLoad = true;
  let shows = [];

  // --- 1. Template Factory Function ---
  function createProgramCard(data) {
    const template = document.getElementById("program-card-template");

    const clone = document.importNode(template.content, true);
    if (!clone) util.logThis("clone failed");

    const card = clone.querySelector(".program-card");
    const posterEl = clone.querySelector(".card-poster");
    const nameEl = clone.querySelector(".card-name");
    const taglineEl = clone.querySelector(".card-tagline");
    const vote_averageEl = clone.querySelector(".card-vote_average");
    const imdbRatingEl = clone.querySelector(".card-imdbRating");
    const title_typeEl = clone.querySelector(".card-title_type");
    const productionStatusEl = card.querySelector(".card-productionStatus");
    const viewStatusEl = card.querySelector(".card-viewStatus");
    const availabilityEl = card.querySelector(".card-availability");
    const watchProvidersEl = card.querySelector(".card-watchProviders");

    card.setAttribute("data-id", data.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    posterEl.src = data.poster_thumbnail;
    nameEl.textContent = data.name;
    taglineEl.textContent = data.tagline;
    vote_averageEl.textContent = data.vote_average;
    imdbRatingEl.textContent = data.imdbRating;
    title_typeEl.textContent = data.title_type;
    productionStatusEl.textContent = data.status;
    viewStatusEl.textContent = data.viewStatus;
    watchProvidersEl.textContent = data.watchProviders;
    availabilityEl.textContent = data.watchProviders.length
      ? "Available"
      : "Not Available";
    return clone;
  }

  function renderProgramGrid(items) {
    if (!Array.isArray(items)) return;
    const container = document.getElementById("program-grid");
    if (!container) {
      console.error("container not found");
      util.logThis("container not found");
      return;
    }
    const fragment = document.createDocumentFragment();

    items.forEach(function (item) {
      fragment.appendChild(createProgramCard(item));
    });
    container.replaceChildren(fragment);
    SpatialNavigation.makeFocusable("panels");
    if (items.length && firstLoad) simEvent();
  }

  function simEvent() {
    firstLoad = false;
    const firstCardElement = document.querySelector(
      "#program-grid .program-card"
    );

    const keyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 13, // Enter / OK key
      which: 13,
      key: "Enter"
    });

    firstCardElement.dispatchEvent(keyEvent);
  }

  function initSpatialNavigation() {
    // Add a dedicated section for the channel grid
    SpatialNavigation.add("program-grid-section", {
      selector: "#program-grid .focusable", // Target focusable elements inside grid
      rememberSource: true, // Remember last focused element when returning
      defaultElement: "#program-grid .focusable:first-child"
    });

    // Make section active and focus the first element
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus("program-grid-section");
  }

  function handleProgramSelect(targetCard) {
    const program_id = targetCard.getAttribute("data-id");
    const name = targetCard.querySelector(".card-name").textContent;

    console.log("Action triggered on: ", name, " that has id: ", program_id);
    util.logThis("Action triggered on: " + name);

    // Example UI response: visual active feedback
    const currentActive = document.querySelector(".program-card.active");
    if (currentActive) currentActive.classList.remove("active");
    targetCard.classList.add("active");

    AppState.setSelectedProgram(program_id);
    nav.navigateTo("panel-show_details");
  }

  function initEventDelegation() {
    const gridContainer = document.getElementById("program-grid");
    if (!gridContainer) return;
    gridContainer.addEventListener("click", onGridClick);
    gridContainer.addEventListener("keydown", onGridKey);

    const refresh = document.getElementById("btn-refresh");
    if (!refresh) return;
    refresh.addEventListener("click", onRefreshClick);
    refresh.addEventListener("keydown", onRefreshKeyDown);
  }
  function removeEventDelegation() {
    const gridContainer = document.getElementById("program-grid");
    if (!gridContainer) return;
    gridContainer.removeEventListener("click", onGridClick);
    gridContainer.removeEventListener("keydown", onGridKey);

    const refresh = document.getElementById("btn-refresh");
    if (!refresh) return;
    refresh.removeEventListener("click", onRefreshClick);
    refresh.removeEventListener("keydown", onRefreshKeyDown);
  }

  /**
   * @param {!Event} event - The '!' means this parameter cannot be null
   */
  function onGridClick(event) {
    const card = event.target.closest(".program-card");
    if (card) handleProgramSelect(card);
  }
  /**
   * @param {!Event} event - The '!' means this parameter cannot be null
   */
  function onGridKey(event) {
    const key = event.key;
    const keyCode = event.keyCode || event.which;

    // Check for Enter key (Code 13) or Remote OK key
    if (key === "Enter" || keyCode === 13) {
      // Prevent browser's automatic synthesized click to avoid duplicate firing
      event.preventDefault();

      const card = event.target.closest(".program-card");
      if (card) handleProgramSelect(card);
    }
  }
  async function onRefreshClick(_event) {
    util.logThis("refresh button clicked");
    const showlistrepo = repo.show_repo;
    // shows = showlistrepo.getShows();
    shows = await showlistrepo.getServer();
    renderProgramGrid(shows);
  }
  async function onRefreshKeyDown(event) {
    util.logThis(
      "refresh button something: " + event.keyCode + " - " + event.key
    );
    switch (event.keyCode) {
      case 13: // Tizen Enter key
        util.logThis("refresh button press enter");
        const showlistrepo = repo.show_repo;
        // shows = showlistrepo.getShows();
        shows = await showlistrepo.getServer();
        renderProgramGrid(shows);
        // event.preventDefault();
        break;
    }
  }

  async function init() {
    // console.log("init entry");

    const showlistrepo = repo.show_repo;
    showlistrepo.getServer().then(res => {
      shows = res;
      renderProgramGrid(shows);
    });
    initSpatialNavigation();
    // console.log("init exit");
  }
  function show() {
    // console.log("show entry");
    renderProgramGrid(shows);
    initEventDelegation();
    // console.log("show exit");
  }
  function hide() {
    removeEventDelegation();
  }
  function finalize() {}

  init();
  // console.log("showlist loaded");
  return {
    init: init,
    show: show,
    hide: hide,
    finalize: finalize
  };
});
