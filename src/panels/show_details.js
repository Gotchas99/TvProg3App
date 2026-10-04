define([
  "3rd_party/spatial_navigation",
  "repo/repo",
  "AppState",
  "util"
], function (SpatialNavigation, repo, AppState, util) {
  // console.log("show_details loading");
  let showrepo;
  let programID;
  const panel = document.querySelector("#panel-show_details");

  function handleSeasonSelect(targetCard) {
    const program_id = targetCard.getAttribute("data-id");
    const name = targetCard.querySelector(".card-name").textContent;

    console.log("Action triggered on: ", name, " that has id: ", program_id);
    util.logThis("Action triggered on: " + name);

    const currentActive = document.querySelector(".season-card.active");
    if (currentActive) currentActive.classList.remove("active");
    targetCard.classList.add("active");
  }

  function renderProgramCard(data) {
    const card = panel.querySelector(".program-details-card");
    const posterEl = card.querySelector(".card-poster");
    const nameEl = card.querySelector(".card-name");
    const taglineEl = card.querySelector(".card-tagline");
    const overviewEl = card.querySelector(".card-overview");
    const vote_averageEl = card.querySelector(".card-vote_average");
    const imdbRatingEl = card.querySelector(".card-imdbRating");
    const title_typeEl = card.querySelector(".card-title_type");
    const productionStatusEl = card.querySelector(".card-productionStatus");
    const viewStatusEl = card.querySelector(".card-viewStatus");
    const availabilityEl = card.querySelector(".card-availability");
    const watchProvidersEl = card.querySelector(".card-watchProviders");

    card.setAttribute("data-id", data.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    posterEl.src = data.poster_thumbnail;
    nameEl.textContent = data.name;
    taglineEl.textContent = data.tagline;
    overviewEl.textContent = data.overview;
    vote_averageEl.textContent = data.vote_average;
    imdbRatingEl.textContent = data.imdbRating;
    title_typeEl.textContent = data.title_type;
    productionStatusEl.textContent = data.status;
    viewStatusEl.textContent = data.viewStatus;
    watchProvidersEl.textContent = data.watchProviders;
    availabilityEl.textContent = data.watchProviders.length
      ? "Available"
      : "Not Available";
  }

  function createSeasonCard(data) {
    const template = document.getElementById("program-season-template");

    const clone = document.importNode(template.content, true);
    if (!clone) util.logThis("clone failed");

    const card = clone.querySelector(".season-card");
    const posterEl = clone.querySelector(".card-poster");
    const nameEl = clone.querySelector(".card-name");
    const overviewEl = clone.querySelector(".card-overview");
    const vote_averageEl = clone.querySelector(".card-vote_average");
    const title_typeEl = clone.querySelector(".card-title_type");
    const viewStatusEl = clone.querySelector(".card-viewStatus");
    const availabilityEl = clone.querySelector(".card-availability");
    const watchProvidersEl = clone.querySelector(".card-watchProviders");

    card.setAttribute("data-id", data.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    posterEl.src = "https://image.tmdb.org/t/p/w92" + data.poster_path;
    nameEl.textContent = data.name;
    // overviewEl.textContent = data.overview;
    vote_averageEl.textContent = data.vote_average;
    title_typeEl.textContent = data.title_type;
    viewStatusEl.textContent = data.viewStatus;
    watchProvidersEl.textContent = data.watchProviders;
    availabilityEl.textContent = data.watchProviders.length
      ? "Available"
      : "Not Available";

    return clone;
  }

  function renderSeasonCards(seasons) {
    console.log("render season: " + seasons);
    const container = document.getElementById("season-grid");
    const fragment = document.createDocumentFragment();

    seasons.forEach(function (item) {
      fragment.appendChild(createSeasonCard(item));
    });

    container.replaceChildren(fragment);
    SpatialNavigation.makeFocusable("panels");

    const firstCard = container.querySelector(".season-card");
    if (firstCard) SpatialNavigation.focus(firstCard);
  }
  function initEventDelegation() {
    const gridContainer = document.getElementById("season-grid");
    if (!gridContainer) return;

    gridContainer.addEventListener("click", onGridContainerClick);
    // B. Keydown Listener (Handles D-Pad Enter / OK key on Smart TVs)
    gridContainer.addEventListener("keydown", onGridContainerKeyDown);
  }
  function removeEventDelegation() {
    const gridContainer = document.getElementById("season-grid");
    if (!gridContainer) return;
    gridContainer.removeEventListener("click", onGridContainerClick);
    gridContainer.removeEventListener("keydown", onGridContainerKeyDown);
  }
  /**
   * @param {Event} event
   */
  function onGridContainerClick(event) {
    const card = event.target.closest(".season-card");
    if (card) handleSeasonSelect(card);
  }
  function onGridContainerKeyDown(event) {
    const key = event.key;
    const keyCode = event.keyCode || event.which;

    // Check for Enter key (Code 13) or Remote OK key
    if (key === "Enter" || keyCode === 13) {
      // Prevent browser's automatic synthesized click to avoid duplicate firing
      event.preventDefault();

      const card = event.target.closest(".season-card");
      if (card) handleSeasonSelect(card);
    }
  }
  // --------------------------
  function init() {
    // console.log("init entry");
    showrepo = repo.show_repo;
    // console.log("init exit");
  }

  function show() {
    // console.log("show entry");
    programID = AppState.getSelectedProgram();
    const program = showrepo.getShow(programID);
    renderProgramCard(program);
    showrepo.getSeasons(programID).then(renderSeasonCards);
    initEventDelegation();

    // console.log("show exit");
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
