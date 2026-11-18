/**
* Light / dark theme switch.
*
* Loaded from <head> so the theme is settled before the first paint (no flash
* of the wrong palette). Dark is the default; only an explicit "light" choice
* in localStorage turns it off. The toggle button (#theme-toggle) is wired up
* once the DOM is ready, and the choice is kept in localStorage under "theme".
* Exposed to the Chart.js charts so their labels stay readable.
*/
(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  function isDark() {
    return root.getAttribute("data-theme") === "dark";
  }

  function storedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyChartTheme() {
    if (!window.Chart || !window.Chart.defaults || !window.Chart.defaults.global) return;
    var global = window.Chart.defaults.global;
    global.defaultFontColor = isDark() ? "#c9d1d9" : "#666";
    global.defaultColor = isDark() ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
    if (window.Chart.instances) {
      Object.keys(window.Chart.instances).forEach(function (id) {
        window.Chart.instances[id].update();
      });
    }
  }

  function syncButton() {
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    var label = isDark() ? "Switch to light mode" : "Switch to dark mode";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", isDark() ? "true" : "false");
  }

  /* Only the word cloud for the active theme is ever requested. */
  function syncWordcloud() {
    var img = document.getElementById("wordcloud");
    if (!img) return;
    var src = img.getAttribute(isDark() ? "data-dark-src" : "data-light-src");
    if (src && img.getAttribute("src") !== src) {
      img.setAttribute("src", src);
    }
  }

  function apply(theme, persist) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* private mode / storage disabled: the theme still applies for this page */
      }
    }
    syncButton();
    syncWordcloud();
    applyChartTheme();
  }

  apply(storedTheme() === "light" ? "light" : "dark", false);

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.addEventListener("click", function () {
        apply(isDark() ? "light" : "dark", true);
      });
    }
    syncButton();
    syncWordcloud();
    applyChartTheme();
  });
})();
