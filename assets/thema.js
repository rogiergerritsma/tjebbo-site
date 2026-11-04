// Thema: altijd licht bij binnenkomst. Donker alleen als de bezoeker het kiest,
// en alleen voor dit bezoek (niets onthouden, niets van het systeem overnemen).
(function () {
  var root = document.documentElement;
  root.setAttribute("data-thema", "licht");
  window.wisselThema = function () {
    root.setAttribute("data-thema", root.getAttribute("data-thema") === "donker" ? "licht" : "donker");
  };
})();
