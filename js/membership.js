/**
 * Knot club membership.
 *
 * Most clubs in the registry only make sense for enrolled students, but a
 * handful are flagged `openMembership: true` in js/data.js — these are
 * explicitly virtual/open chapters (online coding collectives, remote MUN
 * conferences, etc.) that any visitor can join. This file renders the
 * "Join this club" UI for those clubs only, and stores membership locally.
 *
 * js/app.js calls window.KnotMembership.getClubKey() and
 * .renderJoinBlock() while building each club card's HTML; this file then
 * handles all the click/submit interaction via event delegation on the
 * #modalClubs container (which stays in the DOM across modal re-renders).
 */

(function () {
  "use strict";

  async function saveMembership(clubKey, name, email) {
    await window.KnotStore.saveMembership(clubKey, { name, email, joinedAt: new Date().toISOString() });
  }

  function slugify(str) {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getClubKey(schoolId, clubName) {
    return `${schoolId}::${slugify(clubName)}`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  // ---------- rendering ----------
  // Inner markup only (no wrapping .club-join div) — reused by the full
  // block below and to restore a card after cancelling the inline form.
  function renderPrompt(clubKey, clubName, joinNote) {
    const user = window.KnotAuth?.getCurrentUser?.();
    const joinBtn = user
      ? `<button class="club-join__btn" type="button" data-club-key="${clubKey}" data-club-name="${escapeHtml(clubName)}" data-quick="1">Join as @${escapeHtml(user.username)}</button>`
      : `<button class="club-join__btn" type="button" data-club-key="${clubKey}" data-club-name="${escapeHtml(clubName)}">Join this club</button>`;
    return `
      <p class="club-join__note">🌍 ${escapeHtml(joinNote)}</p>
      ${joinBtn}
    `;
  }

  function renderJoinBlock(memberships, clubKey, clubName, joinNote) {
    const existing = memberships[clubKey] || null;

    if (existing) {
      return `
        <div class="club-join club-join--done" data-club-key="${clubKey}" data-note="${escapeHtml(joinNote)}" data-name="${escapeHtml(clubName)}">
          <span class="club-join__check">✓</span>
          <span>You've joined this club's global chapter${existing.name ? ` as ${escapeHtml(existing.name)}` : ""}.</span>
        </div>
      `;
    }

    return `
      <div class="club-join" data-club-key="${clubKey}" data-note="${escapeHtml(joinNote)}" data-name="${escapeHtml(clubName)}">
        ${renderPrompt(clubKey, clubName, joinNote)}
      </div>
    `;
  }

  function renderForm(container) {
    container.classList.remove("club-join--done");
    container.innerHTML = `
      <form class="club-join__form">
        <input type="text" class="club-join__name" placeholder="Your name" required maxlength="60" autocomplete="off" />
        <input type="email" class="club-join__email" placeholder="Your email" required maxlength="100" autocomplete="off" />
        <div class="club-join__actions">
          <button type="submit" class="club-join__submit">Confirm</button>
          <button type="button" class="club-join__cancel">Cancel</button>
        </div>
      </form>
    `;
  }

  function renderInitial(container) {
    container.classList.remove("club-join--done");
    container.innerHTML = renderPrompt(container.dataset.clubKey, container.dataset.name, container.dataset.note);
  }

  function renderDone(container, name) {
    container.innerHTML = `
      <span class="club-join__check">✓</span>
      <span>You've joined this club's global chapter${name ? ` as ${escapeHtml(name)}` : ""}.</span>
    `;
    container.classList.add("club-join--done");
  }

  // ---------- interaction ----------
  function handleClick(e) {
    const joinBtn = e.target.closest(".club-join__btn");
    if (joinBtn) {
      const container = joinBtn.closest(".club-join");
      const clubKey = joinBtn.dataset.clubKey;
      const clubName = joinBtn.dataset.clubName;

      if (joinBtn.dataset.quick === "1") {
        const user = window.KnotAuth?.getCurrentUser?.();
        saveMembership(clubKey, user?.name || user?.username || "", user?.email || "");
        renderDone(container, user?.name || user?.username);
        return;
      }

      renderForm(container);
      return;
    }

    const cancelBtn = e.target.closest(".club-join__cancel");
    if (cancelBtn) {
      renderInitial(cancelBtn.closest(".club-join"));
    }
  }

  function handleSubmit(e) {
    const form = e.target.closest(".club-join__form");
    if (!form) return;
    e.preventDefault();

    const container = form.closest(".club-join");
    const clubKey = container.dataset.clubKey;
    const name = form.querySelector(".club-join__name").value.trim();
    const email = form.querySelector(".club-join__email").value.trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector(".club-join__email").style.borderColor = "var(--accent-3)";
      return;
    }

    saveMembership(clubKey, name, email);
    renderDone(container, name);
  }

  function init() {
    const modalClubs = document.getElementById("modalClubs");
    if (!modalClubs) return;
    modalClubs.addEventListener("click", handleClick);
    modalClubs.addEventListener("submit", handleSubmit);
  }

  window.KnotMembership = {
    getClubKey,
    renderJoinBlock
  };

  document.addEventListener("DOMContentLoaded", init);
})();
