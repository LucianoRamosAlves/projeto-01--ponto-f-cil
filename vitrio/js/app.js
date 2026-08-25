(function () {
  "use strict";

  var header = document.querySelector("[data-student-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-student-menu]");
  var userToggle = document.querySelector("[data-user-toggle]");
  var userMenu = document.querySelector("[data-user-menu]");
  var focusReturnTarget = null;

  function setYear() {
    document.querySelectorAll("[data-year]").forEach(function (item) {
      item.textContent = new Date().getFullYear();
    });
  }

  function closeMobileMenu(restoreFocus) {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
    if (restoreFocus && focusReturnTarget && typeof focusReturnTarget.focus === "function") {
      focusReturnTarget.focus();
    }
    focusReturnTarget = null;
  }

  function initHeader() {
    function updateHeader() {
      if (header) {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initMobileMenu() {
    if (!navToggle || !navMenu) {
      return;
    }

    navToggle.addEventListener("click", function () {
      var willOpen = !document.body.classList.contains("nav-open");
      if (willOpen) {
        focusReturnTarget = document.activeElement;
      }
      document.body.classList.toggle("nav-open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu(false);
      });
    });
  }

  function initUserMenu() {
    if (!userToggle || !userMenu) {
      return;
    }

    function closeUserMenu() {
      userMenu.hidden = true;
      userToggle.setAttribute("aria-expanded", "false");
    }

    userToggle.addEventListener("click", function () {
      var willOpen = userMenu.hidden;
      userMenu.hidden = !willOpen;
      userToggle.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", function (event) {
      if (!userMenu.hidden && !userMenu.contains(event.target) && !userToggle.contains(event.target)) {
        closeUserMenu();
      }
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (accordion) {
      var trigger = accordion.querySelector("[data-accordion-trigger]");
      var content = accordion.querySelector("[data-accordion-content]");

      if (!trigger || !content) {
        return;
      }

      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        content.hidden = expanded;
        accordion.classList.toggle("is-open", !expanded);
      });
    });
  }

  function initOptionalImages() {
    document.querySelectorAll("[data-optional-image], [data-cover-image]").forEach(function (image) {
      var holder = image.closest(".project-cover") || image.closest(".project-image");

      function showImage() {
        if (holder) {
          holder.classList.add("has-image");
        }
      }

      function hideImage() {
        if (holder) {
          holder.classList.remove("has-image");
        }
        image.removeAttribute("src");
      }

      if (image.complete && image.naturalWidth > 0) {
        showImage();
      }

      image.addEventListener("load", showImage);
      image.addEventListener("error", hideImage);
    });
  }

  function initProjectSpotlight() {
    var canUsePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUsePointer || reduceMotion) {
      return;
    }

    document.querySelectorAll("[data-project-card]").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--mouse-x", x.toFixed(2) + "%");
        card.style.setProperty("--mouse-y", y.toFixed(2) + "%");
      });

      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--mouse-x", "50%");
        card.style.setProperty("--mouse-y", "50%");
      });
    });
  }

  function initLessonCompletionDemo() {
    // DEMONSTRAÇÃO VISUAL.
    // FUTURAMENTE ESTE STATUS DEVE VIR DO BACKEND.
    document.querySelectorAll("[data-complete-lesson]").forEach(function (button) {
      button.addEventListener("click", function () {
        var currentLesson = document.querySelector(".lesson-list .lesson-current");
        var checkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1.1 12.8-3.2-3.2 1.4-1.4 1.8 1.8 4.7-4.7 1.4 1.4-6.1 6.1Z"/></svg>';

        button.classList.add("is-complete");
        button.setAttribute("aria-pressed", "true");
        button.textContent = "Aula concluída";

        if (!currentLesson) {
          return;
        }

        currentLesson.classList.remove("lesson-current");
        currentLesson.classList.add("lesson-done");
        currentLesson.dataset.status = "completed";

        var currentLink = currentLesson.querySelector("a");
        var marker = currentLesson.querySelector(".lesson-marker");
        var state = currentLesson.querySelector(".lesson-state");

        if (currentLink) {
          currentLink.removeAttribute("aria-current");
        }

        if (marker) {
          marker.setAttribute("aria-label", "Aula concluída");
          marker.innerHTML = checkIcon;
        }

        if (state) {
          state.textContent = "Assistida";
        }
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    if (document.body.classList.contains("nav-open")) {
      closeMobileMenu(true);
    }

    if (userMenu && !userMenu.hidden) {
      userMenu.hidden = true;
      if (userToggle) {
        userToggle.setAttribute("aria-expanded", "false");
        userToggle.focus();
      }
    }
  });

  setYear();
  initHeader();
  initMobileMenu();
  initUserMenu();
  initAccordions();
  initOptionalImages();
  initProjectSpotlight();
  initLessonCompletionDemo();
})();
