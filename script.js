/* ========================================== */
/* ANIMATION D'OUVERTURE : MAKIMA MD-X BY THE DARKNESS */
/* ========================================== */
(function () {
  var el = document.getElementById("intro");
  if (!el) return;
  var h = document.documentElement;
  var skipBtn = document.getElementById("skipIntroBtn");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = null;

  function end() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (el.classList.contains("out")) return;
    el.classList.add("out");
    h.classList.remove("introing");
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 850);
  }

  if (reduce) {
    end();
    return;
  }

  var idx = 0;
  var groups = [
    ["MAKIMA MD-X", ""],
    ["BY THE DARKNESS", "t"]
  ];
  var markEl = document.getElementById("mark");
  if (markEl) {
    markEl.innerHTML = groups.map(function (g) {
      var letters = g[0].split("").map(function (c) {
        if (c === " ") return '<span class="sp"></span>';
        return '<span class="l" style="--i:' + (idx++) + '">' + c + "</span>";
      }).join("");
      return '<span class="g ' + g[1] + '">' + letters + "</span>";
    }).join("");
  }

  function fit() {
    if (!markEl || !markEl.parentNode) return;
    markEl.style.fontSize = "";
    var w = markEl.offsetWidth;
    var max = window.innerWidth * 0.86;
    if (w > max && w > 0) {
      markEl.style.fontSize = (parseFloat(getComputedStyle(markEl).fontSize) * max / w) + "px";
    }
  }

  fit();
  window.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  }

  h.classList.add("introing");
  timer = setTimeout(end, 6200);

  if (skipBtn) {
    skipBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      end();
    });
  }

  el.addEventListener("click", function () {
    end();
  });
})();

/* ========================================== */
/* PILES DE CARTES D'IMAGES                   */
/* ========================================== */
function initCardDeck(deckId, slidesData) {
  var deck = document.getElementById(deckId);
  if (!deck || !slidesData || !slidesData.length) return;
  var order = [];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slidesData.forEach(function (item, i) {
    var d = document.createElement("div");
    d.className = "dc";
    d.innerHTML =
      '<img src="' + item.src + '" alt="' + item.alt + '" draggable="false" loading="lazy">' +
      '<span class="num">' + (i + 1) + "/" + slidesData.length + "</span>";
    deck.appendChild(d);
    order.push(d);
  });

  function place() {
    order.forEach(function (c, i) {
      c.style.setProperty("--p", Math.min(i, 4));
      c.style.opacity = i < 5 ? 1 : 0;
      c.style.pointerEvents = i < 5 ? "auto" : "none";
    });
  }

  function nextCard() {
    order.push(order.shift());
    place();
  }

  function prevCard() {
    order.unshift(order.pop());
    place();
  }

  place();

  var x0 = null;
  var auto = null;
  function play() {
    clearInterval(auto);
    if (!reduce) {
      auto = setInterval(nextCard, 3200);
    }
  }

  deck.addEventListener("pointerdown", function (e) {
    x0 = e.clientX;
    clearInterval(auto);
  });

  deck.addEventListener("pointercancel", function () {
    x0 = null;
    play();
  });

  deck.addEventListener("pointerup", function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0;
    x0 = null;
    if (dx > 40) prevCard();
    else nextCard();
    play();
  });

  play();
}

/* ========================================== */
/* LAMPE & TOGGLE (PC + MOBILE FIABLE)        */
/* ========================================== */
let isRoomOn = false;
const room = document.getElementById("room");
const handle = document.getElementById("stringHandle");
const path = document.getElementById("stringPath");
const lampToggleSwitch = document.getElementById("lampToggleSwitch");
const lampToggleLabel = document.getElementById("lampToggleLabel");
const lampPrompt = document.getElementById("lampPrompt");

let isDragging = false;
let startY = 0;
let currentPullY = 0;
let movedEnoughToDrag = false;
const pullThreshold = 26;

function updateStringPath(pullY) {
  const d = `M 0 0 L 0 ${80 + pullY}`;
  if (path) path.setAttribute("d", d);
}

function setRoomLightState(state) {
  isRoomOn = Boolean(state);
  if (room) {
    room.classList.toggle("on", isRoomOn);
  }
  if (lampToggleSwitch) {
    lampToggleSwitch.checked = isRoomOn;
  }
  if (lampToggleLabel) {
    lampToggleLabel.textContent = isRoomOn ? "Lampe allumée" : "Lampe éteinte";
  }
}

function toggleRoomLight() {
  setRoomLightState(!isRoomOn);
}

if (lampToggleSwitch) {
  lampToggleSwitch.addEventListener("change", (e) => {
    setRoomLightState(e.target.checked);
  });
}

if (lampPrompt) {
  lampPrompt.addEventListener("click", () => {
    toggleRoomLight();
  });
}

function getClientY(e) {
  if (typeof e.clientY === "number") return e.clientY;
  if (e.touches && e.touches[0]) return e.touches[0].clientY;
  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientY;
  return 0;
}

if (handle) {
  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isDragging = true;
    movedEnoughToDrag = false;
    startY = getClientY(e);
    currentPullY = 0;
    handle.classList.add("dragging");
    try {
      handle.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  handle.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaY = Math.max(0, Math.min(110, getClientY(e) - startY));
    if (deltaY > 6) movedEnoughToDrag = true;
    currentPullY = deltaY;
    handle.style.transform = `translateY(${deltaY}px)`;
    updateStringPath(deltaY);
  });

  function finishPull(e) {
    if (!isDragging) return;
    isDragging = false;
    handle.classList.remove("dragging");
    try {
      handle.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (currentPullY >= pullThreshold || !movedEnoughToDrag) {
      toggleRoomLight();
    }

    currentPullY = 0;
    movedEnoughToDrag = false;
    handle.style.transform = "";
    updateStringPath(0);
  }

  handle.addEventListener("pointerup", finishPull);
  handle.addEventListener("pointercancel", finishPull);

  handle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleRoomLight();
    }
  });
}

/* ========================================== */
/* GESTION AUTHENTIFICATION (Connexion/Insc)  */
/* ========================================== */
function toggleAuthForms(mode) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (!loginForm || !signupForm) return;
  if (mode === "signup") {
    loginForm.style.display = "none";
    signupForm.style.display = "flex";
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
  }
}

const loginFormEl = document.getElementById("loginForm");
if (loginFormEl) {
  loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginId").value;

    Swal.fire({
      title: "Connexion...",
      text: "Accès à votre espace Makima m-dx",
      icon: "success",
      background: "#111",
      color: "#fff",
      timer: 1200,
      showConfirmButton: false
    }).then(() => {
      enterApp(user);
    });
  });
}

const signupFormEl = document.getElementById("signupForm");
if (signupFormEl) {
  signupFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;

    Swal.fire({
      title: "Compte créé !",
      text: "Bienvenue parmi nous, " + name,
      icon: "success",
      background: "#111",
      color: "#fff",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      enterApp(name, email);
    });
  });
}

function enterApp(username, email = "utilisateur@example.com") {
  if (room) room.style.display = "none";
  const app = document.getElementById("appContainer");
  if (app) app.style.display = "flex";

  const profileContent = document.getElementById("profileContent");
  if (profileContent) {
    profileContent.innerHTML = `
      <div><strong>Utilisateur :</strong> ${username}</div>
      <div><strong>Email :</strong> ${email}</div>
      <div><strong>Statut Bot :</strong> <span class="text-accent">Actif</span></div>
    `;
  }

  animateStats();
  animateSteps();
}

function secureLogout() {
  Swal.fire({
    title: "Déconnexion",
    text: "Voulez-vous vraiment vous déconnecter ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui",
    cancelButtonText: "Non",
    background: "#111",
    color: "#fff",
    confirmButtonColor: "#ffd600"
  }).then((result) => {
    if (result.isConfirmed) {
      const app = document.getElementById("appContainer");
      if (app) app.style.display = "none";
      if (room) {
        room.style.display = "flex";
      }
      setRoomLightState(false);
    }
  });
}

/* ========================================== */
/* NAVIGATION INTERNE                         */
/* ========================================== */
function showSection(sectionName) {
  const sections = ["home", "commands", "profile", "pairing", "credits"];
  sections.forEach((sec) => {
    const el = document.getElementById(sec + "Section");
    if (el) el.style.display = "none";
  });
  const target = document.getElementById(sectionName + "Section");
  if (target) target.style.display = "block";

  if (sectionName === "home") {
    animateStats();
    animateSteps();
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const ham = document.getElementById("hamburgerBtn");
  if (menu) menu.classList.toggle("open");
  if (ham) ham.classList.toggle("open");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const ham = document.getElementById("hamburgerBtn");
  if (menu) menu.classList.remove("open");
  if (ham) ham.classList.remove("open");
}

/* ========================================== */
/* INITIALISATION DES PILES DE CARTES         */
/* ========================================== */
var makimaImages = [
  { src: "image/1.jpg", alt: "Makima 1" },
  { src: "image/2.jpg", alt: "Makima 2" },
  { src: "image/3.jpg", alt: "Makima 3" },
  { src: "image/4.jpg", alt: "Makima 4" },
  { src: "image/5.jpg", alt: "Makima 5" }
];

initCardDeck("homeDeck", makimaImages);
initCardDeck("creditsDeck", makimaImages);

/* ========================================== */
/* STATISTIQUES & ÉTAPES (ANIMATION FLUIDE)   */
/* ========================================== */
function animateCounter(el, target, suffix, duration) {
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    el.textContent = target.toLocaleString("fr-FR") + suffix;
    return;
  }
  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = current.toLocaleString("fr-FR") + suffix;
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
}

function animateStats() {
  animateCounter(document.getElementById("statDeploys"), 1245, "", 1300);
  animateCounter(document.getElementById("statFree"), 100, "%", 1000);
  animateCounter(document.getElementById("statMessages"), 89432, "", 1600);
}

function animateSteps() {
  const steps = document.querySelectorAll(".step-card");
  steps.forEach((step) => {
    step.classList.remove("visible");
  });
  requestAnimationFrame(() => {
    steps.forEach((step) => {
      step.classList.add("visible");
    });
  });
}

/* ========================================== */
/* BOT-CONNECT CODE & MODALE                  */
/* ========================================== */
let timerInterval = null;
function requestPairingCode(e) {
  e.preventDefault();
  const prefixEl = document.getElementById("pairPrefix");
  const phoneInput = document.getElementById("pairPhone");
  const rawPhone = phoneInput ? phoneInput.value.trim() : "";
  if (!rawPhone) return;

  const prefix = prefixEl ? prefixEl.value : "";
  const formattedPhone = rawPhone.startsWith("+") ? rawPhone : `${prefix} ${rawPhone}`;

  const code = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" +
               Math.random().toString(36).substring(2, 6).toUpperCase();

  const overlay = document.getElementById("codeOverlay");
  const display = document.getElementById("codeDisplay");
  const targetEl = document.getElementById("modalTargetPhone");

  if (targetEl) targetEl.textContent = "Numéro lié : " + formattedPhone;
  if (display) {
    display.innerHTML = code.split("").map((c) => `<span class="code-cell">${c}</span>`).join("");
  }
  if (overlay) {
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
  }

  startTimer(300);
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  let remaining = seconds;
  const disp = document.getElementById("timerDisplay");

  function renderTime() {
    if (!disp) return;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    disp.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  renderTime();
  timerInterval = setInterval(() => {
    if (--remaining < 0) {
      clearInterval(timerInterval);
      if (disp) disp.textContent = "Code expiré";
      return;
    }
    renderTime();
  }, 1000);
}

function closeModal() {
  const overlay = document.getElementById("codeOverlay");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  }
  clearInterval(timerInterval);
}

function copyCode() {
  const cells = document.querySelectorAll(".code-cell");
  let codeStr = "";
  cells.forEach((c) => {
    codeStr += c.textContent;
  });

  navigator.clipboard.writeText(codeStr).then(() => {
    Swal.fire({
      title: "Copié !",
      text: "Code copié dans le presse-papiers.",
      icon: "success",
      background: "#111",
      color: "#fff",
      timer: 1000,
      showConfirmButton: false
    });
  });
}
