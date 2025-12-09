import * as Tone from "tone.js";

// données des heros

const heroes = [
  {
    id: "volt",
    nom: "Volt",
    alias: "Maître de l'orage",
    statut: "Disponible",
    quartier: "Centre",
    sante: 92,
    energie: 78,
    missionsReussies: 34,
    niveauMenacePref: "Haute intensité",
    couleur: "#27e0ff",
    force: 88,
    agilite: 82,
    vitesse: 95,
    intelligence: 79,
    controlePouvoir: 86
  },
  {
    id: "spectre",
    nom: "Spectre",
    alias: "Opératrice fantôme",
    statut: "En mission",
    quartier: "Nord",
    sante: 76,
    energie: 64,
    missionsReussies: 51,
    niveauMenacePref: "Infiltration / furtif",
    couleur: "#ff3b7f",
    force: 62,
    agilite: 94,
    vitesse: 88,
    intelligence: 91,
    controlePouvoir: 89
  },
  {
    id: "titan",
    nom: "Titan",
    alias: "Bouclier de la ville",
    statut: "En repos",
    quartier: "Ouest",
    sante: 88,
    energie: 40,
    missionsReussies: 28,
    niveauMenacePref: "Affrontement direct",
    couleur: "#ffb347",
    force: 96,
    agilite: 58,
    vitesse: 72,
    intelligence: 73,
    controlePouvoir: 80
  },
  {
    id: "neon",
    nom: "Néon",
    alias: "Courrier quantique",
    statut: "Disponible",
    quartier: "Sud",
    sante: 69,
    energie: 95,
    missionsReussies: 19,
    niveauMenacePref: "Interventions rapides",
    couleur: "#7b6cff",
    force: 71,
    agilite: 88,
    vitesse: 99,
    intelligence: 77,
    controlePouvoir: 83
  }
];

const heroesListEl   = document.querySelector("#heroesList");
const heroDetailsEl  = document.querySelector("#heroDetails");
const alertsListEl   = document.querySelector("#alertsList");
const clockEl        = document.querySelector("#hudClock");
const alertModeBtn   = document.querySelector("#alertModeBtn");

let currentHeroId = null;
let alertMode = false;

// tonejs

let uiSynth = null;

async function playUiBeep(note = "A4") {
  try {
    // Tone.start() déclenché par un event user
    await Tone.start();
  } catch (error) {
    console.error("Erreur Tone.start()", error);
    return;
  }

  if (!uiSynth) {
    uiSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.1,
        release: 0.2
      }
    }).toDestination();
  }

  uiSynth.triggerAttackRelease(note, "16n");
}

function playMapPing() {
  // utilisé par map.js quand clique
  playUiBeep("D5");
}

window.playMapPing = playMapPing;

// temps horloge

function formatTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateClock() {
  if (clockEl) {
    clockEl.textContent = formatTime();
  }
}

setInterval(updateClock, 1000);
updateClock();

// alertes

function pushAlert(message) {
  if (!alertsListEl) return;

  const li = document.createElement("li");
  li.textContent = `[${formatTime()}] ${message}`;
  alertsListEl.prepend(li);

  // garder max 7 alertes (sans ?. pour rester simple)
  while (alertsListEl.children.length > 7) {
    const last = alertsListEl.lastElementChild;
    if (last) {
      alertsListEl.removeChild(last);
    } else {
      break;
    }
  }
}

// exposé pour map.js (clic sur la carte)
window.pushHudAlert = pushAlert;

// rendu de la liste des héros

function renderHeroesList() {
  if (!heroesListEl) return;

  heroesListEl.innerHTML = "";

  for (const hero of heroes) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "hero-card w-100 text-start";
    card.dataset.heroId = hero.id;

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <div class="hero-name">${hero.nom}</div>
          <div class="hero-status">${hero.alias}</div>
        </div>
        <div class="text-end">
          <div class="hero-tag text-uppercase">
            ${hero.statut}
          </div>
          <small class="text-muted" style="font-size: 0.7rem;">Secteur ${hero.quartier}</small>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      selectHero(hero.id);      
      playUiBeep("E5");         
    });

    heroesListEl.appendChild(card);
  }
}

// details heros

function renderHeroDetails(hero) {
  if (!heroDetailsEl) return;

  heroDetailsEl.innerHTML = `
    <div class="hero-details-header">
      <div>
        <div class="hero-details-name">${hero.nom}</div>
        <div class="hero-status">${hero.alias}</div>
      </div>
      <div class="hero-badges">
        <span class="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">
          ${hero.statut}
        </span>
        <span class="badge bg-dark-subtle text-light border border-secondary-subtle">
          Secteur ${hero.quartier}
        </span>
      </div>
    </div>

    <div class="hero-stats-grid">
      <div>
        <div class="hero-stat-label">Santé</div>
        <div class="hero-stat-value">${hero.sante} %</div>
        <div class="hero-meter">
          <div class="hero-meter-fill" style="width: ${hero.sante}%;"></div>
        </div>
      </div>

      <div>
        <div class="hero-stat-label">Énergie</div>
        <div class="hero-stat-value">${hero.energie} %</div>
        <div class="hero-meter">
          <div class="hero-meter-fill hero-meter-fill--energy" style="width: ${hero.energie}%;"></div>
        </div>
      </div>

      <div>
        <div class="hero-stat-label">Missions réussies</div>
        <div class="hero-stat-value">${hero.missionsReussies}</div>
      </div>

      <div>
        <div class="hero-stat-label">Type de menace préféré</div>
        <div class="hero-stat-value">${hero.niveauMenacePref}</div>
      </div>
    </div>

    <div class="hero-attributes">
      <div class="hero-section-subtitle">Caractéristiques</div>

      <div class="hero-attribute-row">
        <span class="hero-attribute-label">Force</span>
        <div class="hero-meter hero-meter--compact">
          <div class="hero-meter-fill" style="width: ${hero.force}%;"></div>
        </div>
        <span class="hero-attribute-value">${hero.force} %</span>
      </div>

      <div class="hero-attribute-row">
        <span class="hero-attribute-label">Agilité</span>
        <div class="hero-meter hero-meter--compact">
          <div class="hero-meter-fill" style="width: ${hero.agilite}%;"></div>
        </div>
        <span class="hero-attribute-value">${hero.agilite} %</span>
      </div>

      <div class="hero-attribute-row">
        <span class="hero-attribute-label">Vitesse</span>
        <div class="hero-meter hero-meter--compact">
          <div class="hero-meter-fill" style="width: ${hero.vitesse}%;"></div>
        </div>
        <span class="hero-attribute-value">${hero.vitesse} %</span>
      </div>

      <div class="hero-attribute-row">
        <span class="hero-attribute-label">Intelligence</span>
        <div class="hero-meter hero-meter--compact">
          <div class="hero-meter-fill" style="width: ${hero.intelligence}%;"></div>
        </div>
        <span class="hero-attribute-value">${hero.intelligence} %</span>
      </div>

      <div class="hero-attribute-row">
        <span class="hero-attribute-label">Contrôle des pouvoirs</span>
        <div class="hero-meter hero-meter--compact">
          <div class="hero-meter-fill" style="width: ${hero.controlePouvoir}%;"></div>
        </div>
        <span class="hero-attribute-value">${hero.controlePouvoir} %</span>
      </div>
    </div>
  `;
}

// selection highlight

function highlightActiveHeroCard() {
  if (!heroesListEl) return;

  const cards = heroesListEl.querySelectorAll(".hero-card");
  cards.forEach((card) => {
    if (card.dataset.heroId === currentHeroId) {
      card.classList.add("hero-card--active");
    } else {
      card.classList.remove("hero-card--active");
    }
  });
}

function selectHero(heroId) {
  const hero = heroes.find((h) => h.id === heroId);
  if (!hero) return;

  currentHeroId = heroId;
  renderHeroDetails(hero);
  highlightActiveHeroCard();
  pushAlert(`Héros sélectionné : ${hero.nom}`);

  if (window.focusHeroOnMap) {
    window.focusHeroOnMap(hero.quartier);
  }
}

// mode alerte

if (alertModeBtn) {
  alertModeBtn.addEventListener("click", () => {
    alertMode = !alertMode;

    if (alertMode) {
      alertModeBtn.classList.remove("btn-outline-danger");
      alertModeBtn.classList.add("btn-danger");
      pushAlert("Mode alerte activé.");
      playUiBeep("G4");
    } else {
      alertModeBtn.classList.remove("btn-danger");
      alertModeBtn.classList.add("btn-outline-danger");
      pushAlert("Mode alerte désactivé.");
      playUiBeep("C4");
    }
  });
}


renderHeroesList();

if (heroes.length > 0) {
  // sélection initiale (sans son, comme si le tableau était déjà chargé)
  selectHero(heroes[0].id);
}
