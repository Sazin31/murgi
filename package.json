(function () {
  "use strict";

  var channelNames = [
    "Unite8 Sports 2",
    "TSports-1",
    "TSports-2"
  ];

  var selectedIndex = 0;
  var selectedElement = null;
  var styleId = "murgi-channel-focus-style";
  var debugId = "murgi-channel-debug";

  function normalizeText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/^\s+|\s+$/g, "");
  }

  function addStyle() {
    if (document.getElementById(styleId)) return;

    var style = document.createElement("style");
    style.id = styleId;

    style.textContent =
      ".murgi-selected-channel {" +
      "outline: 8px solid #00ff66 !important;" +
      "outline-offset: 4px !important;" +
      "box-shadow: 0 0 30px #00ff66 !important;" +
      "transform: scale(1.05) !important;" +
      "z-index: 2147483000 !important;" +
      "position: relative !important;" +
      "}" +

      "#" + debugId + " {" +
      "position: fixed !important;" +
      "left: 20px !important;" +
      "bottom: 20px !important;" +
      "z-index: 2147483647 !important;" +
      "background: rgba(0,0,0,0.9) !important;" +
      "color: #00ff66 !important;" +
      "border: 2px solid #00ff66 !important;" +
      "border-radius: 8px !important;" +
      "padding: 10px 16px !important;" +
      "font: bold 20px Arial !important;" +
      "pointer-events: none !important;" +
      "}";

    document.documentElement.appendChild(style);
  }

  function showDebug(text) {
    var box = document.getElementById(debugId);

    if (!box) {
      box = document.createElement("div");
      box.id = debugId;
      (document.body || document.documentElement).appendChild(box);
    }

    box.textContent = text;
  }

  function isVisible(element) {
    if (!element) return false;

    var rect = element.getBoundingClientRect();

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth
    );
  }

  function findTextElement(channelName) {
    var nodes = document.querySelectorAll(
      "a, button, [role='button'], [onclick], div, span, p"
    );

    var exactMatch = null;
    var partialMatch = null;
    var i;

    for (i = 0; i < nodes.length; i++) {
      if (!isVisible(nodes[i])) continue;

      var text = normalizeText(
        nodes[i].innerText || nodes[i].textContent
      );

      if (text === channelName) {
        exactMatch = nodes[i];
        break;
      }

      if (!partialMatch && text.indexOf(channelName) !== -1) {
        partialMatch = nodes[i];
      }
    }

    return exactMatch || partialMatch;
  }

  function findClickableParent(element) {
    var current = element;
    var count = 0;

    while (
      current &&
      current !== document.body &&
      count < 6
    ) {
      var tag = current.tagName
        ? current.tagName.toUpperCase()
        : "";

      var role = current.getAttribute
        ? current.getAttribute("role")
        : "";

      if (
        tag === "A" ||
        tag === "BUTTON" ||
        role === "button" ||
        role === "link" ||
        typeof current.onclick === "function"
      ) {
        return current;
      }

      current = current.parentElement;
      count++;
    }

    /*
     * A click on the text element can still bubble
     * to a parent website click listener.
     */
    return element;
  }

  function findChannel(channelName) {
    var textElement = findTextElement(channelName);

    if (!textElement) return null;

    return findClickableParent(textElement);
  }

  function clearSelection() {
    var oldItems = document.querySelectorAll(
      ".murgi-selected-channel"
    );

    var i;

    for (i = 0; i < oldItems.length; i++) {
      oldItems[i].classList.remove(
        "murgi-selected-channel"
      );
    }
  }

  function selectChannel() {
    clearSelection();

    var name = channelNames[selectedIndex];
    var element = findChannel(name);

    if (!element) {
      selectedElement = null;
      showDebug("Not found: " + name);
      return;
    }

    selectedElement = element;
    element.classList.add("murgi-selected-channel");

    try {
      element.scrollIntoView(false);
    } catch (error) {}

    var rect = element.getBoundingClientRect();

    var centerX = Math.round(
      rect.left + rect.width / 2
    );

    var centerY = Math.round(
      rect.top + rect.height / 2
    );

    showDebug(
      name +
      " | X: " +
      centerX +
      " Y: " +
      centerY
    );
  }

  function dispatchClick(element) {
    if (!element) return;

    var rect = element.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;

    var eventTypes = [
      "mouseover",
      "mousemove",
      "mousedown",
      "mouseup",
      "click"
    ];

    var i;

    for (i = 0; i < eventTypes.length; i++) {
      var event = document.createEvent("MouseEvents");

      event.initMouseEvent(
        eventTypes[i],
        true,
        true,
        window,
        1,
        x,
        y,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null
      );

      element.dispatchEvent(event);
    }
  }

  function activateSelected() {
    if (!selectedElement) {
      selectChannel();
      return;
    }

    var name = channelNames[selectedIndex];

    showDebug("Opening: " + name);

    try {
      selectedElement.focus();
    } catch (error) {}

    dispatchClick(selectedElement);

    /*
     * Do not call element.click() again here.
     * It can open the channel twice.
     */
  }

  function blockEvent(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    }

    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }
  }

  function handleKey(event) {
    var code = event.keyCode || event.which;
    var key = event.key || "";

    if (
      code === 37 ||
      code === 38 ||
      key === "ArrowLeft" ||
      key === "ArrowUp"
    ) {
      blockEvent(event);

      selectedIndex--;

      if (selectedIndex < 0) {
        selectedIndex = channelNames.length - 1;
      }

      selectChannel();
      return false;
    }

    if (
      code === 39 ||
      code === 40 ||
      key === "ArrowRight" ||
      key === "ArrowDown"
    ) {
      blockEvent(event);

      selectedIndex++;

      if (selectedIndex >= channelNames.length) {
        selectedIndex = 0;
      }

      selectChannel();
      return false;
    }

    if (code === 13 || key === "Enter") {
      blockEvent(event);
      activateSelected();
      return false;
    }

    if (
      code === 10009 ||
      key === "Back" ||
      key === "Backspace"
    ) {
      blockEvent(event);

      if (window.history.length > 1) {
        window.history.back();
      }

      return false;
    }
  }

  function initialize() {
    addStyle();

    /*
     * Use only one listener.
     * Do not add another listener to document.
     */
    window.addEventListener(
      "keydown",
      handleKey,
      true
    );

    setTimeout(selectChannel, 1500);

    /*
     * Re-find the channel after website navigation
     * or dynamic content loading.
     */
    setInterval(function () {
      addStyle();

      if (
        !selectedElement ||
        !document.documentElement.contains(selectedElement)
      ) {
        selectChannel();
      }
    }, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
