define(["3rd_party/spatial_navigation", "util"], function (
  SpatialNavigation,
  util
) {
  // #region variables
  /** @type {NodeListOf<HTMLElement>} */
  const viewPanels = document.querySelectorAll("#panels .view-panel");
  const panelMap = {};
  // #endregion

  /**
   * @param string  panelID
   */
  async function moduleForPanel(panelID) {
    const panelName = panelID.split("-")[1];
    // console.log("moduleForPanel entry: " + panelName);
    if (viewPanels[panelID]) return panelMap[panelID];

    const newModule = await util.loadModuleAsync("panels/" + panelName);
    panelMap[panelID] = newModule;
    // console.log(panelMap); //prints 1
    // console.log("moduleForPanel exit: " + panelName); //prints 1
    return newModule; //prints 2
  }
  /**
   * @param {HTMLElement} panel
   */
  async function onPageShow(panel) {
    const p = await moduleForPanel(panel.id);
    if (p) p.show();
    else console.error("PanelMap not found", panel.id);
    // Make the *currently existing* navigable elements focusable.
    SpatialNavigation.makeFocusable("panels");
  }
  /**
   * @param {HTMLElement} panel
   */
  async function onPageHide(panel) {
    const p = await moduleForPanel(panel.id);
    if (p) p.hide();
    else console.error("PanelMap not found", panel.id);
  }

  /**
   * @param string targetId
   */
  function navigateTo(targetId) {
    if (!targetId) return;
    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) {
      console.error("targetPanel not found");
      return;
    }
    viewPanels.forEach(function (panel) {
      if (panel === targetPanel) {
        if (!panel.classList.contains("active")) {
          panel.classList.add("active");
          onPageShow(targetPanel);
        }
      } else if (panel.classList.contains("active")) {
        panel.classList.remove("active");
        onPageHide(panel);
      }
    });
  }

  function setupSpatialNav() {
    // Wait for fully loaded to get focus-styling to work
    if (document.readyState !== "complete") {
      // Otherwise wait for the event
      window.addEventListener("load", setupSpatialNav, {once: true});
      return;
    }
    SpatialNavigation.init();

    // 1. Define the Sidebar section
    SpatialNavigation.add("sidemenu", {
      selector: "#sidemenu .focusable",
      defaultElement: "#sidemenu .default-item", // Optional: item focused when section opens
      enterTo: "last-focused", // Remembers the last focused item when returning
      leaveFor: {
        right: "@panels", // Pressing RIGHT explicitly targets the 'panels' section
        down: "@logSection"
      }
    });

    // 2. Define the Main Content section
    SpatialNavigation.add("panels", {
      selector:
        "#panels .view-panel.active a, " +
        "#panels .view-panel.active button, " +
        "#panels .view-panel.active input, " +
        "#panels .view-panel.active textarea, " +
        "#panels .view-panel.active select, " +
        "#panels .view-panel.active .focusable, " +
        "#panels .view-panel.active [tabindex='0']",
      enterTo: "default-element",
      leaveFor: {
        left: "@sidemenu" // Pressing LEFT explicitly targets the 'sidemenu' section
      }
    });

    // 3. Define the Log section
    SpatialNavigation.add("logSection", {
      selector: "#log",
      defaultElement: "#log", // Optional: item focused when section opens
      // enterTo: "last-focused", // Remembers the last focused item when returning
      leaveFor: {
        up: "@sidemenu"
      }
    });

    // #region sn events
    // All valid events.
    const validEvents = [
      "sn:willmove",
      "sn:willunfocus",
      "sn:unfocused",
      "sn:willfocus",
      "sn:focused",
      "sn:enter-down",
      "sn:enter-up",
      "sn:navigatefailed"
    ];

    const eventHandler = function (evt) {
      // console.log(evt.type, evt.target, evt.detail, evt);
    };

    validEvents.forEach(function (type) {
      window.addEventListener(type, eventHandler);
    });
    // #endregion
    SpatialNavigation.makeFocusable();
    // Initial focus targets section ID "sidemenu"
    SpatialNavigation.focus("sidemenu");
  }

  function init() {
    setupSpatialNav();
    document.addEventListener("focusin", () =>
      console.log(
        "Actually focused:",
        document.activeElement.id,
        document.activeElement.classList,
        document.activeElement
      )
    );
  }

  init();

  return {
    navigateTo: navigateTo
  };
});
