define(["3rd_party/spatial_navigation", "repo/repo", "util"], function (
  SpatialNavigation,
  repo,
  util
) {
  // console.log("showlist loading");
  // Sample Data
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
    const statusEl = clone.querySelector(".card-status");

    card.setAttribute("data-id", data.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    posterEl.src = data.poster_thumbnail;
    nameEl.textContent = data.name;
    taglineEl.textContent = data.tagline;
    vote_averageEl.textContent = data.vote_average;
    imdbRatingEl.textContent = data.imdbRating;
    title_typeEl.textContent = data.title_type;
    statusEl.textContent = data.status;

    return clone;
  }

  // --- 2. Render Grid ---
  function renderProgramGrid(items) {
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
  }

  // --- 3. Setup Spatial Navigation ---
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

  // --- 4. Event Delegation Handler ---
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
    // shows = showlistrepo.getShows();
    // shows = await showlistrepo.getServer();
    showlistrepo.getServer().then(res => {
      shows = res;
      renderProgramGrid(shows);
    });
    initSpatialNavigation();
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
  // console.log("showlist loaded");
  return {
    init: init,
    show: show,
    hide: hide,
    finalize: finalize
  };
});
