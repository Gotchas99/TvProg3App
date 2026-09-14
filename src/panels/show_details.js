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

  function renderProgramCard(show) {
    const card = panel.querySelector(".program-card");
    const posterEl = card.querySelector(".card-poster");
    const nameEl = card.querySelector(".card-name");
    const taglineEl = card.querySelector(".card-tagline");
    const overviewEl = card.querySelector(".card-overview");
    const vote_averageEl = card.querySelector(".card-vote_average");
    const imdbRatingEl = card.querySelector(".card-imdbRating");
    const title_typeEl = card.querySelector(".card-title_type");
    const statusEl = card.querySelector(".card-status");

    card.setAttribute("data-id", show.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    posterEl.src = show.poster_thumbnail;
    nameEl.textContent = show.name;
    taglineEl.textContent = show.tagline;
    overviewEl.textContent = show.overview;
    vote_averageEl.textContent = show.vote_average;
    imdbRatingEl.textContent = show.imdbRating;
    title_typeEl.textContent = show.title_type;
    statusEl.textContent = show.status;
  }

  function createSeasonCard(data) {
    const template = document.getElementById("program-season-template");

    const clone = document.importNode(template.content, true);
    if (!clone) util.logThis("clone failed");

    const card = clone.querySelector(".program-card");
    const posterEl = clone.querySelector(".card-poster");
    const nameEl = clone.querySelector(".card-name");
    const overviewEl = clone.querySelector(".card-overview");
    const vote_averageEl = clone.querySelector(".card-vote_average");
    const imdbRatingEl = clone.querySelector(".card-imdbRating");
    const title_typeEl = clone.querySelector(".card-title_type");
    const statusEl = clone.querySelector(".card-status");

    card.setAttribute("data-id", data.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    posterEl.src = "https://image.tmdb.org/t/p/w92" + data.poster_path;
    nameEl.textContent = data.name;
    overviewEl.textContent = data.overview;
    vote_averageEl.textContent = data.vote_average;
    imdbRatingEl.textContent = data.imdbRating;
    title_typeEl.textContent = data.title_type;
    statusEl.textContent = data.status;

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
