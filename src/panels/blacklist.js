define(["3rd_party/spatial_navigation", "repo/repo"], function (
  SpatialNavigation,
  repo
) {
  console.log("showlist loading");
  // Sample Data
  const channels = [
    {
      id: 101,
      imdb_id: "01",
      title: "HBO HD",
      description: "Live Sports & Premier Movies"
    },
    {
      id: 102,
      imdb_id: "02",
      title: "Discovery",
      description: "Documentaries & Nature"
    },
    {
      id: 103,
      imdb_id: "03",
      title: "CNN",
      description: "24/7 Global News Coverage"
    },
    {
      id: 104,
      imdb_id: "04",
      title: "Eurosport",
      description: "Live Football & Tennis"
    },
    {
      id: 105,
      imdb_id: "05",
      title: "HBO HD",
      description: "Live Sports & Premier Movies"
    },
    {
      id: 106,
      imdb_id: "06",
      title: "Discovery",
      description: "Documentaries & Nature"
    },
    {
      id: 107,
      imdb_id: "07",
      title: "CNN",
      description: "24/7 Global News Coverage"
    }
  ];

  // --- 1. Template Factory Function ---
  function createChannelCard(data) {
    const template = document.getElementById("program-card-template");
    const clone = document.importNode(template.content, true);

    const card = clone.querySelector(".program-card");
    const imdb_idEl = clone.querySelector(".card-imdb_id");
    const titleEl = clone.querySelector(".card-title");
    const descEl = clone.querySelector(".card-description");

    card.setAttribute("data-id", data.id);
    card.setAttribute("data-target", "channel-player"); // For route/action tracking
    imdb_idEl.textContent = data.imdb_id;
    titleEl.textContent = data.title;
    descEl.textContent = data.description;

    return clone;
  }

  // --- 2. Render Grid ---
  function renderChannelGrid(items) {
    const container = document.getElementById("program-grid");
    const fragment = document.createDocumentFragment();

    items.forEach(function (item) {
      fragment.appendChild(createChannelCard(item));
    });

    container.replaceChildren(fragment);
  }

  // --- 3. Setup Spatial Navigation ---
  function initSpatialNavigation() {
    // Add a dedicated section for the channel grid
    SpatialNavigation.add("program-grid-section____X", {
      selector: "#program-grid .focusable", // Target focusable elements inside grid
      rememberSource: true, // Remember last focused element when returning
      defaultElement: "#program-grid .focusable:first-child"
    });

    // Make section active and focus the first element
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus("program-grid-section");
  }

  // --- 4. Event Delegation Handler ---
  function handleChannelSelect(targetCard) {
    const channelId = targetCard.getAttribute("data-id");
    const channelTitle = targetCard.querySelector(".card-title").textContent;

    console.log(
      "Action triggered on Channel ID:",
      channelId,
      "Title:",
      channelTitle
    );

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
    gridContainer.addEventListener("click", function (event) {
      const card = event.target.closest(".program-card");
      if (card) handleChannelSelect(card);
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
        if (card) handleChannelSelect(card);
      }
    });
  }

  function init() {
    initSpatialNavigation();
  }
  function show() {
    renderChannelGrid(channels);
    initEventDelegation();
  }
  function hide() {}
  function finalize() {}
  init();
  console.log("showlist loaded");
  return {
    init: init,
    show: show,
    hide: hide,
    finalize: finalize
  };
});
