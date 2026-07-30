document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const slider = document.querySelector("[data-home-slider]");

  if (!slider) {
    return;
  }

  const slides = Array.from(
    slider.querySelectorAll("[data-slide]")
  );

  const viewport = slider.querySelector(
    "[data-slider-viewport]"
  );

  if (slides.length < 2) {
    return;
  }

  let currentSlide = 0;
  let autoplayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;

  const autoplayDelay = 6000;

  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    }

    if (index >= slides.length) {
      index = 0;
    }

    slides.forEach(function (slide, slideIndex) {
      const isActive = slideIndex === index;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute(
        "aria-hidden",
        isActive ? "false" : "true"
      );
    });

    currentSlide = index;
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (document.hidden) {
      return;
    }

    autoplayTimer = window.setTimeout(
      function advanceSlider() {
        showNextSlide();

        autoplayTimer = window.setTimeout(
          advanceSlider,
          autoplayDelay
        );
      },
      autoplayDelay
    );
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      showNextSlide();
      startAutoplay();
    }

    if (event.key === "ArrowLeft") {
      showPreviousSlide();
      startAutoplay();
    }
  });

  if (viewport) {
    viewport.addEventListener(
      "touchstart",
      function (event) {
        touchStartX =
          event.changedTouches[0].screenX;

        touchEndX = touchStartX;

        stopAutoplay();
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchmove",
      function (event) {
        touchEndX =
          event.changedTouches[0].screenX;
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchend",
      function () {
        const swipeDistance =
          touchEndX - touchStartX;

        if (Math.abs(swipeDistance) >= 50) {
          if (swipeDistance < 0) {
            showNextSlide();
          } else {
            showPreviousSlide();
          }
        }

        startAutoplay();
      },
      { passive: true }
    );
  }

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  window.addEventListener("focus", startAutoplay);

  showSlide(0);
  startAutoplay();
});