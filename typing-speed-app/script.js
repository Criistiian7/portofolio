const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");
const progressEl = document.getElementById("progress");

let time = 60;
let timer = null;
let quote = "";
let startTime;

const quotes = [
  "Practice makes perfect.",
  "JavaScript is powerful.",
  "Frontend development is fun.",
  "Consistency beats talent.",
];

function getRandomQuote() {
  quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.innerHTML = quote
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
}

function startTimer() {
  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time === 0) {
      clearInterval(timer);
      inputEl.disabled = true;
    }
  }, 1000);
}

inputEl.addEventListener("input", () => {
  if (!startTime) {
    startTime = new Date();
    startTimer();
  }

  const typedText = inputEl.value;
  const quoteSpans = quoteEl.querySelectorAll("span");

  let correct = 0;

  quoteSpans.forEach((span, i) => {
    const char = typedText[i];

    span.classList.remove("correct", "wrong", "current");

    if (char == null) {
      span.classList.add("current");
    } else if (char === span.textContent) {
      span.classList.add("correct");
      correct++;
    } else {
      span.classList.add("wrong");
    }
  });

  // Accuracy
  const accuracy = Math.round((correct / typedText.length) * 100);
  accuracyEl.textContent = isNaN(accuracy) ? "100%" : accuracy + "%";

  // WPM
  const timeElapsed = (new Date() - startTime) / 1000 / 60;
  const words = typedText.length / 5;
  const wpm = Math.round(words / timeElapsed);
  wpmEl.textContent = isNaN(wpm) ? 0 : wpm;

  // Progress
  const progress = (typedText.length / quote.length) * 100;
  progressEl.style.width = progress + "%";
});

restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  time = 60;
  startTime = null;

  inputEl.value = "";
  inputEl.disabled = false;

  timeEl.textContent = time;
  wpmEl.textContent = 0;
  accuracyEl.textContent = "100%";
  progressEl.style.width = "0%";

  getRandomQuote();
});

getRandomQuote();
