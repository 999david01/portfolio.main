"use strict";

(function initCursor() {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;

    const big = cursor.querySelector(".cursor__ball--big");
    const small = cursor.querySelector(".cursor__ball--small");
    if (!big || !small) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let bigX = mouseX;
    let bigY = mouseY;

    function onMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        small.style.transform =
            `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
    }

    function tick() {
        // Smooth follow for big circle
        bigX += (mouseX - bigX) * 0.12;
        bigY += (mouseY - bigY) * 0.12;

        big.style.transform =
            `translate(${bigX - 15}px, ${bigY - 15}px)`;

        requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    tick();
})();
