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
    document.querySelectorAll("[data-optional-image]").forEach(function (image) {
      var holder = image.closest(".project-image");

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
})();
