"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("downloadResume");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const link = document.createElement("a");
        link.href = "files/resume.pdf";
        link.download = "resume.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
