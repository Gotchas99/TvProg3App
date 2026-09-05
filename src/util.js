// console.log("util loading");

define([], function () {
  const MAX_LOG_LINES = 100;
  const el = document.getElementById("log");
  if (!(el instanceof HTMLTextAreaElement)) {
    console.error("LogEl not found");
    return;
  }
  const logEl = el;
  // logEl.value = "------\nAppLog";

  /**
   * @param {String} txt - Text to log.
   */
  function logThis(txt) {
    if (!logEl) {
      console.error("LogEl not found");
      return;
    }
    const updatedText = txt + "\n" + logEl.value;
    const lines = updatedText.split("\n");
    logEl.value = lines.slice(0, MAX_LOG_LINES).join("\n");
  }

  function appendToScreenLog(type, message, details) {
    if (!logEl) return;

    const time = new Date().toISOString().split("T")[1].slice(0, 8);
    let entry = "[" + time + "] [" + type + "] " + message;
    if (details)
      entry +=
        "\n  Details: " +
        (typeof details === "object" ? JSON.stringify(details) : details);

    logThis(entry + "\n----------------------------------------\n");
  }
  /**
   * Log any variable, DOM node, or object directly into <textarea id="log">
   * @param {string} label - Context label for the log entry
   * @param {*} data - Variable, object, or DOM node to inspect
   */
  function logToScreen(label, data) {
    if (!logEl) return;

    let output = "";

    if (data === null) output = "null";
    else if (data === undefined) output = "undefined";
    else if (data instanceof DocumentFragment) {
      // Extract inner HTML of fragment to reveal cloned elements
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(data.cloneNode(true));
      output = "[DocumentFragment] -> " + tempDiv.innerHTML;
    } else if (data instanceof HTMLElement)
      // Print tag name, class, ID, and outer HTML structure
      output =
        "[" +
        data.tagName +
        (data.id ? "#" + data.id : "") +
        (data.className ? "." + data.className : "") +
        "] -> " +
        data.outerHTML;
    else if (typeof data === "object")
      try {
        output = JSON.stringify(data, null, 2);
      } catch (e) {
        output = "[Object (Circular/Non-Stringifiable)]";
      }
    else output = String(data);

    const timestamp = new Date().toLocaleTimeString("sv-SE");
    logThis("[" + timestamp + "] " + label + ": " + output + "\n\n");
  }

  // 1. Capture Uncaught Synchronous & Runtime JS Errors
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const fileName = url ? url.split("/").pop() : "unknown";
    const errorDetails = {
      file: fileName + ":" + lineNo + ":" + (columnNo || 0),
      stack: error && error.stack ? error.stack : "No stack trace"
    };
    appendToScreenLog("JS ERROR", msg, errorDetails);
    return false; // Retain standard console log behavior
  };

  // 2. Capture Unhandled Promise Rejections (e.g., failed async/await)
  window.addEventListener("unhandledrejection", function (event) {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    const details = reason instanceof Error ? reason.stack : reason;
    appendToScreenLog("UNHANDLED PROMISE", message, details);
  });

  // 3. Intercept window.fetch to Catch Network Errors & Non-200 Responses
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function () {
      const args = arguments;
      const url = typeof args[0] === "string" ? args[0] : args[0].url;

      return originalFetch
        .apply(this, args)
        .then(function (response) {
          if (!response.ok)
            appendToScreenLog(
              "HTTP ERROR",
              response.status + " " + response.statusText,
              url
            );

          return response;
        })
        .catch(function (error) {
          appendToScreenLog("FETCH FAILED", error.message || "Network Error", {
            url: url,
            error: String(error)
          });
          throw error; // Re-throw so application catch blocks still receive it
        });
    };
  }

  return {
    appendToScreenLog: appendToScreenLog,
    logThis: logThis,
    logToScreen: logToScreen
  };
});

// console.log("util loaded");
