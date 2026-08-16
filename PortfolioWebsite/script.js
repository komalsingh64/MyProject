const texts = [
    "💻 Computer Science Student",
    "🚀 Aspiring Software Developer",
    "☕ Java Learner",
    "🎯 Future Software Engineer"
];

let count = 0;
const textElement = document.getElementById("typing-text");

setInterval(() => {

    textElement.classList.add("fade");

    setTimeout(() => {
        count = (count + 1) % texts.length;
        textElement.innerText = texts[count];
        textElement.classList.remove("fade");
    }, 500);

}, 2500);