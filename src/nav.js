define([
  "3rd_party/spatial_navigation",
  "panels/default",
  "panels/showlist",
  "panels/settings"
], function (SpatialNavigation, defaultPanel, showlist, settings) {
  // #region variables
  /** @type {HTMLElement | null} */
  const sidemenu = document.getElementById("sidemenu");
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const navLinks = document.querySelectorAll("#sidemenu a");
  /** @type {NodeListOf<HTMLElement>} */
  const viewPanels = document.querySelectorAll("#panels .view-panel");
  /** @type {NodeListOf<HTMLElement>} */
  const panelMap = {
    "panel-default": defaultPanel,
    "panel-showlist": showlist,
    "panel-settings": settings
  };
  // #endregion

  /**
   * @param {HTMLElement} panel
   */
  function onPageShow(panel) {
    const p = panelMap[panel.id];
    if (p) p.show();
    else console.error("PanelMap not found", panel.id);
    // Focus the default element of the 'main-content' section
    SpatialNavigation.focus("main-content");
  }
  /**
   * @param {HTMLElement} panel
   */
  function onPageHide(panel) {
    const p = panelMap[panel.id];
    if (p) p.hide();
    else console.error("PanelMap not found", panel.id);
  }
  /**
   * @param {HTMLElement} targetPanel
   */
  function navigateTo(targetPanel) {
    if (!targetPanel) return;
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
    // Make the *currently existing* navigable elements focusable.
    SpatialNavigation.makeFocusable();

    // Update active state on navigation buttons if present
    // navLinks.forEach(function (link) {
    //   if (link.getAttribute("data-target") === targetPanel.id)
    //     link.classList.add("active");
    //   else link.classList.remove("active");
    // });
  }

  // Common navigation trigger executor
  /**
   * @param {HTMLElement|Element} element
   */
  function handleTrigger(element) {
    // 1. Read the target ID string (e.g., "data-target")
    const el = element.closest("[data-target]");
    if (el) {
      const targetId = el.dataset.target;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) navigateTo(targetPanel);
      else console.error("targetPanel not found");
    } else console.error("no data-target");
  }

  function setupSpatialNav() {
    // Wait for fully loaded to get focus-styling to work
    if (document.readyState !== "complete") {
      // Otherwise wait for the event
      window.addEventListener("load", setupSpatialNav, { once: true });
      return;
    }
    SpatialNavigation.init();
    // Define navigable elements (anchors and elements with "focusable" class).
    SpatialNavigation.add({
      selector: "a, .focusable"
    });

    // 1. Define the Sidebar section
    SpatialNavigation.add("sidemenu", {
      selector: "#sidemenu .focusable",
      defaultElement: "#sidemenu .default-item", // Optional: item focused when section opens
      enterTo: "last-focused", // Remembers the last focused item when returning
      leaveFor: {
        right: "@panels" // Pressing RIGHT explicitly targets the 'main-content' section
      }
    });

    // 2. Define the Main Content section
    SpatialNavigation.add("panels", {
      selector: "#panels .focusable",
      enterTo: "default-element",
      leaveFor: {
        left: "@sidemenu" // Pressing LEFT explicitly targets the 'sidebar' section
      }
    });

    // Make the *currently existing* navigable elements focusable.
    SpatialNavigation.makeFocusable();

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
      console.log(evt.type, evt.target, evt.detail);
    };

    validEvents.forEach(function (type) {
      window.addEventListener(type, eventHandler);
    });
    // #endregion

    // Focus the first navigable element.
    SpatialNavigation.focus();
  }

  // #region Event handlers
  /**
   * Handles directional key presses for TV remote navigation.
   * @param {PointerEvent} event - The keyboard event object from keydown/keyup.
   * @returns {void}
   */
  function onClick(event) {
    handleTrigger(event.target);
  }
  /**
   * Handles directional key presses for TV remote navigation.
   * @param {KeyboardEvent} event - The keyboard event object from keydown/keyup.
   * @returns {void}
   */
  function onKeyDown(event) {
    const keyCode = event.keyCode;
    const keyName = event.key;

    // Standard Enter (13) or Tizen/SmartTV OK key (29443 or 13)
    const isEnterKey =
      keyCode === 13 || keyCode === 29443 || keyName === "Enter";

    if (isEnterKey) {
      const activeElement = document.activeElement;
      if (activeElement && activeElement !== document.body) {
        handleTrigger(activeElement);
        event.preventDefault(); // Prevents the browser from firing the subsequent 'click' event
      }
    }
  }

  function initEventHandlers() {
    if (sidemenu) {
      // 1. Mouse / Touch click handler
      sidemenu.addEventListener("click", onClick);
      // 2. D-Pad / Remote Control Key handler
      sidemenu.addEventListener("keydown", onKeyDown);
    } else console.error("Sidemenu not found");
  }
  // #endregion

  setupSpatialNav();
  initEventHandlers();
  const firstEl = sidemenu.getElementsByTagName("a")[0];
  handleTrigger(firstEl);
  return {
    init: setupSpatialNav
  };
});

// document.addEventListener("keydown", function (ev) {
//     // Tizen Return / Back key codes
//     if (ev.key === "GoBack" || ev.key === "Back" || ev.keyCode === 10009) {
//         ev.preventDefault();

//         // Return focus to the left side menu
//         setFocus(focusItemNo);
//     }
// });
