const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");

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
  quoteEl.textContent = quote;
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

  // accuracy
  let correct = 0;
  quote.split("").forEach((char, i) => {
    if (typedText[i] === char) correct++;
  });

  const accuracy = Math.round((correct / typedText.length) * 100);
  accuracyEl.textContent = isNaN(accuracy) ? 100 : accuracy + "%";

  // WPM
  const timeElapsed = (new Date() - startTime) / 1000 / 60;
  const words = typedText.length / 5;
  const wpm = Math.round(words / timeElapsed);

  wpmEl.textContent = isNaN(wpm) ? 0 : wpm;
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

  getRandomQuote();
});

getRandomQuote();
