(function () {
  console.log("✅ Murgi Live TizenBrew module loaded");

  var cursorX = Math.floor(window.innerWidth / 2);
  var cursorY = Math.floor(window.innerHeight / 2);
  var step = 45;

  var cursorId = "murgi-tv-cursor";
  var debugId = "murgi-tv-debug";
  var styleId = "murgi-tv-style";

  function getRoot() {
    return document.body || document.documentElement;
  }

  function addStyle() {
    if (document.getElementById(styleId)) return;

    var style = document.createElement("style");
    style.id = styleId;

    style.innerHTML =
      "#murgi-tv-cursor {" +
      "position: fixed !important;" +
      "left: 50% !important;" +
      "top: 50% !important;" +
      "width: 34px !important;" +
      "height: 34px !important;" +
      "border-radius: 50% !important;" +
      "background: #00ff66 !important;" +
      "border: 5px solid #ffffff !important;" +
      "box-shadow: 0 0 25px #00ff66 !important;" +
      "z-index: 2147483647 !important;" +
      "pointer-events: none !important;" +
      "transform: translate(-50%, -50%) !important;" +
      "display: block !important;" +
      "}" +

      "#murgi-tv-debug {" +
      "position: fixed !important;" +
      "left: 20px !important;" +
      "bottom: 20px !important;" +
      "z-index: 2147483646 !important;" +
      "background: rgba(0,0,0,0.90) !important;" +
      "color: #00ff66 !important;" +
      "padding: 10px 14px !important;" +
      "font-size: 20px !important;" +
      "font-family: Arial, sans-serif !important;" +
      "border: 2px solid #00ff66 !important;" +
      "border-radius: 10px !important;" +
      "pointer-events: none !important;" +
      "}" +

      "*:focus {" +
      "outline: 4px solid #00ff66 !important;" +
      "outline-offset: 4px !important;" +
      "}";

    document.documentElement.appendChild(style);
  }

  function showDebug(text) {
    var debug = document.getElementById(debugId);

    if (!debug) {
      debug = document.createElement("div");
      debug.id = debugId;
      getRoot().appendChild(debug);
    }

    debug.innerText = text;
  }

  function createCursor() {
    var cursor = document.getElementById(cursorId);

    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = cursorId;
      getRoot().appendChild(cursor);
    }

    updateCursor();
  }

  function updateCursor() {
    var cursor = document.getElementById(cursorId);
    if (!cursor) return;

    cursorX = Math.max(20, Math.min(window.innerWidth - 20, cursorX));
    cursorY = Math.max(20, Math.min(window.innerHeight - 20, cursorY));

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    showDebug("Murgi loaded | X: " + cursorX + " Y: " + cursorY);
  }

  function elementUnderCursor() {
    var cursor = document.getElementById(cursorId);

    if (cursor) cursor.style.display = "none";
    var el = document.elementFromPoint(cursorX, cursorY);
    if (cursor) cursor.style.display = "block";

    return el;
  }

  function dispatchMouse(el, type) {
    if (!el) return;

    var ev = document.createEvent("MouseEvents");

    ev.initMouseEvent(
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

    el.dispatchEvent(ev);
  }

  function clickAtCursor() {
    var el = elementUnderCursor();

    if (!el) {
      showDebug("No element under cursor");
      return;
    }

    showDebug("Clicked: " + el.tagName);

    dispatchMouse(el, "mouseover");
    dispatchMouse(el, "mousemove");
    dispatchMouse(el, "mousedown");
    dispatchMouse(el, "mouseup");
    dispatchMouse(el, "click");

    try {
      if (typeof el.click === "function") {
        el.click();
      }
    } catch (e) {}
  }

  function toggleVideo() {
    var video = document.querySelector("video");

    if (!video) {
      showDebug("No video found");
      return;
    }

    if (video.paused) {
      video.play();
      showDebug("Video play");
    } else {
      video.pause();
      showDebug("Video pause");
    }
  }

  function stopVideo() {
    var video = document.querySelector("video");

    if (!video) {
      showDebug("No video found");
      return;
    }

    video.pause();

    try {
      video.currentTime = 0;
    } catch (e) {}

    showDebug("Video stopped");
  }

  function handleKey(event) {
    var code = event.keyCode;
    var key = event.key || "";

    if (code === 37 || key === "ArrowLeft") {
      cursorX -= step;
      event.preventDefault();
      event.stopPropagation();
      updateCursor();
      return false;
    }

    if (code === 38 || key === "ArrowUp") {
      cursorY -= step;
      event.preventDefault();
      event.stopPropagation();
      updateCursor();
      return false;
    }

    if (code === 39 || key === "ArrowRight") {
      cursorX += step;
      event.preventDefault();
      event.stopPropagation();
      updateCursor();
      return false;
    }

    if (code === 40 || key === "ArrowDown") {
      cursorY += step;
      event.preventDefault();
      event.stopPropagation();
      updateCursor();
      return false;
    }

    if (code === 13 || key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      clickAtCursor();
      return false;
    }

    if (code === 10009 || key === "Back" || key === "Backspace") {
      event.preventDefault();
      event.stopPropagation();

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
      event.preventDefault();
      event.stopPropagation();
      toggleVideo();
      return false;
    }

    if (code === 19 || key === "MediaPause") {
      event.preventDefault();
      event.stopPropagation();

      var videoPause = document.querySelector("video");
      if (videoPause) videoPause.pause();

      showDebug("Video pause");
      return false;
    }

    if (code === 413 || key === "MediaStop") {
      event.preventDefault();
      event.stopPropagation();
      stopVideo();
      return false;
    }
  }

  function init() {
    addStyle();
    createCursor();
    showDebug("✅ Murgi Live module loaded");

    document.addEventListener("keydown", handleKey, true);
    window.addEventListener("keydown", handleKey, true);

    setInterval(function () {
      addStyle();
      createCursor();
      updateCursor();
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
