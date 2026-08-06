define(["3rd_party/spatial_navigation"], function (SpatialNavigation) {
  /**
   * Sets focus to a specific navigation index.
   * @param {number} item - Index of the link to focus.
   * @returns {void}
   */
  function setFocusX(item) {
    focusItemNumber = item;
    navLinks[focusItemNumber].focus();
  }

  /**
   * Handles directional key presses for TV remote navigation.
   * @param {KeyboardEvent} ev - The keyboard event object from keydown/keyup.
   * @returns {void}
   */
  function handleNavKey(ev) {
    switch (ev.key) {
      case "ArrowUp":
        if (focusItemNumber === 0)
          // handle up from 0
          console.warn("up from first");
        else focusItemNumber--;
        console.log("up");
        break;
      case "ArrowDown":
        if (focusItemNumber === navLinks.length - 1)
          // handle down from last link
          console.warn("down from last");
        else focusItemNumber++;
        console.log("down");
        break;
      case "Enter":
        console.log("enter");
        break;
      default:
        console.log(ev);
        logThis(ev);
        break;
    }
    setFocusX(focusItemNumber);
  }

  /**
   * @param {HTMLAnchorElement} clickedLink
   */
  function handleSelect(clickedLink) {
    // 1. Read the target ID string (e.g., "panel-settings")
    const targetId = clickedLink.dataset.target;

    if (targetId) {
      const targetPanel = document.getElementById(targetId);

      // 3. Show the panel
      targetPanel.classList.remove("hidden");
    }
  }
  /**
   * Switches the active panel on the right side and focuses its first element.
   * @param {HTMLAnchorElement} activeLink - The currently focused menu link.
   */
  function openTargetPanel(activeLink) {
    const targetId = activeLink.getAttribute("data-target");
    if (!targetId) return;

    // 1. Hide all panels
    /** @type {NodeListOf<HTMLElement>} */
    const panels = document.querySelectorAll(".view-panel");
    panels.forEach(function (panel) {
      panel.classList.add("hidden");
      panel.classList.remove("active");
    });

    // 2. Show the target panel
    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    targetPanel.classList.remove("hidden");
    targetPanel.classList.add("active");

    // 3. Hand off focus to the first focusable element inside the target panel
    /** @type {HTMLElement | null} */
    const firstFocusable = targetPanel.querySelector(
      "input, button, a, [tabindex]"
    );
    if (firstFocusable) firstFocusable.focus();
  }

  // document.addEventListener("keydown", function (ev) {
  //     // Tizen Return / Back key codes
  //     if (ev.key === "GoBack" || ev.key === "Back" || ev.keyCode === 10009) {
  //         ev.preventDefault();

  //         // Return focus to the left side menu
  //         setFocus(focusItemNo);
  //     }
  // });

  // /** @type {HTMLElement | null} */
  // const nav = document.getElementById("sidemenu");
  // if (nav) {
  //     nav.addEventListener("keydown", handleNavKey);
  // } else {
  //     console.error("No nav found");
  // }

  SpatialNavigation.init();
  // Define navigable elements (anchors and elements with "focusable" class).
  SpatialNavigation.add({
    selector: "a, .focusable"
  });

  // Make the *currently existing* navigable elements focusable.
  SpatialNavigation.makeFocusable();

  // Focus the first navigable element.
  SpatialNavigation.focus();

  // /** @type {NodeListOf<HTMLAnchorElement>} */
  // const navLinks = document.querySelectorAll("#sidemenu a");

  // let focusItemNumber = 0;
  // setFocusX(focusItemNumber);
});
