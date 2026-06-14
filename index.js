(function () {
  console.log("✅ Murgi Live cursor module loaded");

  var cursorX = window.innerWidth / 2;
  var cursorY = window.innerHeight / 2;
  var step = 45;
  var cursor;

  function createCursor() {
    cursor = document.getElementById("tizen-fake-cursor");

    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = "tizen-fake-cursor";
      cursor.style.position = "fixed";
      cursor.style.width = "28px";
      cursor.style.height = "28px";
      cursor.style.borderRadius = "50%";
      cursor.style.background = "#00ff66";
      cursor.style.border = "4px solid white";
      cursor.style.boxShadow = "0 0 20px #00ff66";
      cursor.style.zIndex = "999999999";
      cursor.style.pointerEvents = "none";
      cursor.style.transform = "translate(-50%, -50%)";
      document.body.appendChild(cursor);
    }

    updateCursor();
  }

  function updateCursor() {
    cursorX = Math.max(10, Math.min(window.innerWidth - 10, cursorX));
    cursorY = Math.max(10, Math.min(window.innerHeight - 10, cursorY));

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    var el = document.elementFromPoint(cursorX, cursorY);
    if (el) {
      el.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: cursorX,
          clientY: cursorY
        })
      );
    }
  }

  function clickAtCursor() {
    var el = document.elementFromPoint(cursorX, cursorY);

    if (el) {
      el.dispatchEvent(
        new MouseEvent("mouseover", {
          bubbles: true,
          clientX: cursorX,
          clientY: cursorY
        })
      );

      el.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          clientX: cursorX,
          clientY: cursorY
        })
      );

      el.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
          clientX: cursorX,
          clientY: cursorY
        })
      );

      el.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          clientX: cursorX,
          clientY: cursorY
        })
      );
    }
  }

  function init() {
    var style = document.createElement("style");
    style.innerHTML = `
      body {
        background: #000 !important;
      }

      *:focus {
        outline: 4px solid #00ff66 !important;
        outline-offset: 4px !important;
      }
    `;
    document.documentElement.appendChild(style);

    createCursor();

    document.addEventListener(
      "keydown",
      function (event) {
        var code = event.keyCode;

        // Left
        if (code === 37) {
          cursorX -= step;
          event.preventDefault();
          updateCursor();
        }

        // Up
        else if (code === 38) {
          cursorY -= step;
          event.preventDefault();
          updateCursor();
        }

        // Right
        else if (code === 39) {
          cursorX += step;
          event.preventDefault();
          updateCursor();
        }

        // Down
        else if (code === 40) {
          cursorY += step;
          event.preventDefault();
          updateCursor();
        }

        // Enter / OK
        else if (code === 13) {
          event.preventDefault();
          clickAtCursor();
        }

        // Back
        else if (code === 10009) {
          event.preventDefault();

          if (window.history.length > 1) {
            window.history.back();
          } else {
            if (typeof tizen !== "undefined") {
              tizen.application.getCurrentApplication().exit();
            }
          }
        }

        // Play/Pause
        else if (code === 10252 || code === 415 || code === 19) {
          var video = document.querySelector("video");
          if (video) {
            video.paused ? video.play() : video.pause();
          }
        }

        // Stop
        else if (code === 413) {
          var v = document.querySelector("video");
          if (v) {
            v.pause();
            v.currentTime = 0;
          }
        }
      },
      true
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
