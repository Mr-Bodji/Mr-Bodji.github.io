// ============================================================
// 1. Les actions possibles (CHANGE LES TEXTES POUR METTRE TES BLAGUES !)
//    energie / moral / projet = de combien la jauge monte (+) ou descend (-)
// ============================================================
const actions = [
  { nom: "☕ Boire un café", energie: 25, moral: 5, projet: 0,
    message: "Ton cœur bat à 180 bpm. Tu te sens invincible." },
  { nom: "😴 Dormir", energie: 40, moral: 10, projet: -5,
    message: "Tu rêves de points-virgules. Le projet n'a pas avancé." },
  { nom: "💻 Coder", energie: -20, moral: -5, projet: 20,
    message: "Tu écris du code. Il marche. Tu ne sais pas pourquoi." },
  { nom: "📺 Regarder une série", energie: -5, moral: 25, projet: -10,
    message: "« Juste un épisode. » Il est 3h du matin." }
];

// ============================================================
// 2. Les éléments de la page
// ============================================================
const visage = document.querySelector("#visage");
const message = document.querySelector("#message");
const barreEnergie = document.querySelector("#barre-energie");
const barreMoral = document.querySelector("#barre-moral");
const barreProjet = document.querySelector("#barre-projet");
const zoneBoutons = document.querySelector("#boutons");
const boutonRecommencer = document.querySelector("#recommencer");
const affichageVictoires = document.querySelector("#victoires");

// ============================================================
// 3. L'état du jeu, retrouvé dans le localStorage s'il existe
// ============================================================
let stats = JSON.parse(localStorage.getItem("statsEtudiant")) || { energie: 60, moral: 60, projet: 0 };
let victoires = Number(localStorage.getItem("victoiresEtudiant")) || 0;
let partieFinie = false;

// ============================================================
// 4. Les fonctions
// ============================================================

// Empêche une jauge de dépasser 100 ou de passer sous 0
function limiter(valeur) {
  return Math.max(0, Math.min(100, valeur));
}

// Met à jour tout ce qu'on voit à l'écran
function afficher() {
  barreEnergie.style.width = stats.energie + "%";
  barreMoral.style.width = stats.moral + "%";
  barreProjet.style.width = stats.projet + "%";
  affichageVictoires.textContent = victoires;
}

// Vérifie si la partie est gagnée ou perdue (des conditions if / else if)
function verifierFin() {
  if (stats.projet >= 100) {
    if (stats.energie <= 0) {
      // Victoire, mais complètement épuisé : phrase spéciale
      message.textContent = "Même si tu t'es gaspillé pour faire ce projet, tu as réussi, champion.";
      visage.textContent = "🥹";
    } else {
      message.textContent = "🏆 Projet rendu à temps ! Tu es sauvé.";
      visage.textContent = "😎";
    }
    partieFinie = true;
    victoires = victoires + 1;
    localStorage.setItem("victoiresEtudiant", victoires);
  } else if (stats.energie <= 0) {
    message.textContent = "Tu t'es endormi sur ton clavier. Fin de partie.";
    visage.textContent = "😵";
    partieFinie = true;
  } else if (stats.moral <= 0) {
    message.textContent = "Tu as tout abandonné pour devenir fermier. Fin de partie.";
    visage.textContent = "😭";
    partieFinie = true;
  } else if (stats.energie < 25 || stats.moral < 25) {
    visage.textContent = "😟";
  } else {
    visage.textContent = "🙂";
  }
}

// Ce qui se passe quand on clique sur une action
function agir(action) {
  if (partieFinie) return; // plus d'action possible si la partie est finie

  stats.energie = limiter(stats.energie + action.energie);
  stats.moral = limiter(stats.moral + action.moral);
  stats.projet = limiter(stats.projet + action.projet);
  message.textContent = action.message;

  // Animation de rebond (on retire puis remet la classe pour la rejouer)
  visage.classList.remove("rebond");
  void visage.offsetWidth;
  visage.classList.add("rebond");

  verifierFin();
  localStorage.setItem("statsEtudiant", JSON.stringify(stats));
  afficher();
}

function recommencer() {
  stats = { energie: 60, moral: 60, projet: 0 };
  partieFinie = false;
  visage.classList.remove("rebond"); // le visage retrouve son animation "flotter"
  message.textContent = "Ta journée commence. Que fais-tu ?";
  visage.textContent = "🙂";
  localStorage.setItem("statsEtudiant", JSON.stringify(stats));
  afficher();
}

// ============================================================
// 5. Au chargement : on crée un bouton par action avec une boucle
// ============================================================
for (let i = 0; i < actions.length; i = i + 1) {
  const action = actions[i];
  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = action.nom;
  bouton.addEventListener("click", function () {
    agir(action);
  });
  zoneBoutons.appendChild(bouton);
}

boutonRecommencer.addEventListener("click", recommencer);

// Si la partie sauvegardée était déjà finie, on repart d'une nouvelle partie
if (stats.projet >= 100 || stats.energie <= 0 || stats.moral <= 0) {
  recommencer();
}
afficher();
