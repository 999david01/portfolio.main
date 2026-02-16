"use strict";

// ========================================================================
// NAVIGATION BAR
// ========================================================================

(function initTopBar() {
    const topBar = document.getElementById("topBar");
    if (!topBar) return;

    function isInDark() {
        const y = window.scrollY + 120;
        const darkSections = document.querySelectorAll(
            ".skills-strip, .skills, .projects, .cta-banner, .testimonials, .faq, .contact, .footer, .transition-image"
        );

        for (let i = 0; i < darkSections.length; i++) {
            const rect = darkSections[i].getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const bottom = top + rect.height;

            if (y >= top && y <= bottom) return true;
        }
        return false;
    }

    function onScroll() {
        const show = window.scrollY > 120;
        topBar.classList.toggle("is-visible", show);
        document.body.classList.toggle("inDark", isInDark());
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
})();

// ========================================================================
// HISTORY TIMELINE ANIMATIONS
// ========================================================================

(function initHistoryTimeline() {
    const items = document.querySelectorAll(".history-item");
    if (!items.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;

                if (entry.isIntersecting) {
                    el.classList.add("is-active");

                    const ratio = Math.max(0, Math.min(1, entry.intersectionRatio));
                    const scale = 1 + ratio * 0.3;
                    el.style.setProperty("--dot-scale", String(scale));
                } else {
                    el.classList.remove("is-active");
                    el.style.setProperty("--dot-scale", "1");
                }
            });
        },
        {
            root: null,
            rootMargin: "-30% 0px -30% 0px",
            threshold: [0, 0.15, 0.3, 0.5, 0.7, 1],
        }
    );

    items.forEach((item) => observer.observe(item));
})();

// ========================================================================
// SECTION FADE IN ANIMATIONS
// ========================================================================

(function initSectionFade() {
    const sections = document.querySelectorAll(".sectionFade");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -80px 0px",
        }
    );

    sections.forEach((s) => observer.observe(s));
})();

// ========================================================================
// CONTACT FORM HANDLING
// ========================================================================

(function initContactForm() {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form || !note) return;

    function setNote(text, isError = false) {
        note.textContent = text;
        note.style.color = isError 
            ? "rgba(239, 68, 68, 0.9)" 
            : "rgba(255, 255, 255, 0.72)";
    }

    function setBusy(isBusy) {
        const btn = form.querySelector("button[type='submit']");
        if (!btn) return;

        btn.disabled = isBusy;
        btn.style.opacity = isBusy ? "0.6" : "1";
        btn.style.cursor = isBusy ? "not-allowed" : "pointer";
        btn.textContent = isBusy ? "Sending..." : "Send";
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const payload = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            message: String(formData.get("message") || "").trim(),
            website: String(formData.get("website") || "").trim(),
        };

        // Honeypot check
        if (payload.website) {
            setNote("", false);
            return;
        }

        // Validation
        if (!payload.name || !payload.email || !payload.message) {
            setNote("Please fill in all required fields.", true);
            return;
        }

        if (!validateEmail(payload.email)) {
            setNote("Please enter a valid email address.", true);
            return;
        }

        setBusy(true);
        setNote("Sending...", false);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || !data || data.ok !== true) {
                setNote(data?.error || "Send failed. Please try again.", true);
                setBusy(false);
                return;
            }

            form.reset();
            setNote("Message sent! I'll get back to you soon.", false);
            setBusy(false);

            // Clear success message after 5 seconds
            setTimeout(() => {
                setNote("&nbsp;", false);
            }, 5000);
        } catch (err) {
            console.error("Contact form error:", err);
            setNote(
                "Network error. Please check your connection and try again.",
                true
            );
            setBusy(false);
        }
    });
})();

// ========================================================================
// FOOTER YEAR
// ========================================================================

(function setYear() {
    const yearEl = document.getElementById("year");
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
})();

// ========================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================================================

(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href === "#" || !href) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const topBarHeight = 84;
            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                topBarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        });
    });
})();

// ========================================================================
// PARALLAX EFFECT FOR HERO
// ========================================================================

(function initParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const hero = document.querySelector(".hero");
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector(".hero-content");
        
        if (heroContent && scrolled < window.innerHeight) {
            const rate = 0.32;
            const parallaxValue = scrolled * rate;
            const opacity = 1 - (scrolled / window.innerHeight) * 0.6;
            heroContent.style.transform = `translateY(${parallaxValue}px)`;
            heroContent.style.opacity = Math.max(0.4, opacity);
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
})();

// ========================================================================
// INTERSECTION OBSERVER FOR STATS COUNTER (if needed)
// ========================================================================

(function initStatsCounter() {
    const stats = document.querySelectorAll(".stat-value");
    if (!stats.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const value = stat.textContent.trim();
                    
                    // Simple animation for numeric values
                    if (value.includes("+")) {
                        const num = parseInt(value);
                        if (!isNaN(num)) {
                            let current = 0;
                            const increment = num / 30;
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= num) {
                                    stat.textContent = value;
                                    clearInterval(timer);
                                } else {
                                    stat.textContent = Math.floor(current) + "+";
                                }
                            }, 30);
                            observer.unobserve(stat);
                        }
                    }
                }
            });
        },
        { threshold: 0.5 }
    );

    stats.forEach((stat) => observer.observe(stat));
})();

// ========================================================================
// LAZY LOADING ENHANCEMENT
// ========================================================================

(function initLazyLoading() {
    if ("loading" in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        return;
    }

    const images = document.querySelectorAll('img[loading="lazy"]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach((img) => imageObserver.observe(img));
})();
