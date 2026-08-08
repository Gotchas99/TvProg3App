define(["3rd_party/spatial_navigation", "util"],
  function (SpatialNavigation, util) {

    // #region variables
    /** @type {HTMLElement | null} */
    const sidemenu = document.getElementById("sidemenu");
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const navLinks = document.querySelectorAll("#sidemenu a");
    /** @type {NodeListOf<HTMLElement>} */
    const viewPanels = document.querySelectorAll("#panels .view-panel");
    // #endregion

    /**
      * @param {HTMLElement} panel
      */
    function onPageShow(panel) {
    };
    /**
     * @param {HTMLElement} panel
     */
    function onPageHide(panel) {
    };
    /**
     * @param {HTMLElement} targetPanel
     */
    function navigateTo(targetPanel) {
      if (!targetPanel) return;
      viewPanels.forEach(function (panel) {
        if (panel === targetPanel) {
          if (!panel.classList.contains('active')) {
            panel.classList.add('active');
            onPageShow(targetPanel);
          }
        } else
          if (panel.classList.contains('active')) {
            panel.classList.remove('active');
            onPageHide(panel);

          }
      });

      // Update active state on navigation buttons if present
      navLinks.forEach(function (link) {
        if (link.getAttribute('data-target') === targetPanel.id)
          link.classList.add('active');
        else
          link.classList.remove('active');
      });
    }

    // Common navigation trigger executor
    /**
     * @param {HTMLElement} element
     */
    function handleTrigger(element) {
      // 1. Read the target ID string (e.g., "data-target")
      const el = element.closest('[data-target]');
      if (el) {
        const targetId = el.dataset.target;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel)
          navigateTo(targetPanel);
        else
          console.error("targetPanel not found");
      }
      else
        console.error("no data-target");
    };

    function setupSpatialNav() {
      SpatialNavigation.init();
      // Define navigable elements (anchors and elements with "focusable" class).
      SpatialNavigation.add({
        selector: "a, .focusable"
      });

      // Make the *currently existing* navigable elements focusable.
      SpatialNavigation.makeFocusable();

      // Focus the first navigable element.
      SpatialNavigation.focus();
    };

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
      const isEnterKey = keyCode === 13 || keyCode === 29443 || keyName === 'Enter';

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
        sidemenu.addEventListener('click', onClick);
        // 2. D-Pad / Remote Control Key handler
        sidemenu.addEventListener('keydown', onKeyDown);
      }
      else
        console.error("Sidemenu not found");
    };
    // #endregion

    setupSpatialNav();
    initEventHandlers();
  });

// document.addEventListener("keydown", function (ev) {
//     // Tizen Return / Back key codes
//     if (ev.key === "GoBack" || ev.key === "Back" || ev.keyCode === 10009) {
//         ev.preventDefault();

//         // Return focus to the left side menu
//         setFocus(focusItemNo);
//     }
// });
