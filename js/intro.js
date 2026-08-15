/**
 * Knot intro splash + homepage letter-reveal.
 *
 * On every page load, a full-screen splash types out the "Knot" wordmark
 * and tagline one letter at a time, then fades out into the homepage,
 * whose hero heading does the same letter-by-letter reveal as it comes in.
 *
 * Respects prefers-reduced-motion by skipping straight to the end state.
 */

(function () {
  "use strict";

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const WORDMARK_STEP_MS = 90;
  const TAGLINE_STEP_MS = 18;
  const LETTER_DURATION_MS = 460;
  const HOLD_AFTER_TAGLINE_MS = 550;
  const FADE_OUT_MS = 650;

  const TITLE_STEP_MS = 22;

  // ---------- letter-splitting ----------
  // Recursively wraps every character of an element's text in
  // <span class="letter"> with a staggered animation-delay, while leaving
  // any existing child elements (like <br> or an .accent <span>) in place.
  // Letters within a word are grouped under a <span class="word-wrap"> so
  // the word can't be split across a line-wrap mid-animation.
  function splitLetters(root, stepMs) {
    const letters = [];
    let index = 0;

    function makeLetter(ch) {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = ch;
      span.style.animationDelay = `${index * stepMs}ms`;
      index++;
      letters.push(span);
      return span;
    }

    function walk(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          // Collapse runs of whitespace (incl. newlines from HTML source
          // formatting) to a single space, same as normal HTML rendering.
          const text = child.textContent.replace(/\s+/g, " ");

          // Plain text-node spaces between words (not wrapped in a
          // display:inline-block .letter span, which would collapse a
          // whitespace-only box to zero width).
          text.split(" ").forEach((word, i) => {
            if (i > 0) frag.appendChild(document.createTextNode(" "));
            if (!word) return;
            const wordWrap = document.createElement("span");
            wordWrap.className = "word-wrap";
            Array.from(word).forEach((ch) => wordWrap.appendChild(makeLetter(ch)));
            frag.appendChild(wordWrap);
          });

          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    }

    walk(root);
    return letters;
  }

  // ---------- intro sequence ----------
  function runIntro() {
    const intro = document.getElementById("introScreen");
    const wordmark = document.getElementById("introWordmark");
    const tagline = document.getElementById("introTagline");

    if (!intro) {
      startHeroReveal();
      return;
    }

    if (REDUCE_MOTION) {
      intro.classList.add("is-hidden");
      intro.setAttribute("hidden", "");
      document.body.classList.remove("intro-active");
      startHeroReveal(true);
      return;
    }

    document.body.classList.add("intro-active");

    const wordmarkLetters = splitLetters(wordmark, WORDMARK_STEP_MS);
    const taglineLetters = splitLetters(tagline, TAGLINE_STEP_MS);

    const wordmarkTime = wordmarkLetters.length * WORDMARK_STEP_MS + LETTER_DURATION_MS;
    const taglineTime = taglineLetters.length * TAGLINE_STEP_MS + LETTER_DURATION_MS;

    // Offset the tagline's own per-letter delays so it starts right after
    // the wordmark finishes, instead of typing simultaneously.
    taglineLetters.forEach((span, i) => {
      span.style.animationDelay = `${wordmarkTime + i * TAGLINE_STEP_MS}ms`;
    });

    wordmark.classList.add("reveal-active");
    tagline.classList.add("reveal-active");

    const totalIntroTime = wordmarkTime + taglineTime + HOLD_AFTER_TAGLINE_MS;
    const finishTimer = setTimeout(finishIntro, totalIntroTime);

    intro.addEventListener(
      "click",
      () => {
        clearTimeout(finishTimer);
        finishIntro();
      },
      { once: true }
    );

    function finishIntro() {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-active");
      startHeroReveal();
      setTimeout(() => intro.setAttribute("hidden", ""), FADE_OUT_MS);
    }
  }

  // ---------- homepage hero reveal ----------
  function startHeroReveal(instant) {
    const heroTitle = document.getElementById("heroTitle");
    const heroInner = document.getElementById("heroInner");
    if (!heroTitle || !heroInner) return;

    if (instant || REDUCE_MOTION) {
      heroInner.classList.add("hero--revealed");
      heroTitle.classList.add("reveal-active", "reveal-instant");
      return;
    }

    const titleLetters = splitLetters(heroTitle, TITLE_STEP_MS);
    heroTitle.classList.add("reveal-active");

    const titleTime = titleLetters.length * TITLE_STEP_MS + LETTER_DURATION_MS;
    setTimeout(() => heroInner.classList.add("hero--revealed"), titleTime);
  }

  document.addEventListener("DOMContentLoaded", runIntro);
})();
