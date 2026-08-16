/**
 * Knot theme toggle (light/dark).
 *
 * The initial theme is set by a tiny inline script in <head> (before this
 * file loads) to avoid a flash of the wrong theme — see the `<script>`
 * right after <head> in index.html / profile.html. This file only wires
 * up the toggle button's click behavior.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "knot_theme";

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function init() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const next = currentTheme() === "light" ? "dark" : "light";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
