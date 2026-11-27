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
