define(["nav"], function (nav) {
  // #region variables
  /** @type {HTMLElement | null} */
  const sidemenu = document.getElementById("sidemenu");
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const navLinks = document.querySelectorAll("#sidemenu a");
  // #endregion

  // Common navigation trigger executor
  /**
   * @param {HTMLElement|Element} element
   */
  function handleTrigger(element) {
    const el = element.closest("[data-target]");
    if (!el) return;
    const targetId = el.dataset.target;
    if (!targetId) return;

    nav.navigateTo(targetId);
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
