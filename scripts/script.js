"use strict";

// top that shows after hero
// styling in dark section

(function initTopBar() {
    const topBar = document.getElementById("topBar");
    if (!topBar) return;

    function isInDark() {
        const y = window.scrollY + 120;
        const darkSections =
            document.querySelectorAll(".projects, .contact, .footer");

        for (let i = 0; i < darkSections.length; i++) {
            const r = darkSections[i].getBoundingClientRect();
            const top = r.top + window.scrollY;
            const bottom = top + r.height;

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

// history dot

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
                    const scale = 1 + ratio * 1.2;
                    el.style.setProperty("--dotScale", String(scale));
                } else {
                    el.classList.remove("is-active");
                    el.style.setProperty("--dotScale", "1");
                }
            });
        },
        {
            root: null,
            rootMargin: "-35% 0px -35% 0px",
            threshold: [0, 0.15, 0.3, 0.5, 0.7, 1],
        }
    );

    items.forEach((item) => observer.observe(item));
})();

// section fade in

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
        { threshold: 0.12 }
    );

    sections.forEach((s) => observer.observe(s));
})();

// contact backend
// needs /api/contact (JSON)

(function initContactForm() {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form || !note) return;

    function setNote(text) {
        note.textContent = text;
    }

    function setBusy(isBusy) {
        const btn = form.querySelector("button[type='submit']");
        if (!btn) return;

        btn.disabled = isBusy;
        btn.style.opacity = isBusy ? "0.75" : "1";
        btn.textContent = isBusy ? "Sending..." : "Send";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const payload = {
            name: String(fd.get("name") || "").trim(),
            email: String(fd.get("email") || "").trim(),
            message: String(fd.get("message") || "").trim(),
            website: String(fd.get("website") || "").trim(),
        };

        setBusy(true);
        setNote("Sending...");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || !data || data.ok !== true) {
                setNote(data?.error || "Send failed. Try again.");
                setBusy(false);
                return;
            }

            form.reset();
            setNote("Sent. I’ll get back to you.");
            setBusy(false);
        } catch (err) {
            setNote("Network error. Is your server running?");
            setBusy(false);
        }
    });
})();

//footer - year
(function setYear() {
    const yearEl = document.getElementById("year");
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
})();
