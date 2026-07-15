(function () {
  "use strict";

  console.log("✅ Murgi Live TV cursor module loaded");

  var cursorX = Math.floor(window.innerWidth / 2);
  var cursorY = Math.floor(window.innerHeight / 2);

  var step = 45;
  var cursorId = "murgi-tv-cursor";
  var debugId = "murgi-tv-debug";
  var styleId = "murgi-tv-style";

  var lastEnterTime = 0;
  var initialized = false;

  function getRoot() {
    return document.body || document.documentElement;
  }

  /* -------------------------------------------------------
     CSS
  ------------------------------------------------------- */

  function addStyle() {
    if (document.getElementById(styleId)) {
      return;
    }

    var style = document.createElement("style");
    style.id = styleId;

    style.textContent =
      "#murgi-tv-cursor {" +
      "position: fixed !important;" +
      "left: 0 !important;" +
      "top: 0 !important;" +
      "width: 48px !important;" +
      "height: 48px !important;" +
      "z-index: 2147483647 !important;" +
      "display: block !important;" +
      "visibility: visible !important;" +
      "opacity: 1 !important;" +
      "pointer-events: none !important;" +
      "margin: 0 !important;" +
      "padding: 0 !important;" +
      "border: 0 !important;" +
      "background: transparent !important;" +
      "transform: translate(-4px, -4px) !important;" +
      "filter: none !important;" +
      "overflow: visible !important;" +
      "}" +

      "#murgi-tv-cursor svg {" +
      "display: block !important;" +
      "width: 48px !important;" +
      "height: 48px !important;" +
      "overflow: visible !important;" +
      "pointer-events: none !important;" +
      "}" +

      "#murgi-tv-debug {" +
      "position: fixed !important;" +
      "left: 20px !important;" +
      "bottom: 20px !important;" +
      "z-index: 2147483646 !important;" +
      "display: block !important;" +
      "visibility: visible !important;" +
      "opacity: 1 !important;" +
      "background: rgba(0, 0, 0, 0.90) !important;" +
      "color: #00ff66 !important;" +
      "padding: 10px 14px !important;" +
      "font-size: 18px !important;" +
      "font-family: Arial, sans-serif !important;" +
      "font-weight: bold !important;" +
      "border: 2px solid #00ff66 !important;" +
      "border-radius: 10px !important;" +
      "box-shadow: 0 0 15px rgba(0, 255, 102, 0.5) !important;" +
      "pointer-events: none !important;" +
      "}" +

      "a.murgi-hover, button.murgi-hover, " +
      "[role='button'].murgi-hover {" +
      "outline: 5px solid #00ff66 !important;" +
      "outline-offset: 4px !important;" +
      "}";

    document.documentElement.appendChild(style);
  }

  /* -------------------------------------------------------
     Debug box
  ------------------------------------------------------- */

  function showDebug(text) {
    var debug = document.getElementById(debugId);

    if (!debug) {
      debug = document.createElement("div");
      debug.id = debugId;
      getRoot().appendChild(debug);
    }

    debug.textContent = text;
  }

  /* -------------------------------------------------------
     Cursor
  ------------------------------------------------------- */

  function createCursor() {
    var cursor = document.getElementById(cursorId);

    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = cursorId;

      /*
       * White and green mouse-pointer SVG.
       * The small red circle marks the actual click point.
       */
      cursor.innerHTML =
        '<svg viewBox="0 0 48 48" ' +
        'xmlns="http://www.w3.org/2000/svg">' +

        '<path d="M5 3 L5 37 L14 29 L21 44 ' +
        'L29 40 L22 26 L36 26 Z" ' +
        'fill="#00ff66" ' +
        'stroke="#ffffff" ' +
        'stroke-width="3" ' +
        'stroke-linejoin="round"/>' +

        '<circle cx="5" cy="3" r="3.5" ' +
        'fill="#ff3030" ' +
        'stroke="#ffffff" ' +
        'stroke-width="1.5"/>' +

        "</svg>";

      getRoot().appendChild(cursor);
    }

    updateCursor();
  }

  function updateCursor() {
    var cursor = document.getElementById(cursorId);

    if (!cursor) {
      return;
    }

    cursorX = Math.max(
      5,
      Math.min(window.innerWidth - 40, cursorX)
    );

    cursorY = Math.max(
      5,
      Math.min(window.innerHeight - 45, cursorY)
    );

    /*
     * Important fix:
     * Inline values are also marked important.
     */
    cursor.style.setProperty(
      "left",
      cursorX + "px",
      "important"
    );

    cursor.style.setProperty(
      "top",
      cursorY + "px",
      "important"
    );

    cursor.style.setProperty(
      "display",
      "block",
      "important"
    );

    cursor.style.setProperty(
      "visibility",
      "visible",
      "important"
    );

    updateHoveredElement();

    showDebug(
      "Murgi cursor | X: " +
      cursorX +
      " Y: " +
      cursorY
    );
  }

  /* -------------------------------------------------------
     Find element under cursor
  ------------------------------------------------------- */

  function elementUnderCursor() {
    var cursor = document.getElementById(cursorId);
    var element;

    if (cursor) {
      cursor.style.setProperty(
        "display",
        "none",
        "important"
      );
    }

    element = document.elementFromPoint(cursorX, cursorY);

    if (cursor) {
      cursor.style.setProperty(
        "display",
        "block",
        "important"
      );
    }

    return element;
  }

  function findClickableElement(element) {
    var originalElement = element;

    while (
      element &&
      element !== document.body &&
      element !== document.documentElement
    ) {
      var tag = element.tagName
        ? element.tagName.toUpperCase()
        : "";

      var role = element.getAttribute
        ? element.getAttribute("role")
        : "";

      if (
        tag === "A" ||
        tag === "BUTTON" ||
        tag === "INPUT" ||
        tag === "SELECT" ||
        tag === "TEXTAREA" ||
        tag === "VIDEO" ||
        role === "button" ||
        role === "link" ||
        typeof element.onclick === "function" ||
        element.tabIndex >= 0
      ) {
        return element;
      }

      element = element.parentElement;
    }

    return originalElement;
  }

  /* -------------------------------------------------------
     Hover outline
  ------------------------------------------------------- */

  function clearHoverClasses() {
    var hovered = document.querySelectorAll(".murgi-hover");
    var i;

    for (i = 0; i < hovered.length; i++) {
      hovered[i].classList.remove("murgi-hover");
    }
  }

  function updateHoveredElement() {
    clearHoverClasses();

    var element = elementUnderCursor();
    var clickable = findClickableElement(element);

    if (
      clickable &&
      clickable.classList &&
      clickable !== document.body &&
      clickable !== document.documentElement
    ) {
      clickable.classList.add("murgi-hover");
    }
  }

  /* -------------------------------------------------------
     Mouse events and clicking
  ------------------------------------------------------- */

  function dispatchMouseEvent(element, type) {
    if (!element) {
      return;
    }

    var event = document.createEvent("MouseEvents");

    event.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      cursorX,
      cursorY,
      cursorX,
      cursorY,
      false,
      false,
      false,
      false,
      0,
      null
    );

    element.dispatchEvent(event);
  }

  function clickAtCursor() {
    var element = elementUnderCursor();
    var clickable;

    if (!element) {
      showDebug("Nothing found under cursor");
      return;
    }

    clickable = findClickableElement(element);

    showDebug(
      "Click: " +
      clickable.tagName +
      " | X: " +
      cursorX +
      " Y: " +
      cursorY
    );

    try {
      if (typeof clickable.focus === "function") {
        clickable.focus();
      }
    } catch (error) {}

    dispatchMouseEvent(clickable, "mouseover");
    dispatchMouseEvent(clickable, "mouseenter");
    dispatchMouseEvent(clickable, "mousemove");
    dispatchMouseEvent(clickable, "mousedown");
    dispatchMouseEvent(clickable, "mouseup");
    dispatchMouseEvent(clickable, "click");
  }

  /* -------------------------------------------------------
     Video control
  ------------------------------------------------------- */

  function toggleVideo() {
    var video = document.querySelector("video");

    if (!video) {
      showDebug("No video element found");
      return;
    }

    if (video.paused) {
      var playResult = video.play();

      if (
        playResult &&
        typeof playResult.catch === "function"
      ) {
        playResult.catch(function () {});
      }

      showDebug("Video playing");
    } else {
      video.pause();
      showDebug("Video paused");
    }
  }

  function stopVideo() {
    var video = document.querySelector("video");

    if (!video) {
      showDebug("No video element found");
      return;
    }

    video.pause();

    try {
      video.currentTime = 0;
    } catch (error) {}

    showDebug("Video stopped");
  }

  /* -------------------------------------------------------
     Remote handling
  ------------------------------------------------------- */

  function blockOriginalEvent(event) {
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

    if (code === 37 || key === "ArrowLeft") {
      blockOriginalEvent(event);
      cursorX -= step;
      updateCursor();
      return false;
    }

    if (code === 38 || key === "ArrowUp") {
      blockOriginalEvent(event);
      cursorY -= step;
      updateCursor();
      return false;
    }

    if (code === 39 || key === "ArrowRight") {
      blockOriginalEvent(event);
      cursorX += step;
      updateCursor();
      return false;
    }

    if (code === 40 || key === "ArrowDown") {
      blockOriginalEvent(event);
      cursorY += step;
      updateCursor();
      return false;
    }

    if (code === 13 || key === "Enter") {
      blockOriginalEvent(event);

      /*
       * Stops one remote press from clicking repeatedly.
       */
      var currentTime = new Date().getTime();

      if (currentTime - lastEnterTime > 350) {
        lastEnterTime = currentTime;
        clickAtCursor();
      }

      return false;
    }

    if (
      code === 10009 ||
      key === "Back" ||
      key === "Backspace"
    ) {
      blockOriginalEvent(event);

      if (window.history.length > 1) {
        window.history.back();
      }

      return false;
    }

    if (
      code === 10252 ||
      code === 415 ||
      key === "MediaPlayPause" ||
      key === "MediaPlay"
    ) {
      blockOriginalEvent(event);
      toggleVideo();
      return false;
    }

    if (
      code === 19 ||
      key === "MediaPause"
    ) {
      blockOriginalEvent(event);

      var videoPause = document.querySelector("video");

      if (videoPause) {
        videoPause.pause();
      }

      showDebug("Video paused");
      return false;
    }

    if (
      code === 413 ||
      key === "MediaStop"
    ) {
      blockOriginalEvent(event);
      stopVideo();
      return false;
    }
  }

  /* -------------------------------------------------------
     Initialize
  ------------------------------------------------------- */

  function initialize() {
    if (initialized) {
      return;
    }

    initialized = true;

    addStyle();
    createCursor();

    showDebug(
      "Murgi cursor ready | X: " +
      cursorX +
      " Y: " +
      cursorY
    );

    /*
     * Capture mode lets this code receive remote keys
     * before most website handlers.
     */
    window.addEventListener("keydown", handleKey, true);

    /*
     * Recreate cursor if the website is a SPA and replaces
     * its body or removes injected elements.
     */
    setInterval(function () {
      addStyle();
      createCursor();
    }, 1500);

    window.addEventListener("resize", function () {
      cursorX = Math.min(cursorX, window.innerWidth - 40);
      cursorY = Math.min(cursorY, window.innerHeight - 45);
      updateCursor();
    });
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
