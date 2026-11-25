// ---------- Configuration des niveaux ----------
const LEVELS = {
  facile:    { min: 1, max: 50,  essais: 10 },
  moyen:     { min: 1, max: 100, essais: 10 },
  difficile: { min: 1, max: 200, essais: 8 },
};

// ---------- Éléments de la page ----------
const consigneEl  = document.getElementById("consigne");
const difficultyEl = document.getElementById("difficulty");
const pillsEl     = document.getElementById("pills");
const bestEl      = document.getElementById("best");
const rangeFillEl = document.getElementById("range-fill");
const rangeMinEl  = document.getElementById("range-min");
const rangeMaxEl  = document.getElementById("range-max");
const rangeTextEl = document.getElementById("range-text");
const formEl      = document.getElementById("form");
const guessEl     = document.getElementById("guess");
const submitEl    = document.getElementById("submit");
const messageEl   = document.getElementById("message");
const historyEl   = document.getElementById("history");
const replayEl    = document.getElementById("replay");
const themeBtn    = document.getElementById("theme-btn");

// ---------- État du jeu ----------
let currentLevel = "moyen";
let secret = 0;
let used = 0;       // essais utilisés
let low = 1;        // borne basse encore possible
let high = 100;     // borne haute encore possible
let finished = false;

// ---------- Utilitaires ----------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBest(level) {
  try {
    const value = localStorage.getItem("devinette_best_" + level);
    return value ? Number(value) : null;
  } catch (e) {
    return null;
  }
}

function saveBest(level, value) {
  try {
    localStorage.setItem("devinette_best_" + level, String(value));
  } catch (e) {
    // localStorage indisponible : on ignore
  }
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "message " + type;
  // Relance l'animation
  void messageEl.offsetWidth;
  messageEl.classList.add("pop");
}

function clearMessage() {
  messageEl.textContent = "";
  messageEl.className = "message";
}

function addHistory(guess, type) {
  const empty = historyEl.querySelector(".empty");
  if (empty) empty.remove();

  const li = document.createElement("li");
  li.classList.add(type);
  if (type === "high") li.textContent = guess + " ↓ Trop grand";
  else if (type === "low") li.textContent = guess + " ↑ Trop petit";
  else li.textContent = guess + " ✓";
  historyEl.appendChild(li);
}

function resetHistory() {
  historyEl.innerHTML = "";
  const li = document.createElement("li");
  li.className = "empty";
  li.textContent = "Aucun essai pour le moment";
  historyEl.appendChild(li);
}

// ---------- Affichage ----------
function render() {
  const cfg = LEVELS[currentLevel];

  // Consigne
  consigneEl.textContent =
    "Trouve le nombre entre " + cfg.min + " et " + cfg.max + " en " + cfg.essais + " essais.";

  // Pastilles d'essais
  pillsEl.innerHTML = "";
  for (let i = 0; i < cfg.essais; i++) {
    const pill = document.createElement("span");
    pill.className = "pill" + (i < used ? " used" : "");
    pillsEl.appendChild(pill);
  }

  // Jauge de l'intervalle encore possible
  const total = cfg.max - cfg.min + 1;
  const left = ((low - cfg.min) / total) * 100;
  const width = ((high - low + 1) / total) * 100;
  rangeFillEl.style.left = left + "%";
  rangeFillEl.style.width = width + "%";
  rangeMinEl.textContent = cfg.min;
  rangeMaxEl.textContent = cfg.max;
  rangeTextEl.textContent = "Entre " + low + " et " + high;

  // Meilleur score
  const best = getBest(currentLevel);
  bestEl.textContent = best === null ? "—" : best + " essai" + (best > 1 ? "s" : "");

  // Boutons de difficulté
  difficultyEl.querySelectorAll("button").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.level === currentLevel);
  });
}

// ---------- Logique du jeu ----------
function newGame() {
  const cfg = LEVELS[currentLevel];
  secret = randomInt(cfg.min, cfg.max);
  used = 0;
  low = cfg.min;
  high = cfg.max;
  finished = false;

  guessEl.value = "";
  guessEl.min = cfg.min;
  guessEl.max = cfg.max;
  guessEl.disabled = false;
  submitEl.disabled = false;
  replayEl.classList.add("hidden");

  clearMessage();
  resetHistory();
  render();
  guessEl.focus();
}

function endGame(won) {
  finished = true;
  guessEl.disabled = true;
  submitEl.disabled = true;
  replayEl.classList.remove("hidden");

  if (won) {
    const best = getBest(currentLevel);
    if (best === null || used < best) saveBest(currentLevel, used);
    setMessage(
      "Bravo ! Tu as trouvé " + secret + " en " + used + " essai" + (used > 1 ? "s" : "") + " 🎉",
      "win"
    );
    launchConfetti();
  } else {
    setMessage("Perdu ! Le nombre secret était " + secret + " 😢", "lose");
  }
  render();
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  if (finished) return;

  const cfg = LEVELS[currentLevel];
  const raw = guessEl.value.trim();
  const guess = Number(raw);

  // Saisie invalide : message d'erreur, aucun essai consommé
  if (raw === "" || !Number.isInteger(guess) || guess < cfg.min || guess > cfg.max) {
    setMessage("Entre un nombre entier entre " + cfg.min + " et " + cfg.max + ".", "error");
    guessEl.select();
    return;
  }

  used++;

  if (guess === secret) {
    addHistory(guess, "win");
    endGame(true);
    return;
  }

  if (guess > secret) {
    high = Math.min(high, guess - 1);
    addHistory(guess, "high");
    setMessage("Trop grand !", "high");
  } else {
    low = Math.max(low, guess + 1);
    addHistory(guess, "low");
    setMessage("Trop petit !", "low");
  }

  if (used >= cfg.essais) {
    endGame(false);
    return;
  }

  guessEl.value = "";
  guessEl.focus();
  render();
});

replayEl.addEventListener("click", newGame);

difficultyEl.addEventListener("click", function (event) {
  const btn = event.target.closest("button[data-level]");
  if (!btn) return;
  currentLevel = btn.dataset.level;
  newGame();
});

// ---------- Mode sombre / clair ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  try {
    localStorage.setItem("devinette_theme", theme);
  } catch (e) {
    // ignoré
  }
}

themeBtn.addEventListener("click", function () {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

(function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("devinette_theme");
  } catch (e) {
    saved = null;
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
})();

// ---------- Confettis ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  const colors = ["#6366f1", "#22c55e", "#f97316", "#3b82f6", "#ec4899", "#eab308"];
  particles = [];
  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 6 + Math.random() * 6,
      speedX: -2 + Math.random() * 4,
      speedY: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: -6 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  if (animationId) cancelAnimationFrame(animationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(function (p) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });

  particles = particles.filter(function (p) {
    return p.y < canvas.height + 20;
  });

  if (particles.length > 0) {
    animationId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = null;
  }
}

// ---------- Démarrage ----------
newGame();