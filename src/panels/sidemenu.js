define([
  "nav",
  "panels/default",
  "panels/showlist",
  "panels/show_details",
  "panels/blacklist",
  "panels/settings"
], function (nav, defaultPanel, showlist, show_details, blacklist, settings) {
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
    // Make the *currently existing* navigable elements focusable.
    SpatialNavigation.makeFocusable("panels");
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
    if (!sidemenu) {
      console.error("Sidemenu not found");
      return;
    }
    // 1. Mouse / Touch click handler
    sidemenu.addEventListener("click", onClick);
    // 2. D-Pad / Remote Control Key handler
    sidemenu.addEventListener("keydown", onKeyDown);
  }
  // #endregion

  initEventHandlers();

  const firstEl = sidemenu.getElementsByTagName("a")[0];
  handleTrigger(firstEl);

  return {};
});
