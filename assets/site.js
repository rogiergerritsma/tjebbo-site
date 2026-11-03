// cv — selectie uit openbare bronnen; wordt vervangen door het volledige cv van All Stars
const rollen = [
  {t:"Dubbel Zes", j:2025, s:"film"},
  {t:"Juf Braaksel en de Geniale Ontsnapping", j:2024, s:"film", a:"Hans"},
  {t:"Zomer in Frankrijk", j:2023, s:"film", a:"Walt (hoofdrol)"},
  {t:"Marokkaanse Bruiloft", j:2022, s:"film", a:"Michiel"},
  {t:"Wat is dan liefde", j:2019, s:"film", a:"Jonas"},
  {t:"Mijn bijzonder rare week met Tess", j:2019, s:"film", a:"vader van Sam"},
  {t:"Bankier van het Verzet", j:2018, s:"film", a:"Henri ter Meulen"},
  {t:"Riphagen", j:2016, s:"film", a:"Joop Out"},
  {t:"Schone handen", j:2015, s:"film", a:"Frans"},
  {t:"De Nieuwe Wereld", j:2013, s:"film", a:"Sjors"},
  {t:"Brammetje Baas", j:2012, s:"film", a:"Jaap Baas"},
  {t:"Zwartboek", j:2006, s:"film", a:"bewaker met accordeon"},
  {t:"Gadjé", j:2005, s:"film", a:"Ben"},
  {t:"Smeris", j:2017, s:"tv", a:"Tjebbo Leeksma"},
  {t:"Voetbalmaffia", s:"tv"},
  {t:"Toren C", s:"tv"},
  {t:"Judas", s:"tv"},
  {t:"Dertigers", s:"tv"},
  {t:"Nieuw Zeer", s:"tv"},
  {t:"De Toneelmakerij", s:"toneel", a:"vaste cast en creatief team"},
  {t:"Anatevka", s:"musical"},
  {t:"Annie", s:"musical"},
  {t:"Gelukkig ben ik gelukkig", j:2014, s:"stem", a:"voice-over"},
];
document.getElementById("lijst").innerHTML = rollen.map(r =>
  `<tr data-soort="${r.s}"><td>${r.t}</td><td class="rol">${r.a || ""}</td><td class="jaar">${r.j || ""}</td></tr>`).join("");
document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(x => x.setAttribute("aria-pressed", x === b));
  const f = b.dataset.filter;
  document.querySelectorAll("#lijst tr").forEach(r => r.classList.toggle("verborgen", f !== "alle" && r.dataset.soort !== f));
}));

// showreel — video volgt via All Stars
const doek = document.querySelector(".doek"), bijschrift = document.getElementById("bijschrift");
const showreel = () => { bijschrift.textContent = "De showreel wordt hier binnenkort vertoond."; };
doek.addEventListener("click", showreel);
doek.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showreel(); } });

// voicereel — mp3's volgen via All Stars
const sporen = [
  {t:"Voicereel", g:"compilatie", src:""},
  {t:"Commercial", g:"radio en tv", src:""},
  {t:"Animatie en nasynchronisatie", g:"karakterstemmen", src:""},
  {t:"Documentaire en voice-over", g:"verteller", src:""},
];
const audio = document.getElementById("audio"), speler = document.querySelector(".speler");
const golf = document.getElementById("golf"), melding = document.getElementById("melding");
const nuTitel = document.getElementById("nuTitel"), nuTijd = document.getElementById("nuTijd");
const N = 72; let h = 7;
// bars are built via the DOM (not innerHTML with style attributes) so a strict CSP allows them
for (let i = 0; i < N; i++) {
  h = (h * 9301 + 49297) % 233280; const r = h / 233280;
  const vorm = Math.sin(i / N * Math.PI) * .6 + .4;
  const bar = document.createElement("i");
  bar.style.height = Math.max(8, (r * .7 + .3) * vorm * 100) + "%";
  bar.style.animationDelay = (i % 9) * .08 + "s";
  golf.appendChild(bar);
}
const balken = golf.querySelectorAll("i");
const lijstF = document.getElementById("fragmenten");
lijstF.innerHTML = sporen.map((s, i) => `<li data-i="${i}" class="${i ? "" : "actief"}"><span>${s.t}</span><small>${s.g}</small></li>`).join("");
let huidig = 0;
const mmss = s => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00";
function kies(i, spelen){
  huidig = i; nuTitel.textContent = sporen[i].t;
  lijstF.querySelectorAll("li").forEach(li => li.classList.toggle("actief", +li.dataset.i === i));
  balken.forEach(b => b.classList.remove("af")); nuTijd.textContent = "0:00";
  if (sporen[i].src) { audio.src = sporen[i].src; melding.textContent = ""; if (spelen) audio.play().catch(()=>{}); }
  else { audio.removeAttribute("src"); speler.classList.remove("speelt"); melding.textContent = "Dit fragment wordt binnenkort toegevoegd."; }
}
lijstF.addEventListener("click", e => { const li = e.target.closest("li"); if (li) kies(+li.dataset.i, true); });
document.getElementById("grootspeel").addEventListener("click", () => {
  if (!sporen[huidig].src) { melding.textContent = "De voicereel wordt binnenkort toegevoegd."; return; }
  if (!audio.getAttribute("src")) audio.src = sporen[huidig].src;
  audio.paused ? audio.play().catch(()=>{}) : audio.pause();
});
golf.addEventListener("click", e => {
  if (!audio.duration) return;
  const r = golf.getBoundingClientRect(); audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
});
audio.addEventListener("play", () => speler.classList.add("speelt"));
audio.addEventListener("pause", () => speler.classList.remove("speelt"));
audio.addEventListener("ended", () => { speler.classList.remove("speelt"); if (huidig < sporen.length - 1) kies(huidig + 1, true); });
audio.addEventListener("timeupdate", () => {
  const k = Math.floor(audio.currentTime / (audio.duration || 1) * N);
  balken.forEach((b, i) => b.classList.toggle("af", i < k)); nuTijd.textContent = mmss(audio.currentTime);
});

document.getElementById("jaar").textContent = new Date().getFullYear();

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), {threshold:.12});
document.querySelectorAll(".verschijn").forEach(el => io.observe(el));
