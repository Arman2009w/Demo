/**
 * Knot front-end logic.
 * Reads the registered school list from data.js (window.SCHOOL_REGISTRY),
 * renders filterable/searchable cards, and powers the club detail modal.
 */

(function () {
  "use strict";

  const CUSTOM_SCHOOLS_KEY = "clubsphere_custom_schools";

  function loadCustomSchools() {
    try {
      return JSON.parse(localStorage.getItem(CUSTOM_SCHOOLS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function persistCustomSchools() {
    const custom = registry.filter((s) => s.custom);
    localStorage.setItem(CUSTOM_SCHOOLS_KEY, JSON.stringify(custom));
  }

  const registry = [...(window.SCHOOL_REGISTRY || []), ...loadCustomSchools()];

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

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  function getBannerGradient(id) {
    const [c1, c2] = BANNER_PALETTES[hashString(id) % BANNER_PALETTES.length];
    return `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
  }

  // ---------- DOM references ----------
  const schoolGrid = document.getElementById("schoolGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");

  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");

  const continentFilter = document.getElementById("continentFilter");
  const countryFilter = document.getElementById("countryFilter");
  const clubFilter = document.getElementById("clubFilter");
  const sortSelect = document.getElementById("sortSelect");
  const resetFiltersBtn = document.getElementById("resetFilters");
  const emptyResetBtn = document.getElementById("emptyReset");

  const viewToggleBtns = document.querySelectorAll(".view-toggle__btn");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalMedia = document.getElementById("modalMedia");
  const modalBadge = document.getElementById("modalBadge");
  const modalFlag = document.getElementById("modalFlag");
  const modalSchoolName = document.getElementById("modalSchoolName");
  const modalLocation = document.getElementById("modalLocation");
  const modalSubmittedBy = document.getElementById("modalSubmittedBy");
  const modalMeta = document.getElementById("modalMeta");
  const modalDescription = document.getElementById("modalDescription");
  const modalClubs = document.getElementById("modalClubs");
  const modalClubCount = document.getElementById("modalClubCount");

  const scrollToExploreBtn = document.getElementById("scrollToExplore");

  const state = {
    search: "",
    continent: "all",
    country: "all",
    club: "all",
    sort: "name-asc",
    view: "grid"
  };

  // ---------- Init ----------
  function init() {
    populateFilterOptions();
    updateStats();
    attachEvents();
    render();
  }

  function populateFilterOptions() {
    const previous = {
      continent: continentFilter.value,
      country: countryFilter.value,
      club: clubFilter.value
    };

    resetSelectOptions(continentFilter);
    resetSelectOptions(countryFilter);
    resetSelectOptions(clubFilter);

    const continents = uniqueSorted(registry.map((s) => s.continent));
    const countries = uniqueSorted(registry.map((s) => s.country));
    const categories = uniqueSorted(
      registry.flatMap((s) => s.clubs.map((c) => c.category))
    );

    appendOptions(continentFilter, continents);
    appendOptions(countryFilter, countries);
    appendOptions(clubFilter, categories);

    if (previous.continent) continentFilter.value = previous.continent;
    if (previous.country) countryFilter.value = previous.country;
    if (previous.club) clubFilter.value = previous.club;
  }

  function resetSelectOptions(selectEl) {
    while (selectEl.options.length > 1) selectEl.remove(1);
  }

  function appendOptions(selectEl, values) {
    values.forEach((value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      selectEl.appendChild(opt);
    });
  }

  function uniqueSorted(arr) {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
  }

  function updateStats() {
    const totalClubs = registry.reduce((sum, s) => sum + s.clubs.length, 0);
    const countries = new Set(registry.map((s) => s.country)).size;
    const categories = new Set(registry.flatMap((s) => s.clubs.map((c) => c.category))).size;

    animateCount("statSchools", registry.length);
    animateCount("statCountries", countries);
    animateCount("statClubs", totalClubs);
    animateCount("statCategories", categories);

    document.getElementById("heroSchoolCount").textContent = registry.length;
    document.getElementById("heroClubCount").textContent = totalClubs;
  }

  function animateCount(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- Events ----------
  function attachEvents() {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      render();
    });

    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      state.search = "";
      searchInput.focus();
      render();
    });

    continentFilter.addEventListener("change", (e) => {
      state.continent = e.target.value;
      render();
    });

    countryFilter.addEventListener("change", (e) => {
      state.country = e.target.value;
      render();
    });

    clubFilter.addEventListener("change", (e) => {
      state.club = e.target.value;
      render();
    });

    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });

    resetFiltersBtn.addEventListener("click", resetFilters);
    emptyResetBtn.addEventListener("click", resetFilters);

    viewToggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewToggleBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.view = btn.dataset.view;
        schoolGrid.classList.toggle("school-grid--list", state.view === "list");
      });
    });

    document.querySelectorAll(".tag-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        searchInput.value = btn.dataset.query;
        state.search = btn.dataset.query.toLowerCase();
        render();
        document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
      });
    });

    scrollToExploreBtn.addEventListener("click", () => {
      document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
    });

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) closeModal();
    });
  }

  function resetFilters() {
    state.search = "";
    state.continent = "all";
    state.country = "all";
    state.club = "all";
    state.sort = "name-asc";
    searchInput.value = "";
    continentFilter.value = "all";
    countryFilter.value = "all";
    clubFilter.value = "all";
    sortSelect.value = "name-asc";
    render();
  }

  // ---------- Filtering / sorting ----------
  function getFilteredSchools() {
    let results = registry.filter((school) => {
      const matchesSearch =
        !state.search ||
        school.name.toLowerCase().includes(state.search) ||
        school.city.toLowerCase().includes(state.search) ||
        school.country.toLowerCase().includes(state.search) ||
        school.clubs.some((c) => c.name.toLowerCase().includes(state.search));

      const matchesContinent = state.continent === "all" || school.continent === state.continent;
      const matchesCountry = state.country === "all" || school.country === state.country;
      const matchesClub =
        state.club === "all" || school.clubs.some((c) => c.category === state.club);

      return matchesSearch && matchesContinent && matchesCountry && matchesClub;
    });

    results.sort((a, b) => {
      switch (state.sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "clubs-desc":
          return b.clubs.length - a.clubs.length;
        case "students-desc":
          return b.students - a.students;
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return results;
  }

  // ---------- Rendering ----------
  function render() {
    const filtered = getFilteredSchools();

    resultsCount.textContent = `Showing ${filtered.length} of ${registry.length} registered schools`;

    schoolGrid.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.hidden = false;
      schoolGrid.hidden = true;
      return;
    }

    emptyState.hidden = true;
    schoolGrid.hidden = false;

    const fragment = document.createDocumentFragment();
    filtered.forEach((school) => fragment.appendChild(buildSchoolCard(school)));
    schoolGrid.appendChild(fragment);
  }

  function buildSchoolCard(school) {
    const card = document.createElement("article");
    card.className = "school-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View clubs at ${school.name}`);
    card.dataset.schoolId = school.id;

    const categories = uniqueSorted(school.clubs.map((c) => c.category)).slice(0, 3);
    const extraCategories = uniqueSorted(school.clubs.map((c) => c.category)).length - categories.length;

    card.innerHTML = `
      <div class="school-card__media" style="background-image: ${getBannerGradient(school.id)}">
        ${school.custom ? '<span class="school-card__badge">Community</span>' : ""}
        <span class="school-card__club-count">${school.clubs.length} clubs</span>
        <span class="school-card__media-flag">${school.flag}</span>
      </div>
      <h3 class="school-card__name">${escapeHtml(school.name)}</h3>
      <p class="school-card__location">${escapeHtml(school.city)}, ${escapeHtml(school.country)}</p>
      <p class="school-card__desc">${escapeHtml(school.description)}</p>
      <div class="school-card__tags">
        ${categories.map((c) => `<span class="tag">${escapeHtml(c)}</span>`).join("")}
        ${extraCategories > 0 ? `<span class="tag tag--muted">+${extraCategories} more</span>` : ""}
      </div>
      <div class="school-card__footer">
        <span>${school.students.toLocaleString()} students</span>
        <span class="school-card__cta">View clubs →</span>
      </div>
    `;

    card.addEventListener("click", () => openModal(school));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(school);
      }
    });

    return card;
  }

  // ---------- Modal ----------
  function openModal(school) {
    modalFlag.textContent = school.flag;
    modalMedia.style.backgroundImage = getBannerGradient(school.id);
    modalBadge.hidden = !school.custom;
    modalSchoolName.textContent = school.name;
    modalLocation.textContent = `${school.city}, ${school.country} · ${school.continent}`;
    modalDescription.textContent = school.description;
    modalClubCount.textContent = `${school.clubs.length} clubs`;

    if (school.registeredBy) {
      modalSubmittedBy.hidden = false;
      modalSubmittedBy.innerHTML = `Submitted by <strong>@${escapeHtml(school.registeredBy)}</strong>`;
    } else {
      modalSubmittedBy.hidden = true;
      modalSubmittedBy.textContent = "";
    }

    modalMeta.innerHTML = `
      <div class="modal__meta-item">
        <span class="modal__meta-label">Founded</span>
        <span class="modal__meta-value">${school.founded}</span>
      </div>
      <div class="modal__meta-item">
        <span class="modal__meta-label">Students</span>
        <span class="modal__meta-value">${school.students.toLocaleString()}</span>
      </div>
      <div class="modal__meta-item">
        <span class="modal__meta-label">Continent</span>
        <span class="modal__meta-value">${school.continent}</span>
      </div>
    `;

    modalClubs.innerHTML = school.clubs
      .map((club) => {
        const joinBlock = club.openMembership
          ? window.KnotMembership.renderJoinBlock(
              window.KnotMembership.getClubKey(school.id, club.name),
              club.name,
              club.joinNote || "Open to students everywhere."
            )
          : "";

        return `
        <div class="club-card">
          <div class="club-card__header">
            <span class="club-card__icon">${club.icon}</span>
            <div>
              <h4>${escapeHtml(club.name)}</h4>
              <span class="club-card__category">${escapeHtml(club.category)}</span>
              ${club.openMembership ? '<span class="club-card__open-badge">🌍 Open worldwide</span>' : ""}
            </div>
          </div>
          <p class="club-card__desc">${escapeHtml(club.description)}</p>
          <p class="club-card__meets">🕒 ${escapeHtml(club.meets)}</p>
          ${joinBlock}
        </div>
      `;
      })
      .join("");

    modalOverlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Public API for js/register.js ----------
  window.KnotRegistry = {
    addSchool(school) {
      registry.push(school);
      persistCustomSchools();
      populateFilterOptions();
      updateStats();
      render();
    },
    hasId(id) {
      return registry.some((s) => s.id === id);
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
