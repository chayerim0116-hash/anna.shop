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

    /* ── 1. Header Scroll Effect ── */
    function initHeaderScrollEffect() {
        var hdr = document.querySelector(".header");
        if (!hdr) return;
        window.addEventListener("scroll", function () {
            if (window.scrollY >= 80) {
                hdr.classList.add("scrolled");
            } else {
                hdr.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    /* ── Toast ── */
    function showToast(msg) {
        var old = document.getElementById("anna-toast");
        if (old) old.remove();
        var el = document.createElement("div");
        el.id = "anna-toast";
        el.className = "anna-toast";
        el.textContent = msg;
        document.body.appendChild(el);
        window.setTimeout(function () { el.classList.add("show"); }, 10);
        window.setTimeout(function () {
            el.classList.remove("show");
            window.setTimeout(function () { if (el.parentNode) el.remove(); }, 300);
        }, 1500);
    }

    /* ── 3. Cart Count ── */
    function updateCartBadge() {
        var count = parseInt(localStorage.getItem("anna_cart_count") || "0", 10);
        var badge = document.getElementById("cartBadge");
        if (!badge) return;
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }

    function addToCart() {
        var count = parseInt(localStorage.getItem("anna_cart_count") || "0", 10);
        count++;
        localStorage.setItem("anna_cart_count", String(count));
        updateCartBadge();
        showToast("장바구니에 담겼습니다.");
    }

    function initCartCount() {
        updateCartBadge();
    }

    /* ── 2. BEST 상품 Hover 아이콘 + 4. 좋아요 ── */
    function initBestProductHoverIcons() {
        var likedArr = JSON.parse(localStorage.getItem("anna_liked_products") || "[]");
        var bestItems = document.querySelectorAll(".best_item li");

        bestItems.forEach(function (item, index) {
            var icons = item.querySelectorAll(".best_hover_icon");
            if (icons.length === 0) return;

            var cartIcon = icons[0];
            cartIcon.setAttribute("role", "button");
            cartIcon.setAttribute("tabindex", "0");
            cartIcon.setAttribute("aria-label", "장바구니 담기");
            cartIcon.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                addToCart();
            });
            cartIcon.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addToCart(); }
            });

            if (icons.length >= 2) {
                var likeIcon = icons[1];
                likeIcon.setAttribute("role", "button");
                likeIcon.setAttribute("tabindex", "0");
                likeIcon.setAttribute("aria-label", "좋아요");

                if (likedArr.indexOf(index) !== -1) {
                    likeIcon.classList.add("is-liked");
                }

                likeIcon.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var liked = JSON.parse(localStorage.getItem("anna_liked_products") || "[]");
                    var pos = liked.indexOf(index);
                    if (pos === -1) {
                        liked.push(index);
                        likeIcon.classList.add("is-liked");
                    } else {
                        liked.splice(pos, 1);
                        likeIcon.classList.remove("is-liked");
                    }
                    localStorage.setItem("anna_liked_products", JSON.stringify(liked));
                });
                likeIcon.addEventListener("keydown", function (e) {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); likeIcon.click(); }
                });
            }
        });
    }

    /* ── 5. 실시간 검색 자동 추천 ── */
    function initSearchSuggest() {
        var searchInput = document.getElementById("searchInput");
        var suggest = document.getElementById("searchSuggest");
        if (!searchInput || !suggest) {
            return;
        }

        var searchKeywords = [
            "린넨 셔츠", "반팔 셔츠", "스트라이프 셔츠", "블라우스", "여름 니트",
            "와이드 팬츠", "슬랙스", "롱스커트", "미니 스커트", "원피스",
            "가디건", "자켓", "샌들", "가방", "데님 팬츠"
        ];

        function closeSuggest() {
            suggest.classList.remove("active");
        }

        function openSuggest() {
            suggest.classList.add("active");
        }

        function renderSuggest(val) {
            if (!val) { closeSuggest(); return; }

            var lower = val.toLowerCase();
            var filtered = searchKeywords.filter(function (k) {
                return k.toLowerCase().indexOf(lower) !== -1;
            }).slice(0, 5);

            if (filtered.length === 0) {
                suggest.innerHTML = '<div class="search-suggest-empty">추천 검색어가 없습니다.</div>';
            } else {
                suggest.innerHTML = filtered.map(function (k) {
                    return '<div class="search-suggest-item" tabindex="0" role="option">' + k + '</div>';
                }).join("");

                suggest.querySelectorAll(".search-suggest-item").forEach(function (el) {
                    el.addEventListener("mousedown", function (e) {
                        e.preventDefault();
                        searchInput.value = el.textContent;
                        closeSuggest();
                    });
                    el.addEventListener("keydown", function (e) {
                        if (e.key === "Enter") {
                            searchInput.value = el.textContent;
                            closeSuggest();
                        }
                    });
                });
            }
            openSuggest();
        }

        searchInput.addEventListener("input", function () {
            renderSuggest(searchInput.value.trim());
        });

        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { closeSuggest(); }
        });

        document.addEventListener("click", function (e) {
            if (!searchInput.contains(e.target) && !suggest.contains(e.target)) {
                closeSuggest();
            }
        });
    }

    /* ── Quick Menu Popup ── */
    function initQuickMenuPopups() {
        var kakaoLink = document.querySelector(".quick-kakao");
        var askLink = document.querySelector(".quick-ask");

        if (kakaoLink) {
            kakaoLink.addEventListener("click", function (e) {
                e.preventDefault();
                window.open("kakao-login.html", "kakaoLoginWindow", "width=520,height=760,left=200,top=100,resizable=yes,scrollbars=yes");
            });
        }

        if (askLink) {
            askLink.addEventListener("click", function (e) {
                e.preventDefault();
                window.open("chat.html", "chatWindow", "width=480,height=760,left=760,top=80,resizable=yes,scrollbars=no");
            });
        }
    }

    initHeaderScrollEffect();
    initCartCount();
    initBestProductHoverIcons();
    initSearchSuggest();
    initQuickMenuPopups();
});
