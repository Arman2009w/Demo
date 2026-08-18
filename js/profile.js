/**
 * Knot profile page.
 *
 * Shows the schools a signed-in user has registered (with edit/delete) and
 * the open-membership clubs they've joined (with leave). This page has no
 * in-memory registry of its own — js/app.js's registry only exists on
 * index.html — so it reads straight from window.KnotStore (js/store.js)
 * on every render instead.
 */

(function () {
  "use strict";

  const MAX_SOURCE_FILE_BYTES = 20 * 1024 * 1024; // 20MB, before compression
  const MAX_PHOTO_DIMENSION = 900;

  const BANNER_PALETTES = [
    ["#7c5cff", "#4a7bff"],
    ["#35e0c9", "#2f8f82"],
    ["#ff6b9d", "#7c5cff"],
    ["#22b8c9", "#4a7bff"],
    ["#ff9d6b", "#ff6b9d"],
    ["#4a7bff", "#35e0c9"],
    ["#a06bff", "#ff6b9d"],
    ["#3593d6", "#7c5cff"]
  ];

  let els = {};
  let clubEditor = null;
  let editingSchoolId = null;
  let selectedPhoto = null;
  let toastTimer = null;

  // ---------- storage ----------
  async function getFullRegistry() {
    return [...(window.SCHOOL_REGISTRY || []), ...(await window.KnotStore.getCustomSchools())];
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

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  function bannerGradient(id) {
    const [c1, c2] = BANNER_PALETTES[hashString(id) % BANNER_PALETTES.length];
    return `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
  }

  // ---------- DOM ----------
  function cacheEls() {
    els = {
      guard: document.getElementById("profileGuard"),
      content: document.getElementById("profileContent"),
      guardSignInBtn: document.getElementById("guardSignInBtn"),

      avatar: document.getElementById("profileAvatar"),
      avatarEditBtn: document.getElementById("avatarEditBtn"),
      avatarInput: document.getElementById("avatarInput"),
      avatarRemoveBtn: document.getElementById("avatarRemoveBtn"),
      name: document.getElementById("profileName"),
      username: document.getElementById("profileUsername"),
      email: document.getElementById("profileEmail"),

      statSchools: document.getElementById("statMySchools"),
      statClubs: document.getElementById("statMyClubs"),

      schoolsList: document.getElementById("myschoolsList"),
      schoolsEmpty: document.getElementById("myschoolsEmpty"),
      clubsList: document.getElementById("myclubsList"),
      clubsEmpty: document.getElementById("myclubsEmpty"),

      editOverlay: document.getElementById("editOverlay"),
      editClose: document.getElementById("editClose"),
      editForm: document.getElementById("editForm"),
      efName: document.getElementById("efName"),
      efCity: document.getElementById("efCity"),
      efCountry: document.getElementById("efCountry"),
      efContinent: document.getElementById("efContinent"),
      efFlag: document.getElementById("efFlag"),
      efStudents: document.getElementById("efStudents"),
      efFounded: document.getElementById("efFounded"),
      efDescription: document.getElementById("efDescription"),
      editClubRows: document.getElementById("editClubRows"),
      editAddClubBtn: document.getElementById("editAddClubBtn"),
      editError: document.getElementById("editError"),

      editPhotoUpload: document.getElementById("editPhotoUpload"),
      editPhotoInput: document.getElementById("efPhoto"),
      editPhotoPreview: document.getElementById("editPhotoPreview"),
      editPhotoRemove: document.getElementById("editPhotoRemove"),

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

    renderAvatar(user);
    els.name.textContent = user.name || `@${user.username}`;
    els.username.textContent = `@${user.username}`;
    els.email.textContent = user.email;

    const customSchools = await window.KnotStore.getCustomSchools();
    const mySchools = customSchools.filter((s) => s.registeredBy === user.username);
    const myClubs = await getJoinedClubs(user);

    els.statSchools.textContent = mySchools.length;
    els.statClubs.textContent = myClubs.length;

    renderSchools(mySchools);
    renderClubs(myClubs);
  }

  function renderSchools(schools) {
    els.schoolsEmpty.hidden = schools.length > 0;
    els.schoolsList.innerHTML = schools
      .map(
        (school) => `
        <div class="profile-school" data-school-id="${escapeHtml(school.id)}">
          <div class="profile-school__media" style="background-image: ${bannerGradient(school.id)}">
            ${
              school.photo
                ? `<img src="${school.photo}" alt="${escapeHtml(school.name)}" loading="lazy" onerror="this.remove()" />`
                : ""
            }
          </div>
          <div class="profile-school__body">
            <h4>${escapeHtml(school.name)}</h4>
            <p>${escapeHtml(school.city)}, ${escapeHtml(school.country)} · ${school.clubs.length} clubs</p>
          </div>
          <div class="profile-school__actions">
            <button class="profile-btn profile-btn--edit" type="button" data-action="edit" data-id="${escapeHtml(school.id)}">Edit</button>
            <button class="profile-btn profile-btn--delete" type="button" data-action="delete" data-id="${escapeHtml(school.id)}">Delete</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  async function getJoinedClubs(user) {
    if (!window.KnotMembership) return [];
    const memberships = await window.KnotStore.getMemberships();
    const registry = await getFullRegistry();
    const joined = [];

    registry.forEach((school) => {
      school.clubs.forEach((club) => {
        const key = window.KnotMembership.getClubKey(school.id, club.name);
        const membership = memberships[key];
        if (membership && membership.email && membership.email.toLowerCase() === user.email.toLowerCase()) {
          joined.push({ school, club, key });
        }
      });
    });

    return joined;
  }

  function renderClubs(joined) {
    els.clubsEmpty.hidden = joined.length > 0;
    els.clubsList.innerHTML = joined
      .map(
        ({ school, club, key }) => `
        <div class="profile-club">
          <div class="profile-club__body">
            <h4>${escapeHtml(club.name)}</h4>
            <p>${escapeHtml(school.name)} · ${escapeHtml(club.category)}</p>
          </div>
          <button class="profile-btn profile-btn--delete" type="button" data-action="leave" data-key="${escapeHtml(key)}">Leave</button>
        </div>
      `
      )
      .join("");
  }

  // ---------- profile picture ----------
  function renderAvatar(user) {
    if (user.picture) {
      els.avatar.innerHTML = `<img class="profile-card__avatar-img" src="${user.picture}" alt="" />`;
      els.avatarRemoveBtn.hidden = false;
    } else {
      els.avatar.textContent = initials(user.name || user.username);
      els.avatarRemoveBtn.hidden = true;
    }
  }

  function handleAvatarFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SOURCE_FILE_BYTES) {
      showToast("That image is too large — please choose a file under 20MB.");
      return;
    }

    window.KnotImageUtils.compressImage(file, 400, 0.85)
      .then((dataUrl) => window.KnotAuth.updateCurrentUser({ picture: dataUrl }))
      .then(() => {
        showToast("Profile picture updated.");
        render();
      })
      .catch(() => {
        showToast("Couldn't read that image — try a different file.");
      });
  }

  function removeAvatar() {
    window.KnotAuth.updateCurrentUser({ picture: "" }).then(() => render());
  }

  // ---------- edit / delete school ----------
  async function openEdit(schoolId) {
    const schools = await window.KnotStore.getCustomSchools();
    const school = schools.find((s) => s.id === schoolId);
    if (!school) return;

    editingSchoolId = schoolId;
    els.editError.textContent = "";
    els.efName.value = school.name;
    els.efCity.value = school.city;
    els.efCountry.value = school.country;
    els.efContinent.value = school.continent;
    els.efFlag.value = school.flag === "🏫" ? "" : school.flag;
    els.efStudents.value = school.students || "";
    els.efFounded.value = school.founded || "";
    els.efDescription.value = school.description;

    clubEditor.reset(school.clubs);
    resetEditPhoto(school.photo || null);

    els.editOverlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
    els.efName.focus();
  }

  function closeEdit() {
    els.editOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    editingSchoolId = null;
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    els.editError.textContent = "";

    const name = els.efName.value.trim();
    const city = els.efCity.value.trim();
    const country = els.efCountry.value.trim();
    const continent = els.efContinent.value;
    const description = els.efDescription.value.trim();
    const clubs = clubEditor.collectClubs();

    if (!name || !city || !country || !continent || !description) {
      els.editError.textContent = "Please fill in the school name, city, country, continent, and description.";
      return;
    }
    if (clubs.length === 0) {
      els.editError.textContent = "Add at least one club with a name.";
      return;
    }

    const schools = await window.KnotStore.getCustomSchools();
    const existing = schools.find((s) => s.id === editingSchoolId);
    if (!existing) return;

    const currentYear = new Date().getFullYear();
    const updated = {
      ...existing,
      name,
      city,
      country,
      continent,
      flag: els.efFlag.value.trim() || "🏫",
      photo: selectedPhoto || undefined,
      students: Math.max(0, Number(els.efStudents.value) || 0),
      founded: Number(els.efFounded.value) || existing.founded || currentYear,
      description,
      clubs
    };

    await window.KnotStore.updateCustomSchool(updated);
    closeEdit();
    showToast(`${name} was updated.`);
    render();
  }

  async function deleteSchool(schoolId) {
    const schools = await window.KnotStore.getCustomSchools();
    const school = schools.find((s) => s.id === schoolId);
    if (!school) return;
    if (!confirm(`Remove "${school.name}" from the registry? This can't be undone.`)) return;

    await window.KnotStore.deleteCustomSchool(schoolId);
    await window.KnotStore.deleteMembershipsForSchool(schoolId);

    showToast(`${school.name} was removed.`);
    render();
  }

  async function leaveClub(key) {
    await window.KnotStore.deleteMembership(key);
    render();
  }

  // ---------- photo (edit form) ----------
  function resetEditPhoto(existingPhoto) {
    selectedPhoto = existingPhoto || null;
    els.editPhotoInput.value = "";

    if (existingPhoto) {
      els.editPhotoUpload.classList.add("photo-upload--has-image");
      els.editPhotoPreview.style.backgroundImage = `url("${existingPhoto}")`;
      els.editPhotoPreview.innerHTML = `<span class="photo-upload__text">Change photo</span>`;
      els.editPhotoRemove.hidden = false;
    } else {
      els.editPhotoUpload.classList.remove("photo-upload--has-image");
      els.editPhotoPreview.style.backgroundImage = "";
      els.editPhotoPreview.innerHTML = `
        <svg class="photo-upload__icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.7"/><path d="M21 15l-5-5-9 9"/></svg>
        <span class="photo-upload__text">Click to upload a photo</span>
        <span class="photo-upload__hint">JPG or PNG — resized automatically</span>
      `;
      els.editPhotoRemove.hidden = true;
    }
  }

  function handleEditPhotoFile(file) {
    els.editError.textContent = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      els.editError.textContent = "Please choose an image file.";
      return;
    }
    if (file.size > MAX_SOURCE_FILE_BYTES) {
      els.editError.textContent = "That image is too large — please choose a file under 20MB.";
      return;
    }

    window.KnotImageUtils.compressImage(file, MAX_PHOTO_DIMENSION, 0.82)
      .then((dataUrl) => {
        selectedPhoto = dataUrl;
        els.editPhotoUpload.classList.add("photo-upload--has-image");
        els.editPhotoPreview.style.backgroundImage = `url("${dataUrl}")`;
        els.editPhotoPreview.innerHTML = `<span class="photo-upload__text">Change photo</span>`;
        els.editPhotoRemove.hidden = false;
      })
      .catch(() => {
        els.editError.textContent = "Couldn't read that image — try a different file.";
      });
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
    clubEditor = window.KnotClubRowEditor.createRowManager(els.editClubRows);

    render();
    document.addEventListener("knot:authchange", render);

    els.guardSignInBtn.addEventListener("click", () => {
      document.getElementById("signInBtn")?.click();
    });

    els.avatarEditBtn.addEventListener("click", () => els.avatarInput.click());
    els.avatarInput.addEventListener("change", () => handleAvatarFile(els.avatarInput.files[0]));
    els.avatarRemoveBtn.addEventListener("click", removeAvatar);

    els.schoolsList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "edit") openEdit(btn.dataset.id);
      if (btn.dataset.action === "delete") deleteSchool(btn.dataset.id);
    });

    els.clubsList.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="leave"]');
      if (!btn) return;
      leaveClub(btn.dataset.key);
    });

    els.editClose.addEventListener("click", closeEdit);
    els.editOverlay.addEventListener("click", (e) => {
      if (e.target === els.editOverlay) closeEdit();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.editOverlay.classList.contains("is-open")) closeEdit();
    });
    els.editForm.addEventListener("submit", handleEditSubmit);
    els.editAddClubBtn.addEventListener("click", () => clubEditor.addRow());

    els.editPhotoUpload.addEventListener("click", () => els.editPhotoInput.click());
    els.editPhotoUpload.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.editPhotoInput.click();
      }
    });
    els.editPhotoInput.addEventListener("change", () => handleEditPhotoFile(els.editPhotoInput.files[0]));
    els.editPhotoRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      resetEditPhoto(null);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
