/**
 * Knot network page.
 *
 * Lets a signed-in user search the local account directory by username,
 * add/remove friends, see a friend's registered schools and joined open
 * clubs, and send/accept "combined club" invites. Everything lives in
 * localStorage alongside the rest of the demo's data:
 *   - clubsphere_friends:      { [emailLower]: [friendEmailLower, ...] } (symmetric)
 *   - clubsphere_club_invites: [ { id, fromEmail, fromUsername, fromName,
 *                                  toEmail, toUsername, clubName, message,
 *                                  status, createdAt } ]
 */

(function () {
  "use strict";

  const FRIENDS_KEY = "clubsphere_friends";
  const INVITES_KEY = "clubsphere_club_invites";
  const CUSTOM_SCHOOLS_KEY = "clubsphere_custom_schools";
  const MEMBERSHIPS_KEY = "clubsphere_memberships";

  let els = {};
  let toastTimer = null;
  let inviteTargetEmail = null;

  // ---------- storage ----------
  function getFriendsMap() {
    try {
      return JSON.parse(localStorage.getItem(FRIENDS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveFriendsMap(map) {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(map));
  }

  function getInvites() {
    try {
      return JSON.parse(localStorage.getItem(INVITES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveInvites(list) {
    localStorage.setItem(INVITES_KEY, JSON.stringify(list));
  }

  function getCustomSchools() {
    try {
      return JSON.parse(localStorage.getItem(CUSTOM_SCHOOLS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function getMemberships() {
    try {
      return JSON.parse(localStorage.getItem(MEMBERSHIPS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function getFullRegistry() {
    return [...(window.SCHOOL_REGISTRY || []), ...getCustomSchools()];
  }

  function getAllUsers() {
    return window.KnotAuth?.getAllUsers?.() || {};
  }

  function getFriendEmails(email) {
    return getFriendsMap()[email] || [];
  }

  function areFriends(emailA, emailB) {
    return getFriendEmails(emailA).includes(emailB);
  }

  function addFriend(emailA, emailB) {
    const map = getFriendsMap();
    map[emailA] = Array.from(new Set([...(map[emailA] || []), emailB]));
    map[emailB] = Array.from(new Set([...(map[emailB] || []), emailA]));
    saveFriendsMap(map);
  }

  function removeFriend(emailA, emailB) {
    const map = getFriendsMap();
    map[emailA] = (map[emailA] || []).filter((e) => e !== emailB);
    map[emailB] = (map[emailB] || []).filter((e) => e !== emailA);
    saveFriendsMap(map);
  }

  // ---------- helpers ----------
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function initials(name) {
    return (name || "?")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function avatarHtml(user, sizeClass) {
    return user.picture
      ? `<img class="${sizeClass}-img" src="${user.picture}" alt="" />`
      : initials(user.name || user.username);
  }

  function userActivity(user) {
    const schools = getCustomSchools().filter((s) => s.registeredBy === user.username);
    const memberships = getMemberships();
    const registry = getFullRegistry();
    const clubs = [];

    registry.forEach((school) => {
      school.clubs.forEach((club) => {
        if (!club.openMembership || !window.KnotMembership) return;
        const key = window.KnotMembership.getClubKey(school.id, club.name);
        const m = memberships[key];
        if (m && m.email && m.email.toLowerCase() === user.email.toLowerCase()) {
          clubs.push({ school, club });
        }
      });
    });

    return { schools, clubs };
  }

  // ---------- DOM ----------
  function cacheEls() {
    els = {
      guard: document.getElementById("networkGuard"),
      content: document.getElementById("networkContent"),
      guardSignInBtn: document.getElementById("guardSignInBtn"),

      searchInput: document.getElementById("userSearchInput"),
      searchResults: document.getElementById("searchResults"),

      invitesSection: document.getElementById("invitesSection"),
      invitesList: document.getElementById("invitesList"),

      friendsList: document.getElementById("friendsList"),
      friendsEmpty: document.getElementById("friendsEmpty"),

      inviteOverlay: document.getElementById("inviteOverlay"),
      inviteClose: document.getElementById("inviteClose"),
      inviteSub: document.getElementById("inviteSub"),
      inviteForm: document.getElementById("inviteForm"),
      inviteClubName: document.getElementById("inviteClubName"),
      inviteMessage: document.getElementById("inviteMessage"),
      inviteError: document.getElementById("inviteError"),

      toast: document.getElementById("toast"),
      toastMessage: document.getElementById("toastMessage")
    };
  }

  // ---------- render ----------
  function render() {
    const user = window.KnotAuth?.getCurrentUser?.();

    if (!user) {
      els.guard.hidden = false;
      els.content.hidden = true;
      return;
    }

    els.guard.hidden = true;
    els.content.hidden = false;

    renderSearch(els.searchInput.value);
    renderInvites(user);
    renderFriends(user);
  }

  function renderSearch(query) {
    const me = window.KnotAuth.getCurrentUser();
    const q = query.trim().toLowerCase();

    if (!q) {
      els.searchResults.hidden = true;
      els.searchResults.innerHTML = "";
      return;
    }

    const meEmail = me.email.toLowerCase();
    const matches = Object.values(getAllUsers())
      .filter((u) => u.username && u.email.toLowerCase() !== meEmail && u.username.toLowerCase().includes(q))
      .slice(0, 12);

    els.searchResults.hidden = false;

    if (matches.length === 0) {
      els.searchResults.innerHTML = `<p class="profile-empty">No users found for "${escapeHtml(query)}".</p>`;
      return;
    }

    els.searchResults.innerHTML = matches
      .map((u) => {
        const email = u.email.toLowerCase();
        const isFriend = areFriends(meEmail, email);
        return `
          <div class="search-result">
            <span class="friend-card__avatar">${avatarHtml(u, "friend-card__avatar")}</span>
            <div class="search-result__body">
              <strong>${escapeHtml(u.name || u.username)}</strong>
              <span>@${escapeHtml(u.username)}</span>
            </div>
            <button class="profile-btn ${isFriend ? "profile-btn--delete" : "profile-btn--edit"}" type="button"
              data-action="${isFriend ? "remove" : "add"}" data-email="${escapeHtml(email)}">
              ${isFriend ? "Remove Friend" : "Add Friend"}
            </button>
          </div>
        `;
      })
      .join("");
  }

  function renderInvites(me) {
    const meEmail = me.email.toLowerCase();
    const invites = getInvites().filter((inv) => inv.status === "pending" && inv.toEmail === meEmail);

    els.invitesSection.hidden = invites.length === 0;
    els.invitesList.innerHTML = invites
      .map(
        (inv) => `
        <div class="invite-card" data-id="${escapeHtml(inv.id)}">
          <p>@${escapeHtml(inv.fromUsername)} wants to start "<strong>${escapeHtml(inv.clubName)}</strong>" with you.</p>
          ${inv.message ? `<p class="invite-card__message">"${escapeHtml(inv.message)}"</p>` : ""}
          <div class="friend-card__actions">
            <button class="profile-btn profile-btn--edit" type="button" data-action="accept" data-id="${escapeHtml(inv.id)}">Accept</button>
            <button class="profile-btn profile-btn--delete" type="button" data-action="decline" data-id="${escapeHtml(inv.id)}">Decline</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  function renderFriends(me) {
    const meEmail = me.email.toLowerCase();
    const all = getAllUsers();
    const friends = getFriendEmails(meEmail)
      .map((email) => all[email])
      .filter(Boolean);

    els.friendsEmpty.hidden = friends.length > 0;
    els.friendsList.innerHTML = friends
      .map((f) => {
        const { schools, clubs } = userActivity(f);
        const email = f.email.toLowerCase();

        const schoolsHtml = schools.length
          ? `<div class="friend-card__section"><h5>Schools registered</h5>${schools
              .map(
                (s) => `
                <p class="friend-card__item">
                  <strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.city)}, ${escapeHtml(s.country)}
                  <span class="friend-card__desc">${escapeHtml(s.description || "")}</span>
                </p>
              `
              )
              .join("")}</div>`
          : "";

        const clubsHtml = clubs.length
          ? `<div class="friend-card__section"><h5>Clubs joined</h5>${clubs
              .map(
                ({ school, club }) => `
                <p class="friend-card__item">${club.icon || "🏷️"} <strong>${escapeHtml(club.name)}</strong> — ${escapeHtml(school.name)}</p>
              `
              )
              .join("")}</div>`
          : "";

        return `
          <div class="friend-card">
            <div class="friend-card__header">
              <span class="friend-card__avatar">${avatarHtml(f, "friend-card__avatar")}</span>
              <div>
                <h4>${escapeHtml(f.name || f.username)}</h4>
                <p>@${escapeHtml(f.username)}</p>
              </div>
            </div>
            <div class="friend-card__stats">
              <span>${schools.length} school${schools.length === 1 ? "" : "s"} registered</span>
              <span>${clubs.length} club${clubs.length === 1 ? "" : "s"} joined</span>
            </div>
            ${schoolsHtml}
            ${clubsHtml}
            <div class="friend-card__actions">
              <button class="profile-btn profile-btn--edit" type="button" data-action="invite" data-email="${escapeHtml(email)}">Invite to combined club</button>
              <button class="profile-btn profile-btn--delete" type="button" data-action="remove" data-email="${escapeHtml(email)}">Remove friend</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ---------- invite modal ----------
  function openInviteModal(email) {
    const all = getAllUsers();
    const target = all[email];
    if (!target) return;

    inviteTargetEmail = email;
    els.inviteSub.textContent = `Propose a club you and @${target.username} could run together across your schools.`;
    els.inviteForm.reset();
    els.inviteError.textContent = "";
    els.inviteOverlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
    els.inviteClubName.focus();
  }

  function closeInviteModal() {
    els.inviteOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    inviteTargetEmail = null;
  }

  function submitInvite(e) {
    e.preventDefault();
    if (!inviteTargetEmail) return;

    const me = window.KnotAuth.getCurrentUser();
    const all = getAllUsers();
    const target = all[inviteTargetEmail];
    if (!me || !target) return;

    const clubName = els.inviteClubName.value.trim();
    if (!clubName) {
      els.inviteError.textContent = "Give your proposed club a name.";
      return;
    }

    const invites = getInvites();
    invites.push({
      id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      fromEmail: me.email.toLowerCase(),
      fromUsername: me.username,
      fromName: me.name || me.username,
      toEmail: inviteTargetEmail,
      toUsername: target.username,
      clubName,
      message: els.inviteMessage.value.trim(),
      status: "pending",
      createdAt: new Date().toISOString()
    });
    saveInvites(invites);

    closeInviteModal();
    showToast(`Invite sent to @${target.username}.`);
  }

  function respondToInvite(id, accept) {
    const invites = getInvites();
    const invite = invites.find((inv) => inv.id === id);
    if (!invite) return;

    invite.status = accept ? "accepted" : "declined";
    saveInvites(invites);

    if (accept) {
      showToast(`You and @${invite.fromUsername} are now planning "${invite.clubName}" together!`);
    }

    render();
  }

  // ---------- toast ----------
  function showToast(message) {
    els.toastMessage.textContent = message;
    els.toast.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("is-open"), 3200);
  }

  // ---------- init ----------
  function init() {
    cacheEls();
    render();
    document.addEventListener("knot:authchange", render);

    els.guardSignInBtn.addEventListener("click", () => {
      document.getElementById("signInBtn")?.click();
    });

    els.searchInput.addEventListener("input", () => renderSearch(els.searchInput.value));

    els.searchResults.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const me = window.KnotAuth.getCurrentUser();
      if (!me) return;
      const meEmail = me.email.toLowerCase();
      const email = btn.dataset.email;

      if (btn.dataset.action === "add") {
        addFriend(meEmail, email);
        showToast("Friend added.");
      } else if (btn.dataset.action === "remove") {
        removeFriend(meEmail, email);
        showToast("Friend removed.");
      }
      render();
    });

    els.friendsList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const me = window.KnotAuth.getCurrentUser();
      if (!me) return;

      if (btn.dataset.action === "invite") {
        openInviteModal(btn.dataset.email);
      } else if (btn.dataset.action === "remove") {
        removeFriend(me.email.toLowerCase(), btn.dataset.email);
        showToast("Friend removed.");
        render();
      }
    });

    els.invitesList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      respondToInvite(btn.dataset.id, btn.dataset.action === "accept");
    });

    els.inviteClose.addEventListener("click", closeInviteModal);
    els.inviteOverlay.addEventListener("click", (e) => {
      if (e.target === els.inviteOverlay) closeInviteModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.inviteOverlay.classList.contains("is-open")) closeInviteModal();
    });
    els.inviteForm.addEventListener("submit", submitInvite);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
