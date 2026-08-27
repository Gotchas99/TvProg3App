define([], function () {
  if (!Element.prototype.replaceChildren)
    Element.prototype.replaceChildren = function (...nodes) {
      // 1. Wipe current content
      this.innerHTML = "";

      // 2. Append new nodes/strings if provided
      if (nodes.length > 0) this.append(...nodes);
    };
});
