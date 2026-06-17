document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".header");
    var menuButton = document.querySelector(".mobile_menu_btn");
    var nav = document.querySelector(".gnb");
    var submenuBar = document.querySelector(".nav_submenu_bar");
    var slider = document.querySelector(".main_ad");
    var track = document.querySelector(".hero_track");
    var slides = document.querySelectorAll(".hero_slide");
    var prevButton = document.querySelector(".hero_prev");
    var nextButton = document.querySelector(".hero_next");
    var dots = document.querySelectorAll(".hero_dots button");
    var quickFixed = document.querySelector(".quick-fixed");
    var quickTop = document.querySelector(".quick-top");
    var quickBottom = document.querySelector(".quick-bottom");
    var layerPopup = document.querySelector(".layer-popup");
    var layerPopupClose = document.querySelector(".layer-popup-close");
    var loginTabs = document.querySelectorAll(".member-tab[data-login-tab]");
    var loginInputs = document.querySelectorAll(".login-form input[data-member-placeholder]");
    var currentIndex = 0;
    var autoplayId;
    var autoplayDelay = 3000;
    var quickHideTimer;
    var slideCount = slides.length;
    var isTransitioning = false;
    var submenuData = {
        "오늘출발": ["PANTS", "TOP", "DRESS&SKIRT", "OUTER"],
        "MADE": ["A.MONMENT", "PANTS", "TOP", "DRESS&SKIRT"],
        "OUTER": ["가디건", "자켓", "코트", "점퍼", "집업", "무스탕", "패딩"],
        "PANTS": ["데님", "슬랙스", "와이드", "반바지", "트레이닝", "코튼", "부츠컷"],
        "KNIT": ["니트탑", "가디건"],
        "TOP": ["티셔츠", "맨투맨", "슬리브리스"],
        "ACC": ["SHOES", "BAG", "ETC", "HAT/CAP"]
    };

    function updateSlider() {
        if (!track) return;

        track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

        dots.forEach(function (dot, index) {
            dot.classList.toggle("active", index === currentIndex % slideCount);
        });
    }

    function goToSlide(index) {
        if (isTransitioning) return;

        isTransitioning = true;
        currentIndex = index;
        track.style.transition = "transform 0.6s ease-in-out";
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (isTransitioning || currentIndex === 0) return;
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

    function showQuickArrows() {
        if (!quickFixed) return;

        quickFixed.classList.add("is-scrolling");
        window.clearTimeout(quickHideTimer);
        quickHideTimer = window.setTimeout(function () {
            quickFixed.classList.remove("is-scrolling");
        }, 1000);
    }

    function showSubmenu(key, link) {
        if (!submenuBar || !submenuData[key]) return;

        submenuBar.innerHTML = '<div class="nav_submenu_inner">' + submenuData[key].map(function (item) {
            return '<a href="#none">' + item + '</a>';
        }).join("") + '</div>';

        var inner = submenuBar.querySelector(".nav_submenu_inner");
        var linkRect = link.getBoundingClientRect();
        var barRect = submenuBar.getBoundingClientRect();
        var left = Math.max(24, linkRect.left - barRect.left);

        inner.style.left = left + "px";
        submenuBar.classList.add("active");
    }

    function hideSubmenu() {
        if (!submenuBar) return;
        submenuBar.classList.remove("active");
    }

    if (menuButton && header) {
        menuButton.addEventListener("click", function () {
            var isOpen = header.classList.toggle("menu_open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });
    }

    if (nav && submenuBar) {
        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("mouseenter", function () {
                var key = link.getAttribute("data-submenu");

                if (key && submenuData[key]) {
                    showSubmenu(key, link);
                } else {
                    hideSubmenu();
                }
            });
        });

        header.addEventListener("mouseleave", function (event) {
            if (!submenuBar.contains(event.relatedTarget)) {
                hideSubmenu();
            }
        });

        submenuBar.addEventListener("mouseleave", function (event) {
            if (!header.contains(event.relatedTarget)) {
                hideSubmenu();
            }
        });
    }

    if (track && slider && slides.length > 0) {
        var firstClone = slides[0].cloneNode(true);
        firstClone.setAttribute("aria-hidden", "true");
        track.appendChild(firstClone);

        track.addEventListener("transitionend", function () {
            if (currentIndex === slideCount) {
                track.style.transition = "none";
                currentIndex = 0;
                updateSlider();
                track.offsetHeight;
                track.style.transition = "transform 0.6s ease-in-out";
            }

            isTransitioning = false;
        });

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                nextSlide();
                restartAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                if (currentIndex === 0) {
                    if (isTransitioning) return;

                    track.style.transition = "none";
                    currentIndex = slideCount;
                    updateSlider();
                    track.offsetHeight;
                    track.style.transition = "transform 0.6s ease-in-out";
                    prevSlide();
                } else {
                    prevSlide();
                }
                restartAutoplay();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                if (isTransitioning) return;
                if (index === currentIndex % slideCount) {
                    restartAutoplay();
                    return;
                }

                isTransitioning = true;
                currentIndex = index;
                track.style.transition = "transform 0.6s ease-in-out";
                updateSlider();
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

    if (quickTop) {
        quickTop.addEventListener("click", function () {
            showQuickArrows();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (quickBottom) {
        quickBottom.addEventListener("click", function () {
            showQuickArrows();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        });
    }

    if (quickFixed) {
        window.addEventListener("scroll", showQuickArrows, { passive: true });
    }

    if (layerPopup && layerPopupClose) {
        layerPopupClose.addEventListener("click", function () {
            layerPopup.classList.add("is-hidden");

            window.setTimeout(function () {
                layerPopup.style.display = "none";
            }, 250);
        });
    }

    if (loginTabs.length > 0) {
        loginTabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var activeType = tab.getAttribute("data-login-tab");

                loginTabs.forEach(function (item) {
                    var isActive = item === tab;
                    item.classList.toggle("is-active", isActive);
                    item.setAttribute("aria-selected", String(isActive));
                    item.style.backgroundColor = isActive ? "#222222" : "transparent";
                    item.style.color = isActive ? "#ffffff" : "#333333";
                });

                loginInputs.forEach(function (input, index) {
                    var placeholder = activeType === "guest"
                        ? input.getAttribute("data-guest-placeholder")
                        : input.getAttribute("data-member-placeholder");

                    input.value = "";
                    input.setAttribute("placeholder", placeholder);

                    if (index === 1) {
                        input.setAttribute("type", activeType === "guest" ? "text" : "password");
                    }
                });
            });
        });
    }
});
