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
    var quickHideTimer;
    var slideCount = slides.length;
    var openQuickView = null;
    var autoSlideTimer = null;
    var isResetting = false;
    var submenuData = {
        "오늘출발": ["PANTS", "TOP", "DRESS&SKIRT", "OUTER"],
        "MADE": ["A.MONMENT", "PANTS", "TOP", "DRESS&SKIRT"],
        "OUTER": ["가디건", "자켓", "코트", "점퍼", "집업", "무스탕", "패딩"],
        "PANTS": ["데님", "슬랙스", "와이드", "반바지", "트레이닝", "코튼", "부츠컷"],
        "KNIT": ["니트탑", "가디건"],
        "TOP": ["티셔츠", "맨투맨", "슬리브리스"],
        "ACC": ["SHOES", "BAG", "ETC", "HAT/CAP"]
    };


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

        function updateSlidePosition() {
            track.style.transform = "translateX(-" + currentIndex * 100 + "%)";
        }

        function updateIndicator() {
            dots.forEach(function (dot, index) {
                dot.classList.toggle("active", index === currentIndex % slideCount);
            });
        }

        function showSlide(index) {
            currentIndex = index;
            track.style.transition = "transform 0.6s ease-in-out";
            updateSlidePosition();
            updateIndicator();
        }

        function nextSlide() {
            if (isResetting) return;
            var next = currentIndex + 1;
            showSlide(next);
            if (next >= slideCount) {
                isResetting = true;
                setTimeout(function () {
                    track.style.transition = "none";
                    currentIndex = 0;
                    updateSlidePosition();
                    track.offsetHeight;
                    isResetting = false;
                }, 700);
            }
        }

        function prevSlide() {
            if (isResetting) return;
            if (currentIndex === 0) {
                track.style.transition = "none";
                currentIndex = slideCount;
                updateSlidePosition();
                track.offsetHeight;
                currentIndex = slideCount - 1;
                track.style.transition = "transform 0.6s ease-in-out";
                updateSlidePosition();
                updateIndicator();
            } else {
                showSlide(currentIndex - 1);
            }
        }

        function startAutoSlide() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(nextSlide, 3000);
        }

        function resetAutoSlide() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
            startAutoSlide();
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                prevSlide();
                resetAutoSlide();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                if (isResetting) return;
                showSlide(index);
                resetAutoSlide();
            });
        });

        slider.addEventListener("mouseenter", function () {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        });
        slider.addEventListener("mouseleave", startAutoSlide);

        slider.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight") {
                nextSlide();
                resetAutoSlide();
            }
            if (event.key === "ArrowLeft") {
                prevSlide();
                resetAutoSlide();
            }
        });

        updateSlidePosition();
        updateIndicator();
        startAutoSlide();
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

    /* ── 2. BEST 상품 Hover 아이콘 ── */
    function initBestProductHoverIcons() {
        var likedSet = JSON.parse(localStorage.getItem("anna_cart_liked_products") || "[]");
        var bestItems = document.querySelectorAll(".best_item li");

        /* 페이지 로드 시 장바구니 count를 liked 수로 동기화 */
        localStorage.setItem("anna_cart_count", String(likedSet.length));
        updateCartBadge();

        bestItems.forEach(function (item, index) {
            var viewBtn = item.querySelector(".view-btn");
            var cartBtn = item.querySelector(".cart-btn");

            /* 첫 번째 아이콘: Quick View 오픈 */
            if (viewBtn) {
                viewBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (openQuickView) openQuickView(item);
                });
            }

            /* 두 번째 아이콘: 장바구니 / 하트 토글 */
            if (cartBtn) {
                /* 로드 시 active 상태 복원 */
                if (likedSet.indexOf(index) !== -1) {
                    cartBtn.classList.add("active");
                }

                cartBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var liked = JSON.parse(localStorage.getItem("anna_cart_liked_products") || "[]");
                    var pos = liked.indexOf(index);
                    var count = parseInt(localStorage.getItem("anna_cart_count") || "0", 10);

                    if (pos === -1) {
                        liked.push(index);
                        count++;
                        cartBtn.classList.add("active");
                        showToast("장바구니에 담겼습니다.");
                    } else {
                        liked.splice(pos, 1);
                        count = Math.max(0, count - 1);
                        cartBtn.classList.remove("active");
                        showToast("장바구니에서 제거되었습니다.");
                    }

                    localStorage.setItem("anna_cart_liked_products", JSON.stringify(liked));
                    localStorage.setItem("anna_cart_count", String(count));
                    updateCartBadge();
                });
            }
        });
    }

    /* ── 인기 검색어 롤링 ── */
    function initPopularKeywordRolling() {
        var rolling = document.getElementById("popularKeywordRolling");
        var rankNum = document.getElementById("popularRankNumber");
        var rankText = document.getElementById("popularRankText");
        if (!rolling || !rankNum || !rankText) return;

        var popularKeywords = [
            "린넨 셔츠", "반팔 셔츠", "스트라이프 셔츠", "블라우스", "여름 니트",
            "와이드 팬츠", "슬랙스", "롱스커트", "미니 스커트", "원피스"
        ];

        var currentIndex = 0;

        function render(idx) {
            var inner = rolling.querySelector(".rolling-inner");
            if (!inner) {
                inner = document.createElement("span");
                inner.className = "rolling-inner";
                rolling.innerHTML = "";
                rolling.appendChild(inner);
            }

            /* 애니메이션 재시작 */
            inner.style.animation = "none";
            inner.offsetHeight;
            inner.style.animation = "";

            inner.innerHTML =
                '<span class="rank-number">' + (idx + 1) + '.</span>' +
                '<span class="rank-text"> ' + popularKeywords[idx] + '</span>';
        }

        /* 초기 렌더 */
        render(0);
        currentIndex = 1;

        window.setInterval(function () {
            render(currentIndex);
            currentIndex = (currentIndex + 1) % popularKeywords.length;
        }, 3000);

        /* 클릭 시 검색창에 키워드 입력 */
        rolling.addEventListener("click", function () {
            var searchInput = document.getElementById("searchInput");
            if (!searchInput) return;
            var idx = (currentIndex - 1 + popularKeywords.length) % popularKeywords.length;
            searchInput.value = popularKeywords[idx];
            searchInput.focus();
            searchInput.dispatchEvent(new Event("input"));
        });

        rolling.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") rolling.click();
        });
    }

    /* ── 5. 실시간 검색 자동 추천 ── */
    function initSearchSuggest() {
        var searchInput = document.getElementById("searchInput");
        var suggest = document.getElementById("searchSuggest");
        if (!searchInput || !suggest) {
            return;
        }

        var rolling = document.getElementById("popularKeywordRolling");

        function showRolling() {
            if (rolling) rolling.classList.remove("hidden");
        }
        function hideRolling() {
            if (rolling) rolling.classList.add("hidden");
        }

        searchInput.addEventListener("focus", hideRolling);
        searchInput.addEventListener("blur", function () {
            if (!searchInput.value.trim()) showRolling();
        });

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
            var val = searchInput.value.trim();
            if (val) {
                hideRolling();
            } else {
                showRolling();
            }
            renderSuggest(val);
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

    /* ── Quick View Modal ── */
    function initQuickViewModal() {
        var overlay   = document.getElementById("qvOverlay");
        var infoArea  = document.getElementById("qvInfoArea");
        var closeBtn  = document.getElementById("qvClose");
        var qvImage   = document.getElementById("qvImage");
        var qvName    = document.getElementById("qvName");
        var qvSale    = document.getElementById("qvSale");
        var qvOriginal= document.getElementById("qvOriginal");
        var qvRate    = document.getElementById("qvRate");
        var qvBtnCart = document.getElementById("qvBtnCart");
        var qvBtnBuy  = document.getElementById("qvBtnBuy");

        if (!overlay) return;

        function closeModal() {
            overlay.classList.remove("is-open");
            document.body.style.overflow = "";
        }

        openQuickView = function (li) {
            var imgEl  = li.querySelector(".best_img_wrap > img");
            var nameEl = li.querySelector("h4");
            var saleEl = li.querySelector(".price-sale");
            var origEl = li.querySelector(".price-original");
            var rateEl = li.querySelector(".price-rate");

            qvImage.src = imgEl ? imgEl.src : "";

            qvName.textContent = (nameEl && nameEl.textContent.trim()) || "ANNA 상품";

            var saleText = saleEl ? saleEl.textContent.trim() : "";
            qvSale.textContent = saleText || "가격 정보 없음";

            var origText = origEl ? origEl.textContent.trim() : "";
            if (origText) {
                qvOriginal.textContent = origText;
                qvOriginal.style.display = "";
            } else {
                qvOriginal.textContent = "";
                qvOriginal.style.display = "none";
            }

            var rateText = rateEl ? rateEl.textContent.trim() : "";
            if (rateText) {
                qvRate.textContent = rateText;
                qvRate.style.display = "";
            } else {
                qvRate.textContent = "";
                qvRate.style.display = "none";
            }

            if (infoArea) infoArea.scrollTop = 0;
            overlay.classList.add("is-open");
            document.body.style.overflow = "hidden";
        };

        closeBtn.addEventListener("click", closeModal);

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
        });

        qvBtnCart.addEventListener("click", function () {
            var count = parseInt(localStorage.getItem("anna_cart_count") || "0", 10) + 1;
            localStorage.setItem("anna_cart_count", String(count));
            updateCartBadge();
            showToast("장바구니에 담겼습니다.");
        });

        qvBtnBuy.addEventListener("click", function () {
            alert("구매 기능은 준비 중입니다.");
        });

        document.querySelectorAll(".qv-color-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".qv-color-btn").forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
            });
        });

        document.querySelectorAll(".qv-size-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".qv-size-btn").forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
            });
        });
    }

    initHeaderScrollEffect();
    initCartCount();
    initQuickViewModal();
    initBestProductHoverIcons();
    initSearchSuggest();
    initQuickMenuPopups();
    initPopularKeywordRolling();
});
