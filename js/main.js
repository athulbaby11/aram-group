document.addEventListener("DOMContentLoaded", function () {
    var defaultSheetEndpoint = "https://script.google.com/macros/s/AKfycbx_Lwp1RH04eRW9AB_gteiF2T9-6HlfobvWBQgKV-cbq1wDrLiyti-Et84KVUmDzAXZFQ/exec";
    var header = document.querySelector(".site-header");
    var heroSection = document.querySelector(".hero-section");
    var heroImage = document.querySelector(".hero-image-wrap img");
    var heroImageWrap = document.querySelector(".hero-image-wrap");
    var heroFloatItems = document.querySelectorAll(".hero-float");
    var heroPanel = document.querySelector(".hero-panel");
    var aboutSection = document.querySelector("#about");
    var aboutCards = document.querySelectorAll("#about .about-grid article");
    var routeBanner = document.querySelector(".route-banner");
    var statCounters = document.querySelectorAll(".counter");
    var contactDrawerForm = document.querySelector("#contactDrawerForm");
    var notesInput = document.querySelector("#drawerNotes");
    var notesWordCount = document.querySelector("#notesWordCount");
    var drawerFormMsg = document.querySelector("#drawerFormMsg");
    var isSubmitting = false;
    var revealTargets = document.querySelectorAll(
        ".hero-title, .hero-text, .hero-image-wrap, .hero-panel, .stat-card, .highlight-stage, .about-grid article, .image-card, .product-card, .category-card, .service-card, .focus-card, .focus-point, .step-card, .process-detail-card, .route-banner, .portal-card, .value-pill, .news-card, .contact-section .section-title, .contact-section .section-text, .contact-section .btn"
    );

    revealTargets.forEach(function (el) {
        el.classList.add("reveal");
    });

    if (aboutSection && aboutCards.length) {
        aboutSection.classList.add("about-anim-ready");
        aboutCards.forEach(function (card) {
            card.classList.add("about-card");
        });
    }

    var onScrollEffects = function () {
        if (header) {
            if (window.scrollY > 14) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }
        }

        if (routeBanner && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
            var y = Math.round(window.scrollY * 0.2);
            routeBanner.style.backgroundPosition = "center calc(50% + " + y + "px)";
        }

        if (heroSection && heroImage && heroPanel && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
            var heroTop = heroSection.offsetTop;
            var relative = window.scrollY - heroTop;

            if (relative > -240 && relative < heroSection.offsetHeight) {
                heroImage.style.transform = "translateY(" + Math.round(relative * 0.05) + "px) scale(1.04)";
                heroPanel.style.transform = "translateY(" + Math.round(relative * -0.03) + "px)";
            }
        }
    };

    onScrollEffects();
    window.addEventListener("scroll", onScrollEffects, { passive: true });

    if (heroImageWrap && heroFloatItems.length && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        setupHeroParallax();
    }

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16, rootMargin: "0px 0px -30px 0px" }
        );

        revealTargets.forEach(function (el) {
            observer.observe(el);
        });

        var counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.65 }
        );

        statCounters.forEach(function (counter) {
            counterObserver.observe(counter);
        });

        if (aboutSection && aboutCards.length) {
            var aboutObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            runAboutSequence();
                            aboutObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.35 }
            );

            aboutObserver.observe(aboutSection);
        }
    } else {
        revealTargets.forEach(function (el) {
            el.classList.add("in-view");
        });

        statCounters.forEach(function (counter) {
            animateCounter(counter);
        });

        if (aboutCards.length) {
            runAboutSequence();
        }
    }

    function animateCounter(counterEl) {
        var target = parseInt(counterEl.getAttribute("data-target") || "0", 10);
        var suffix = counterEl.getAttribute("data-suffix") || "";
        var duration = 1200;
        var startTime = null;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            counterEl.textContent = String(target) + suffix;
            return;
        }

        var step = function (timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(target * eased);
            counterEl.textContent = String(current) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

    function runAboutSequence() {
        if (!aboutCards.length) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            aboutCards.forEach(function (card) {
                card.classList.add("is-fixed");
            });
            return;
        }

        aboutCards.forEach(function (card, index) {
            window.setTimeout(function () {
                card.classList.add("is-fixed");
            }, index * 180);
        });
    }

    function setupHeroParallax() {
        var active = window.matchMedia("(min-width: 992px)").matches;

        var resetParallax = function () {
            heroImageWrap.style.transform = "";
            heroFloatItems.forEach(function (item) {
                item.style.transform = "";
            });
        };

        heroImageWrap.addEventListener("pointermove", function (event) {
            if (!active) {
                return;
            }

            var rect = heroImageWrap.getBoundingClientRect();
            var offsetX = (event.clientX - rect.left) / rect.width - 0.5;
            var offsetY = (event.clientY - rect.top) / rect.height - 0.5;

            heroImageWrap.style.transform = "translate3d(" + Math.round(offsetX * 10) + "px, " + Math.round(offsetY * 8) + "px, 0)";

            heroFloatItems.forEach(function (item, index) {
                var depth = index + 1;
                var moveX = Math.round(offsetX * (depth * 3));
                var moveY = Math.round(offsetY * (depth * -3));
                item.style.transform = "translate3d(" + moveX + "px, " + moveY + "px, 0)";
            });
        });

        heroImageWrap.addEventListener("pointerleave", function () {
            resetParallax();
        });

        window.addEventListener("resize", function () {
            active = window.matchMedia("(min-width: 992px)").matches;

            if (!active) {
                resetParallax();
            }
        });
    }

    function getWordCount(value) {
        var clean = value.trim();

        if (!clean) {
            return 0;
        }

        return clean.split(/\s+/).length;
    }

    function updateNotesCounter() {
        if (!notesInput || !notesWordCount) {
            return true;
        }

        var words = getWordCount(notesInput.value);
        notesWordCount.textContent = String(words) + "/50 words";
        notesWordCount.classList.toggle("is-over", words > 50);
        return words <= 50;
    }

    if (notesInput) {
        notesInput.addEventListener("input", function () {
            updateNotesCounter();

            if (drawerFormMsg && drawerFormMsg.classList.contains("is-error")) {
                drawerFormMsg.textContent = "";
                drawerFormMsg.classList.remove("is-error");
            }
        });

        updateNotesCounter();
    }

    function setDrawerMessage(text, type) {
        if (!drawerFormMsg) {
            return;
        }

        drawerFormMsg.textContent = text;
        drawerFormMsg.classList.toggle("is-error", type === "error");
        drawerFormMsg.classList.toggle("is-success", type === "success");
    }

    function submitToSheet(endpoint, formElement) {
        var formData = new FormData(formElement);
        var data = {};

        formData.forEach(function (value, key) {
            data[key] = value;
        });

        data.submittedAt = new Date().toISOString();
        data.page = window.location.href;

        return fetch(endpoint, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        });
    }

    function isValidWebAppEndpoint(endpoint) {
        return /^https:\/\/script\.google\.com\/macros\/s\/.+\/(exec|dev)(?:\?.*)?$/i.test(endpoint);
    }

    if (contactDrawerForm) {
        contactDrawerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            var isNotesValid = updateNotesCounter();

            if (!contactDrawerForm.checkValidity()) {
                setDrawerMessage("Please complete all required fields.", "error");

                contactDrawerForm.classList.add("was-validated");
                return;
            }

            if (!isNotesValid) {
                setDrawerMessage("Notes field allows only 50 words.", "error");
                return;
            }

            if (isSubmitting) {
                return;
            }

            var endpoint = (contactDrawerForm.getAttribute("data-sheet-endpoint") || defaultSheetEndpoint || "").trim();

            if (!endpoint) {
                setDrawerMessage("Sheet endpoint missing. Add data-sheet-endpoint in the form.", "error");
                return;
            }

            if (!isValidWebAppEndpoint(endpoint)) {
                setDrawerMessage("Invalid endpoint. Use Google Apps Script Web App URL ending with /exec or /dev.", "error");
                return;
            }

            isSubmitting = true;
            setDrawerMessage("Submitting...", "success");

            try {
                await submitToSheet(endpoint, contactDrawerForm);

                setDrawerMessage("Submitted successfully. Our team will contact you soon.", "success");
                contactDrawerForm.reset();
                contactDrawerForm.classList.remove("was-validated");
                updateNotesCounter();
            } catch (error) {
                console.error("Sheet submission failed:", error);
                if (error && error.message && error.message.indexOf("Failed to fetch") !== -1) {
                    setDrawerMessage("Submission could not reach Google Apps Script. Check the Web App URL, deployment, and access permissions.", "error");
                } else if (error && error.message) {
                    setDrawerMessage(error.message, "error");
                } else {
                    setDrawerMessage("Submission failed. Please try again in a moment.", "error");
                }
            } finally {
                isSubmitting = false;
            }
        });
    }
});
