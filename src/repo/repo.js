define(["repo/show_repo"], function (show_repo) {
  // console.log("repo loading");
  const errorPanel = document.getElementById("error-panel");
  const apiURL = "http://localhost:1701";
  const intervalMs = 5000;

  async function watchDog() {
    // console.log("Watchdog: checking server");
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Request timeout")), 5000);
    });
    try {
      // Standard fetch without AbortSignal
      const fetchPromise = fetch(apiURL);
      // Race the fetch request against the timeout timer
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      clearTimeout(timeoutId);

      if (response.ok) errorPanel.classList.remove("has-error");
      else errorPanel.classList.add("has-error");
    } catch (error) {
      errorPanel.classList.add("has-error");
      console.log("Server check failed:", error.message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function startWatchDog() {
    setInterval(() => watchDog(), intervalMs);
  }

  function init() {
    if (errorPanel) startWatchDog();
  }

  init();
  // console.log("repo loaded");

  return {
    show_repo: show_repo
  };
});
