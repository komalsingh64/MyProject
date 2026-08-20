// 1. Fast Spinning Roles (1.8s Switch)
const roles = [
    "Future Software Engineer 🎯",
    "Java & DSA Enthusiast ☕",
    "Full-Stack Web Developer 💻",
    "AI & ML Explorer 🤖"
];

let roleIndex = 0;
const spinText = document.getElementById("spin-text");

function rotateRole() {
    if (!spinText) return;
    
    spinText.classList.add("fade-out");
    spinText.classList.remove("fade-in");

    setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        spinText.textContent = roles[roleIndex];
        spinText.classList.remove("fade-out");
        spinText.classList.add("fade-in");
    }, 250);
}

setInterval(rotateRole, 1800);


// 2. Reliable Active Navbar Underline Switcher
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section-block");

let isClickScrolling = false;

// Click Handler: Click karte hi line switch hogi
navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");
        
        isClickScrolling = true;
        setTimeout(() => {
            isClickScrolling = false;
        }, 800);
    });
});

// Scroll Handler: Smooth window scroll detection
window.addEventListener("scroll", () => {
    if (isClickScrolling) return;

    let currentSectionId = "home";
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
            currentSectionId = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
            link.classList.add("active");
        }
    });
});