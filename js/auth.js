/**
 * Knot authentication.
 *
 * Sign up / log in with Google. New accounts must pick a unique username,
 * checked against every other account in the local registry.
 *
 * This site has no backend, so accounts live in localStorage:
 *   - clubsphere_users:   { [emailLowercase]: { email, name, picture, username, createdAt } }
 *   - clubsphere_session: emailLowercase of the signed-in user, or absent
 *
 * To enable REAL Google sign-in:
 *   1. Create an OAuth Client ID at https://console.cloud.google.com/apis/credentials
 *      (Application type: Web application).
 *   2. Add this site's URL(s) under "Authorized JavaScript origins".
 *   3. Paste the Client ID into CONFIG.GOOGLE_CLIENT_ID below.
 * Until a Client ID is set, the button opens a simulated Google account
 * picker so sign-up/login can still be tested end to end.
 */

(function () {
  "use strict";

  const CONFIG = {
    GOOGLE_CLIENT_ID: "710729698743-i9tjrhbmiqceuhd288lpj61ll732l0vh.apps.googleusercontent.com"
  };

  const USERS_KEY = "clubsphere_users";
  const SESSION_KEY = "clubsphere_session";
  const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

  const DEMO_ACCOUNTS = [
    { name: "Amara Okafor", email: "amara.okafor@gmail.com" },
    { name: "Liam Chen", email: "liam.chen@gmail.com" }
  ];

  let els = {};
  let pendingProfile = null;

  // ---------- storage helpers ----------
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSessionEmail() {
    return localStorage.getItem(SESSION_KEY);
  }

  function setSessionEmail(email) {
    if (email) localStorage.setItem(SESSION_KEY, email);
    else localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentUser() {
    const email = getSessionEmail();
    if (!email) return null;
    return getUsers()[email] || null;
  }

  function updateCurrentUser(updates) {
    const email = getSessionEmail();
    if (!email) return null;
    const users = getUsers();
    if (!users[email]) return null;
    users[email] = { ...users[email], ...updates };
    saveUsers(users);
    renderAuthArea();
    return users[email];
  }

  function isUsernameTaken(username, exceptEmail) {
    const lower = username.toLowerCase();
    return Object.entries(getUsers()).some(
      ([email, u]) => u.username && u.username.toLowerCase() === lower && email !== exceptEmail
    );
  }

  // ---------- DOM ----------
  function cacheEls() {
    els = {
      authArea: document.getElementById("authArea"),
      authOverlay: document.getElementById("authOverlay"),
      authClose: document.getElementById("authClose"),
      stepGoogle: document.getElementById("authStepGoogle"),
      stepUsername: document.getElementById("authStepUsername"),
      googleBtnContainer: document.getElementById("googleBtnContainer"),
      demoGoogleBtn: document.getElementById("demoGoogleBtn"),
      authDemoNote: document.getElementById("authDemoNote"),
      authAvatar: document.getElementById("authAvatar"),
      authWelcome: document.getElementById("authWelcome"),
      usernameInput: document.getElementById("usernameInput"),
      usernameStatus: document.getElementById("usernameStatus"),
      usernameHint: document.getElementById("usernameHint"),
      usernameSubmit: document.getElementById("usernameSubmit"),
      pickerOverlay: document.getElementById("demoPickerOverlay"),
      pickerList: document.getElementById("googlePickerList"),
      pickerOtherBtn: document.getElementById("googlePickerOther"),
      pickerOtherForm: document.getElementById("pickerOtherForm"),
      otherName: document.getElementById("otherName"),
      otherEmail: document.getElementById("otherEmail"),
      otherContinue: document.getElementById("otherContinue")
    };
  }

  // ---------- auth modal ----------
  function openAuthModal() {
    resetAuthSteps();
    els.authOverlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeAuthModal() {
    els.authOverlay.classList.remove("is-open");
    if (!els.pickerOverlay.classList.contains("is-open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  function resetAuthSteps() {
    els.stepGoogle.hidden = false;
    els.stepUsername.hidden = true;
    els.usernameInput.value = "";
    setUsernameStatus("", "");
  }

  // ---------- real Google Identity Services ----------
  function initGoogleAuth() {
    if (!CONFIG.GOOGLE_CLIENT_ID) {
      els.demoGoogleBtn.hidden = false;
      els.authDemoNote.hidden = false;
      els.demoGoogleBtn.addEventListener("click", openDemoPicker);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });
      window.google.accounts.id.renderButton(els.googleBtnContainer, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 280
      });
    };
    document.head.appendChild(script);
  }

  function handleGoogleCredentialResponse(response) {
    const payload = decodeJwt(response.credential);
    if (!payload) return;
    onGoogleProfile({ name: payload.name, email: payload.email, picture: payload.picture });
  }

  // Client-side decode only, for demo purposes — a real backend should
  // verify the credential's signature before trusting it.
  function decodeJwt(token) {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(base64))));
    } catch {
      return null;
    }
  }

  // ---------- simulated Google account picker (demo mode) ----------
  function openDemoPicker() {
    els.pickerOtherForm.hidden = true;
    els.otherName.value = "";
    els.otherEmail.value = "";
    renderPickerList();
    els.pickerOverlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeDemoPicker() {
    els.pickerOverlay.classList.remove("is-open");
    if (!els.authOverlay.classList.contains("is-open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  function renderPickerList() {
    els.pickerList.innerHTML = DEMO_ACCOUNTS.map(
      (acc, i) => `
        <button class="google-picker__item" data-index="${i}" type="button">
          <span class="google-picker__avatar">${initials(acc.name)}</span>
          <span>
            <span class="google-picker__name">${escapeHtml(acc.name)}</span>
            <span class="google-picker__email">${escapeHtml(acc.email)}</span>
          </span>
        </button>
      `
    ).join("");

    els.pickerList.querySelectorAll(".google-picker__item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const acc = DEMO_ACCOUNTS[Number(btn.dataset.index)];
        closeDemoPicker();
        onGoogleProfile(acc);
      });
    });
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

  // ---------- shared post-auth flow ----------
  function onGoogleProfile(profile) {
    pendingProfile = profile;
    const emailLower = profile.email.toLowerCase();
    const users = getUsers();
    const existing = users[emailLower];

    if (existing && existing.username) {
      users[emailLower] = { ...existing, name: profile.name, picture: profile.picture || "" };
      saveUsers(users);
      setSessionEmail(emailLower);
      pendingProfile = null;
      closeAuthModal();
      renderAuthArea();
      return;
    }

    showUsernameStep(profile, existing);
  }

  function showUsernameStep(profile, existing) {
    els.stepGoogle.hidden = true;
    els.stepUsername.hidden = false;
    els.authAvatar.textContent = initials(profile.name || profile.email);
    els.authWelcome.textContent = `Signed in as ${profile.email}. Pick a username to finish setting up your account.`;
    els.usernameInput.value = existing?.username || suggestUsername(profile);
    validateUsername();
    els.usernameInput.focus();
    els.usernameInput.select();
  }

  function suggestUsername(profile) {
    const base =
      (profile.name || profile.email.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 16) || "user";
    let candidate = base;
    let n = 1;
    while (isUsernameTaken(candidate, null)) {
      candidate = `${base}${n}`;
      n++;
    }
    return candidate;
  }

  function validateUsername() {
    const value = els.usernameInput.value.trim();

    if (!value) {
      setUsernameStatus("", "");
      els.usernameSubmit.disabled = true;
      return;
    }
    if (!USERNAME_RE.test(value)) {
      setUsernameStatus("invalid", "3–20 characters: letters, numbers, and underscores only.");
      els.usernameSubmit.disabled = true;
      return;
    }

    const emailLower = pendingProfile ? pendingProfile.email.toLowerCase() : null;
    if (isUsernameTaken(value, emailLower)) {
      setUsernameStatus("taken", "That username is already taken — try another.");
      els.usernameSubmit.disabled = true;
      return;
    }

    setUsernameStatus("available", "Username is available.");
    els.usernameSubmit.disabled = false;
  }

  function setUsernameStatus(state, message) {
    els.usernameStatus.textContent = state === "available" ? "✓" : state ? "✕" : "";
    els.usernameStatus.className = `username-field__status username-field__status--${state}`;
    els.usernameHint.textContent = message || "3–20 characters: letters, numbers, and underscores only.";
    els.usernameHint.classList.toggle("username-hint--error", state === "taken" || state === "invalid");
  }

  function submitUsername() {
    if (els.usernameSubmit.disabled || !pendingProfile) return;

    const username = els.usernameInput.value.trim();
    const emailLower = pendingProfile.email.toLowerCase();
    const users = getUsers();

    users[emailLower] = {
      email: pendingProfile.email,
      name: pendingProfile.name || "",
      picture: pendingProfile.picture || "",
      username,
      createdAt: users[emailLower]?.createdAt || new Date().toISOString()
    };

    saveUsers(users);
    setSessionEmail(emailLower);
    pendingProfile = null;
    closeAuthModal();
    renderAuthArea();
  }

  // ---------- header rendering ----------
  function renderAuthArea() {
    const user = getCurrentUser();

    if (!user) {
      els.authArea.innerHTML = `<button class="auth-signin-btn" id="signInBtn" type="button">Sign In</button>`;
      document.getElementById("signInBtn").addEventListener("click", openAuthModal);
      document.dispatchEvent(new CustomEvent("knot:authchange"));
      return;
    }

    const avatarContent = user.picture
      ? `<img class="user-chip__avatar-img" src="${user.picture}" alt="" />`
      : initials(user.name || user.username);

    els.authArea.innerHTML = `
      <div class="user-chip" id="userChip">
        <span class="user-chip__avatar">${avatarContent}</span>
        <span class="user-chip__name">@${escapeHtml(user.username)}</span>
        <span class="user-chip__caret">▾</span>
        <div class="user-menu" id="userMenu">
          <div class="user-menu__info">
            <span class="user-menu__name">${escapeHtml(user.name || "")}</span>
            <span class="user-menu__email">${escapeHtml(user.email)}</span>
          </div>
          <a class="user-menu__link" href="profile.html">My Profile</a>
          <button class="user-menu__logout" id="logoutBtn" type="button">Log out</button>
        </div>
      </div>
    `;

    const chip = document.getElementById("userChip");
    chip.addEventListener("click", (e) => {
      if (e.target.id === "logoutBtn") return;
      chip.classList.toggle("is-open");
    });
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      setSessionEmail(null);
      renderAuthArea();
    });

    document.dispatchEvent(new CustomEvent("knot:authchange"));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  // ---------- init ----------
  function init() {
    cacheEls();
    renderAuthArea();
    initGoogleAuth();

    els.authClose.addEventListener("click", closeAuthModal);
    els.authOverlay.addEventListener("click", (e) => {
      if (e.target === els.authOverlay) closeAuthModal();
    });

    els.pickerOverlay.addEventListener("click", (e) => {
      if (e.target === els.pickerOverlay) closeDemoPicker();
    });
    els.pickerOtherBtn.addEventListener("click", () => {
      els.pickerOtherBtn.hidden = true;
      els.pickerList.hidden = true;
      els.pickerOtherForm.hidden = false;
      els.otherName.focus();
    });
    els.otherContinue.addEventListener("click", () => {
      const name = els.otherName.value.trim();
      const email = els.otherEmail.value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        els.otherEmail.style.borderColor = "var(--accent-3)";
        return;
      }
      els.pickerOtherBtn.hidden = false;
      els.pickerList.hidden = false;
      closeDemoPicker();
      onGoogleProfile({ name, email });
    });

    els.usernameInput.addEventListener("input", validateUsername);
    els.usernameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !els.usernameSubmit.disabled) submitUsername();
    });
    els.usernameSubmit.addEventListener("click", submitUsername);

    document.addEventListener("click", (e) => {
      const chip = document.getElementById("userChip");
      if (chip && !chip.contains(e.target)) chip.classList.remove("is-open");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (els.pickerOverlay.classList.contains("is-open")) closeDemoPicker();
      else if (els.authOverlay.classList.contains("is-open")) closeAuthModal();
    });
  }

  // ---------- Public API for js/register.js ----------
  window.KnotAuth = {
    getCurrentUser,
    updateCurrentUser
  };

  document.addEventListener("DOMContentLoaded", init);
})();
