
/* =========================================
   PANERI — NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    if (!header || !menuToggle || !navLinks) {
        return;
    }

    // Sticky header shadow
    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    // Mobile navigation
    const closeMenu = () => {
        menuToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    };

    const openMenu = () => {
        menuToggle.classList.add("is-open");
        navLinks.classList.add("is-open");
        document.body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    };

    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close the menu after clicking a navigation link
    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();

            navItems.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    // Close when clicking outside the mobile navigation
    document.addEventListener("click", (event) => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (
            isOpen &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Close with the Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Restore the desktop layout when the viewport grows
    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });
});

    /* =========================================
       PANERI — HERO IMAGE SLIDER
    ========================================= */

    const hero = document.querySelector(".hero");

    if (hero) {
        const slides = Array.from(
            hero.querySelectorAll(".hero-slide")
        );

        const dots = Array.from(
            hero.querySelectorAll(".hero-dot")
        );

        const previousButton = hero.querySelector(".hero-prev");
        const nextButton = hero.querySelector(".hero-next");
        const currentCounter = hero.querySelector(".current-slide");

        let currentIndex = 0;
        let sliderTimer = null;
        let touchStartX = 0;
        let touchStartY = 0;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const showSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                const isActive = i === currentIndex;

                slide.classList.toggle("active", isActive);
                slide.setAttribute(
                    "aria-hidden",
                    String(!isActive)
                );

                // Only the visible slide should receive keyboard focus.
                slide.querySelectorAll("a, button").forEach((element) => {
                    element.tabIndex = isActive ? 0 : -1;
                });
            });

            dots.forEach((dot, i) => {
                const isActive = i === currentIndex;

                dot.classList.toggle("active", isActive);

                if (isActive) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });

            if (currentCounter) {
                currentCounter.textContent = String(
                    currentIndex + 1
                ).padStart(2, "0");
            }
        };

        const stopAutoplay = () => {
            window.clearInterval(sliderTimer);
            sliderTimer = null;
        };

        const startAutoplay = () => {
            stopAutoplay();

            if (
                reducedMotion.matches ||
                document.hidden ||
                hero.matches(":hover") ||
                hero.contains(document.activeElement)
            ) {
                return;
            }

            sliderTimer = window.setInterval(() => {
                showSlide(currentIndex + 1);
            }, 5500);
        };

        const restartAutoplay = () => {
            startAutoplay();
        };

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                showSlide(currentIndex + 1);
                restartAutoplay();
            });
        }

        if (previousButton) {
            previousButton.addEventListener("click", () => {
                showSlide(currentIndex - 1);
                restartAutoplay();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                restartAutoplay();
            });
        });

        // Pause while the visitor interacts with the hero.
        hero.addEventListener("mouseenter", stopAutoplay);
        hero.addEventListener("mouseleave", startAutoplay);

        hero.addEventListener("focusin", stopAutoplay);

        hero.addEventListener("focusout", () => {
            window.setTimeout(() => {
                if (!hero.contains(document.activeElement)) {
                    startAutoplay();
                }
            }, 0);
        });

        // Touch swipe support for mobile.
        hero.addEventListener(
            "touchstart",
            (event) => {
                const touch = event.changedTouches[0];

                touchStartX = touch.screenX;
                touchStartY = touch.screenY;
            },
            { passive: true }
        );

        hero.addEventListener(
            "touchend",
            (event) => {
                const touch = event.changedTouches[0];

                const deltaX = touch.screenX - touchStartX;
                const deltaY = touch.screenY - touchStartY;

                if (
                    Math.abs(deltaX) > 55 &&
                    Math.abs(deltaX) > Math.abs(deltaY)
                ) {
                    showSlide(
                        currentIndex + (deltaX < 0 ? 1 : -1)
                    );

                    restartAutoplay();
                }
            },
            { passive: true }
        );

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        reducedMotion.addEventListener?.("change", () => {
            startAutoplay();
        });

        // Initial setup
        showSlide(0);
        startAutoplay();
    }

    /* =========================================
       PANERI — COLLECTION FILTERS
    ========================================= */

    const collection = document.querySelector(".collection-section");

    if (collection) {
        const filterButtons = collection.querySelectorAll(
            ".collection-filter"
        );

        const dressCards = collection.querySelectorAll(
            ".dress-card"
        );

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const selectedCategory = button.dataset.filter;

                filterButtons.forEach((item) => {
                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                dressCards.forEach((card) => {
                    const matches =
                        selectedCategory === "all" ||
                        card.dataset.category === selectedCategory;

                    card.classList.toggle("is-hidden", !matches);

                    if (matches) {
                        card.style.animation = "none";

                        // Restart the entrance animation.
                        void card.offsetWidth;

                        card.style.animation = "";
                    }
                });
            });
        });


        /* =====================================
           WHATSAPP OUTFIT ENQUIRY BUTTONS
        ===================================== */

        const enquiryButtons = collection.querySelectorAll(
            ".dress-wishlist"
        );

        enquiryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const outfit = button.dataset.outfit || "an outfit";

                const message =
                    `Hello Paneri, I'm interested in ${outfit}. ` +
                    "Please share the available designs, rental price, " +
                    "sizes and booking details.";

                const whatsappURL =
                    "https://wa.me/917863845750?text=" +
                    encodeURIComponent(message);

                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );
            });
        });
    }

    /* =========================================
       PANERI — STORY SCROLL REVEAL
    ========================================= */

    const storySection = document.querySelector(".paneri-story");

    if (storySection) {
        const storyElements = storySection.querySelectorAll(
            ".story-content, .story-visual"
        );

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (
            reducedMotion.matches ||
            !("IntersectionObserver" in window)
        ) {
            storyElements.forEach((element) => {
                element.classList.add("story-visible");
            });
        } else {
            const storyObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("story-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12
                }
            );

            storyElements.forEach((element) => {
                storyObserver.observe(element);
            });
        }
    }

    /* =========================================
       PANERI — WHY SECTION REVEAL
    ========================================= */

    const whySection = document.querySelector(".why-paneri");

    if (whySection) {
        const whyElements = whySection.querySelectorAll(
            ".why-heading, .why-card, .why-banner"
        );

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (
            reducedMotion.matches ||
            !("IntersectionObserver" in window)
        ) {
            whyElements.forEach((element) => {
                element.classList.add("why-visible");
            });
        } else {
            const whyObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("why-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12
                }
            );

            whyElements.forEach((element) => {
                whyObserver.observe(element);
            });
        }
    }

// Automatically update the Paneri footer copyright year
const paneriYear = document.getElementById("paneri-current-year");

if (paneriYear) {
    paneriYear.textContent = new Date().getFullYear();
}
