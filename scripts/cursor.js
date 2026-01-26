const big = document.querySelector(".cursor-ball.big");
const small = document.querySelector(".cursor-ball.small");

document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Small dot follows instantly
    small.style.left = x + "px";
    small.style.top = y + "px";

    // Big dot trails smoothly
    big.animate(
        {
            left: x + "px",
            top: y + "px"
        },
        {
            duration: 120,
            fill: "forwards"
        }
    );
});

// Hover grow effect
document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button")) {
        big.style.transform = "translate(-50%, -50%) scale(2)";
    }
});

document.addEventListener("mouseout", () => {
    big.style.transform = "translate(-50%, -50%) scale(1)";
});
