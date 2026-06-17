document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".header");
    var menuButton = document.querySelector(".mobile_menu_btn");
    var slider = document.querySelector(".main_ad");
    var track = document.querySelector(".hero_track");
    var slides = document.querySelectorAll(".hero_slide");
    var prevButton = document.querySelector(".hero_prev");
    var nextButton = document.querySelector(".hero_next");
    var dots = document.querySelectorAll(".hero_dots button");
    var currentIndex = 0;
    var autoplayId;
    var autoplayDelay = 3000;

    function updateSlider() {
        track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

        dots.forEach(function (dot, index) {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function stopAutoplay() {
        window.clearInterval(autoplayId);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayId = window.setInterval(nextSlide, autoplayDelay);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (menuButton && header) {
        menuButton.addEventListener("click", function () {
            var isOpen = header.classList.toggle("menu_open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });
    }

    if (track && slides.length > 0) {
        nextButton.addEventListener("click", function () {
            nextSlide();
            restartAutoplay();
        });

        prevButton.addEventListener("click", function () {
            prevSlide();
            restartAutoplay();
        });

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                goToSlide(index);
                restartAutoplay();
            });
        });

        slider.addEventListener("mouseenter", stopAutoplay);
        slider.addEventListener("mouseleave", startAutoplay);

        slider.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight") {
                nextSlide();
                restartAutoplay();
            }

            if (event.key === "ArrowLeft") {
                prevSlide();
                restartAutoplay();
            }
        });

        updateSlider();
        startAutoplay();
    }
});
