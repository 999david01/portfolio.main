// ========================================================================
// CUSTOM CURSOR
// Smooth cursor with hover effects
// ========================================================================

(function initCursor() {
    // Check if device is mobile/touch
    if (window.matchMedia("(max-width: 768px)").matches) {
        return;
    }

    const big = document.querySelector(".cursor-ball.big");
    const small = document.querySelector(".cursor-ball.small");
    
    if (!big || !small) return;

    let mouseX = 0;
    let mouseY = 0;
    let bigX = 0;
    let bigY = 0;
    let smallX = 0;
    let smallY = 0;

    // Update mouse position
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Small dot follows instantly
        small.style.left = mouseX + "px";
        small.style.top = mouseY + "px";
    });

    // Animate big cursor smoothly
    function animate() {
        // Smoother interpolation for big cursor (lower = silkier follow)
        const ease = 0.11;
        bigX += (mouseX - bigX) * ease;
        bigY += (mouseY - bigY) * ease;

        big.style.left = bigX + "px";
        big.style.top = bigY + "px";

        requestAnimationFrame(animate);
    }

    animate();

    // Hover effects
    const hoverElements = document.querySelectorAll(
        "a, button, .hoverable, input, textarea, .project-card, .skill-card"
    );

    hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            big.classList.add("hover");
        });

        el.addEventListener("mouseleave", () => {
            big.classList.remove("hover");
        });
    });

    // Hide cursor when mouse leaves window
    document.addEventListener("mouseleave", () => {
        big.style.opacity = "0";
        small.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        big.style.opacity = "1";
        small.style.opacity = "1";
    });

    // Smooth opacity transition when leaving/entering window
    [big, small].forEach((el) => {
        el.style.transition = "opacity 0.25s cubic-bezier(0.33, 1, 0.68, 1)";
    });
})();
