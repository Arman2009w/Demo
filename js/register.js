/**
 * Knot school registration.
 *
 * Lets a visitor add a school (with its clubs) straight into the directory.
 * New schools are pushed into js/app.js's in-memory registry via
 * window.KnotRegistry.addSchool() and persisted to localStorage there,
 * so this file only owns the form UI, validation, and building the school
 * object to hand off.
 */

(function () {
  "use strict";

  let els = {};
  let clubRowCount = 0;
  let toastTimer = null;
  let selectedPhoto = null;

  const MAX_PHOTO_DIMENSION = 900;
  const MAX_SOURCE_FILE_BYTES = 20 * 1024 * 1024; // 20MB, before compression

  function cacheEls() {
    els = {
      overlay: document.getElementById("registerOverlay"),
      close: document.getElementById("registerClose"),
      form: document.getElementById("registerForm"),
      name: document.getElementById("rfName"),
      photoUpload: document.getElementById("photoUpload"),
      photoInput: document.getElementById("rfPhoto"),
      photoPreview: document.getElementById("photoPreview"),
      photoRemove: document.getElementById("photoRemove"),
      city: document.getElementById("rfCity"),
      country: document.getElementById("rfCountry"),
      continent: document.getElementById("rfContinent"),
      flag: document.getElementById("rfFlag"),
      students: document.getElementById("rfStudents"),
      founded: document.getElementById("rfFounded"),
      description: document.getElementById("rfDescription"),
      clubRows: document.getElementById("clubRows"),
      addClubBtn: document.getElementById("addClubBtn"),
      error: document.getElementById("registerError"),
      submit: document.getElementById("registerSubmit"),
      navLink: document.getElementById("registerNavLink"),
      ctaBtn: document.getElementById("registerBtn"),
      toast: document.getElementById("toast"),
      toastMessage: document.getElementById("toastMessage")
    };
  }

  // ---------- modal open/close ----------
  function openRegisterModal() {
    resetForm();
    els.overlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
    els.name.focus();
  }

  function closeRegisterModal() {
    els.overlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  function resetForm() {
    els.form.reset();
    els.error.textContent = "";
    els.clubRows.innerHTML = "";
    clubRowCount = 0;
    addClubRow();
    resetPhoto();
  }

  // ---------- photo upload ----------
  function resetPhoto() {
    selectedPhoto = null;
    els.photoInput.value = "";
    els.photoUpload.classList.remove("photo-upload--has-image");
    els.photoPreview.style.backgroundImage = "";
    els.photoPreview.innerHTML = `
      <svg class="photo-upload__icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.7"/><path d="M21 15l-5-5-9 9"/></svg>
      <span class="photo-upload__text">Click to upload a photo</span>
      <span class="photo-upload__hint">JPG or PNG — resized automatically</span>
    `;
    els.photoRemove.hidden = true;
  }

  function handlePhotoFile(file) {
    els.error.textContent = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      els.error.textContent = "Please choose an image file.";
      return;
    }
    if (file.size > MAX_SOURCE_FILE_BYTES) {
      els.error.textContent = "That image is too large — please choose a file under 20MB.";
      return;
    }

    window.KnotImageUtils.compressImage(file, MAX_PHOTO_DIMENSION, 0.82)
      .then((dataUrl) => {
        selectedPhoto = dataUrl;
        els.photoUpload.classList.add("photo-upload--has-image");
        els.photoPreview.style.backgroundImage = `url("${dataUrl}")`;
        els.photoPreview.innerHTML = `<span class="photo-upload__text">Change photo</span>`;
        els.photoRemove.hidden = false;
      })
      .catch(() => {
        els.error.textContent = "Couldn't read that image — try a different file.";
      });
  }

  // ---------- club rows ----------
  function addClubRow(data) {
    clubRowCount++;
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
      clubRowCount--;
      if (els.clubRows.children.length === 0) addClubRow();
      syncRemoveButtons();
    });

    els.clubRows.appendChild(row);
    syncRemoveButtons();
  }

  function syncRemoveButtons() {
    const buttons = els.clubRows.querySelectorAll(".club-row__remove");
    buttons.forEach((btn) => {
      btn.disabled = buttons.length <= 1;
    });
  }

  function collectClubs() {
    const rows = Array.from(els.clubRows.querySelectorAll(".club-row"));
    return rows
      .map((row) => ({
        name: row.querySelector(".club-name").value.trim(),
        category: row.querySelector(".club-category").value.trim() || "General",
        meets: row.querySelector(".club-meets").value.trim() || "TBD",
        description: row.querySelector(".club-desc").value.trim() || "No description yet."
      }))
      .filter((club) => club.name);
  }

  // ---------- id / slug helpers ----------
  function slugify(str) {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function generateId(name, city) {
    const base = slugify(`${name}-${city}`) || "school";
    let candidate = base;
    let n = 1;
    while (window.KnotRegistry.hasId(candidate)) {
      candidate = `${base}-${n}`;
      n++;
    }
    return candidate;
  }

  // ---------- submit ----------
  async function handleSubmit(e) {
    e.preventDefault();
    els.error.textContent = "";

    const name = els.name.value.trim();
    const city = els.city.value.trim();
    const country = els.country.value.trim();
    const continent = els.continent.value;
    const description = els.description.value.trim();
    const clubs = collectClubs();

    if (!name || !city || !country || !continent || !description) {
      els.error.textContent = "Please fill in the school name, city, country, continent, and description.";
      return;
    }
    if (clubs.length === 0) {
      els.error.textContent = "Add at least one club with a name.";
      return;
    }

    const currentYear = new Date().getFullYear();
    const students = Math.max(0, Number(els.students.value) || 0);
    const founded = Number(els.founded.value) || currentYear;
    const flag = els.flag.value.trim() || "🏫";
    const user = window.KnotAuth?.getCurrentUser?.();

    const school = {
      id: generateId(name, city),
      name,
      city,
      country,
      continent,
      flag,
      photo: selectedPhoto || undefined,
      students,
      founded,
      description,
      clubs,
      custom: true,
      registeredBy: user ? user.username : null
    };

    await window.KnotRegistry.addSchool(school);
    closeRegisterModal();
    showToast(`${name} was added to the registry!`);
    highlightNewCard(school.id);
  }

  function highlightNewCard(id) {
    document.getElementById("explore").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const card = document.querySelector(`.school-card[data-school-id="${cssEscape(id)}"]`);
      if (!card) return;
      card.classList.add("school-card--new");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => card.classList.remove("school-card--new"), 2400);
    }, 350);
  }

  function cssEscape(str) {
    return window.CSS && CSS.escape ? CSS.escape(str) : str.replace(/["\\]/g, "\\$&");
  }

  // ---------- toast ----------
  function showToast(message) {
    els.toastMessage.textContent = message;
    els.toast.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("is-open"), 3200);
  }

  // ---------- helpers ----------
  function escapeAttr(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML.replace(/"/g, "&quot;");
  }

  // ---------- init ----------
  function init() {
    cacheEls();

    els.navLink.addEventListener("click", (e) => {
      e.preventDefault();
      openRegisterModal();
    });
    els.ctaBtn.addEventListener("click", openRegisterModal);
    els.close.addEventListener("click", closeRegisterModal);
    els.overlay.addEventListener("click", (e) => {
      if (e.target === els.overlay) closeRegisterModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.overlay.classList.contains("is-open")) closeRegisterModal();
    });

    els.addClubBtn.addEventListener("click", () => addClubRow());
    els.form.addEventListener("submit", handleSubmit);

    els.photoUpload.addEventListener("click", () => els.photoInput.click());
    els.photoUpload.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.photoInput.click();
      }
    });
    els.photoInput.addEventListener("change", () => handlePhotoFile(els.photoInput.files[0]));
    els.photoRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      resetPhoto();
    });

    addClubRow();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
