// Thema: volgt het systeem, tenzij de bezoeker zelf kiest (onthouden in de browser).
(function () {
  var SLEUTEL = "tg_thema", root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function opgeslagen() { try { return localStorage.getItem(SLEUTEL); } catch (e) { return null; } }
  function systeem() { return media.matches ? "donker" : "licht"; }
  function zet(t) { root.setAttribute("data-thema", t); }
  zet(opgeslagen() || systeem());
  media.addEventListener("change", function () { if (!opgeslagen()) zet(systeem()); });
  window.wisselThema = function () {
    var nieuw = root.getAttribute("data-thema") === "donker" ? "licht" : "donker";
    try { nieuw === systeem() ? localStorage.removeItem(SLEUTEL) : localStorage.setItem(SLEUTEL, nieuw); } catch (e) {}
    zet(nieuw);
  };
})();
