/**
 * Shared club-row editor — builds the repeatable "club row" UI (name,
 * category, meets, description + remove button) used by any form that edits
 * a school's club list. js/register.js keeps its own copy of this (it
 * predates this file and already works); js/profile.js's edit-school form
 * uses this shared version instead of duplicating it again.
 */

(function () {
  "use strict";

  function escapeAttr(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML.replace(/"/g, "&quot;");
  }

  function createRowManager(container) {
    function addRow(data) {
      const row = document.createElement("div");
      row.className = "club-row";
      row.innerHTML = `
        <div class="club-row__grid">
          <input type="text" class="club-name" maxlength="60" placeholder="Club name" value="${escapeAttr(data?.name)}" />
          <input type="text" class="club-category" maxlength="40" placeholder="Category" list="clubCategoryList" value="${escapeAttr(data?.category)}" />
        </div>
        <input type="text" class="club-row__line club-meets" maxlength="60" placeholder="Meets — e.g. Tue & Thu, 4:00 PM" value="${escapeAttr(data?.meets)}" />
        <input type="text" class="club-row__line club-desc" maxlength="140" placeholder="What does this club do?" value="${escapeAttr(data?.description)}" />
        <button type="button" class="club-row__remove">Remove club</button>
      `;

      row.querySelector(".club-row__remove").addEventListener("click", () => {
        row.remove();
        if (container.children.length === 0) addRow();
        syncRemoveButtons();
      });

      container.appendChild(row);
      syncRemoveButtons();
    }

    function syncRemoveButtons() {
      const buttons = container.querySelectorAll(".club-row__remove");
      buttons.forEach((btn) => {
        btn.disabled = buttons.length <= 1;
      });
    }

    function collectClubs() {
      return Array.from(container.querySelectorAll(".club-row"))
        .map((row) => ({
          name: row.querySelector(".club-name").value.trim(),
          category: row.querySelector(".club-category").value.trim() || "General",
          meets: row.querySelector(".club-meets").value.trim() || "TBD",
          description: row.querySelector(".club-desc").value.trim() || "No description yet."
        }))
        .filter((club) => club.name);
    }

    function reset(rows) {
      container.innerHTML = "";
      if (rows && rows.length) {
        rows.forEach((row) => addRow(row));
      } else {
        addRow();
      }
    }

    return { addRow, collectClubs, reset, syncRemoveButtons };
  }

  window.KnotClubRowEditor = { createRowManager };
})();
