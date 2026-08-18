/**
 * Knot network page.
 *
 * Lets a signed-in user search the account directory by username,
 * add/remove friends, see a friend's registered schools and joined open
 * clubs, and send/accept "combined club" invites. All of it goes through
 * window.KnotStore (js/store.js) — a shared Firestore database if one is
 * configured there, otherwise this browser's localStorage only. Every
 * read here is deliberately a fresh call (no local caching) so a friend
 * who just signed up elsewhere, or just accepted an invite, shows up
 * without needing a reload.
 */

(function () {
  "use strict";

  let els = {};
  let toastTimer = null;
  let inviteTargetEmail = null;
  let searchDebounce = null;

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

  async function getFullRegistry() {
    return [...(window.SCHOOL_REGISTRY || []), ...(await window.KnotStore.getCustomSchools())];
  }

  async function userActivity(user) {
    const [customSchools, memberships, registry] = await Promise.all([
      window.KnotStore.getCustomSchools(),
      window.KnotStore.getMemberships(),
      getFullRegistry()
    ]);
    const schools = customSchools.filter((s) => s.registeredBy === user.username);
    const clubs = [];

    registry.forEach((school) => {
      school.clubs.forEach((club) => {
        if (!window.KnotMembership) return;
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
  async function render() {
    const user = window.KnotAuth?.getCurrentUser?.();

    if (!user) {
      els.guard.hidden = false;
      els.content.hidden = true;
      return;
    }

    els.guard.hidden = true;
    els.content.hidden = false;

    await Promise.all([renderSearch(els.searchInput.value), renderInvites(user), renderFriends(user)]);
  }

  async function renderSearch(query) {
    const me = window.KnotAuth.getCurrentUser();
    const q = query.trim().toLowerCase();

    if (!q) {
      els.searchResults.hidden = true;
      els.searchResults.innerHTML = "";
      return;
    }

    const meEmail = me.email.toLowerCase();
    const [allUsers, friendEmails] = await Promise.all([
      window.KnotStore.getAllUsers(),
      window.KnotStore.getFriends(meEmail)
    ]);

    // The query may have changed while this was in flight.
    if (els.searchInput.value.trim().toLowerCase() !== q) return;

    const matches = Object.values(allUsers)
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
        const isFriend = friendEmails.includes(email);
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

  async function renderInvites(me) {
    const meEmail = me.email.toLowerCase();
    const invites = (await window.KnotStore.getInvitesFor(meEmail)).filter(
      (inv) => inv.status === "pending" && inv.toEmail === meEmail
    );

    els.invitesSection.hidden = invites.length === 0;
    els.invitesList.innerHTML = invites
      .map(
        (inv) => `
        <div class="invite-card" data-id="${escapeHtml(inv.id)}">
          <p>@${escapeHtml(inv.fromUsername)} wants to start "<strong>${escapeHtml(inv.clubName)}</strong>" with you.</p>
          ${inv.message ? `<p class="invite-card__message">"${escapeHtml(inv.message)}"</p>` : ""}
          <div class="friend-card__actions">
            <button class="profile-btn profile-btn--edit" type="button" data-action="accept" data-id="${escapeHtml(inv.id)}" data-from-username="${escapeHtml(inv.fromUsername)}" data-club-name="${escapeHtml(inv.clubName)}">Accept</button>
            <button class="profile-btn profile-btn--delete" type="button" data-action="decline" data-id="${escapeHtml(inv.id)}">Decline</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  async function renderFriends(me) {
    const meEmail = me.email.toLowerCase();
    const [friendEmails, allUsers] = await Promise.all([
      window.KnotStore.getFriends(meEmail),
      window.KnotStore.getAllUsers()
    ]);
    const friends = friendEmails.map((email) => allUsers[email]).filter(Boolean);

    els.friendsEmpty.hidden = friends.length > 0;

    const cards = await Promise.all(
      friends.map(async (f) => {
        const { schools, clubs } = await userActivity(f);
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
                <p class="friend-card__item"><strong>${escapeHtml(club.name)}</strong> — ${escapeHtml(school.name)}</p>
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
    );

    els.friendsList.innerHTML = cards.join("");
  }

  // ---------- invite modal ----------
  async function openInviteModal(email) {
    const all = await window.KnotStore.getAllUsers();
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

  async function submitInvite(e) {
    e.preventDefault();
    if (!inviteTargetEmail) return;

    const me = window.KnotAuth.getCurrentUser();
    const all = await window.KnotStore.getAllUsers();
    const target = all[inviteTargetEmail];
    if (!me || !target) return;

    const clubName = els.inviteClubName.value.trim();
    if (!clubName) {
      els.inviteError.textContent = "Give your proposed club a name.";
      return;
    }

    await window.KnotStore.addInvite({
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

    closeInviteModal();
    showToast(`Invite sent to @${target.username}.`);
  }

  async function respondToInvite(id, accept, fromUsername, clubName) {
    await window.KnotStore.updateInviteStatus(id, accept ? "accepted" : "declined");

    if (accept) {
      showToast(`You and @${fromUsername} are now planning "${clubName}" together!`);
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

    els.searchInput.addEventListener("input", () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => renderSearch(els.searchInput.value), 250);
    });

    els.searchResults.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const me = window.KnotAuth.getCurrentUser();
      if (!me) return;
      const meEmail = me.email.toLowerCase();
      const email = btn.dataset.email;

      if (btn.dataset.action === "add") {
        await window.KnotStore.addFriend(meEmail, email);
        showToast("Friend added.");
      } else if (btn.dataset.action === "remove") {
        await window.KnotStore.removeFriend(meEmail, email);
        showToast("Friend removed.");
      }
      render();
    });

    els.friendsList.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const me = window.KnotAuth.getCurrentUser();
      if (!me) return;

      if (btn.dataset.action === "invite") {
        openInviteModal(btn.dataset.email);
      } else if (btn.dataset.action === "remove") {
        await window.KnotStore.removeFriend(me.email.toLowerCase(), btn.dataset.email);
        showToast("Friend removed.");
        render();
      }
    });

    els.invitesList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      respondToInvite(btn.dataset.id, btn.dataset.action === "accept", btn.dataset.fromUsername, btn.dataset.clubName);
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
