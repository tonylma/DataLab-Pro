const SOURCE_GUIDES = {
  appName: 'DataLab Pro',
  version: '1.0.0',
  protectedSources: [
    'MDN Web Docs',
    'PostgreSQL Docs',
    'Microsoft Excel Support',
    'NIST / AI RMF',
    'OWASP',
    'CNIL / GDPR',
    'HBR / McKinsey analytical playbooks'
  ],
  rules: [
    'Verify source status before accepting new material',
    'Prefer official documentation and standards',
    'Cross-check with at least 2 authoritative references before archival update',
    'Reject unsupported claims or unverified vendor marketing language'
  ]
};

const STORE_KEY = 'datalab_pro_v5';
const FAV_KEY = 'datalab_pro_favs_v5';
const NOTES_KEY = 'datalab_pro_notes_v5';
const THEME_KEY = 'datalab_pro_theme_v5';

const state = {
  modules: [],
  concepts: [],
  lexicon: [],
  guides: [],
  faq: [],
  updates: {},
  nav: 'accueil',
  theme: 'auto',
  ficheTab: 'sql',
  conceptCat: '',
  query: '',
  lang: 'fr',
  fav: false,
  cat: '',
  skills: [],
  project: [],
  exercises: [],
  notes: {},
  favorites: {}
};

const EXERCISES = [
  { lvl: 1, title: 'Sélectionner et trier', cat: 'SQL', desc: 'Afficher commande_id, ville, montant triés par montant décroissant.', sol: "SELECT commande_id, ville, montant\nFROM commandes\nORDER BY montant DESC;", explain: 'ORDER BY trie le résultat. DESC inverse l’ordre.' },
  { lvl: 1, title: 'Filtrer sur deux conditions', cat: 'SQL', desc: 'Commandes payées et supérieure à 20 000.', sol: "SELECT * FROM commandes\nWHERE statut = 'Payée' AND montant > 20000;", explain: 'AND exige que les deux conditions soient vraies.' },
  { lvl: 1, title: 'Moyenne vs médiane', cat: 'Stats', desc: 'Série [100, 110, 120, 130, 900].', sol: 'Moyenne = 272 ; Médiane = 120.', explain: 'La moyenne est tirée par les valeurs extrêmes.' },
  { lvl: 2, title: 'GROUP BY + HAVING', cat: 'SQL', desc: 'CA par ville, garder uniquement les villes avec CA > 100000.', sol: "SELECT ville, SUM(montant) AS ca\nFROM commandes\nWHERE statut = 'Payée'\nGROUP BY ville\nHAVING SUM(montant) > 100000;", explain: 'WHERE filtre les lignes avant agrégation ; HAVING filtre les groupes après.' },
  { lvl: 2, title: 'Ligne anti-jointure', cat: 'SQL', desc: 'Clients sans commande.', sol: "SELECT c.* FROM clients c\nLEFT JOIN commandes co ON co.client_id = c.client_id\nWHERE co.commande_id IS NULL;", explain: 'LEFT JOIN garde tous les clients ; NULL indique l’absence de commande.' },
  { lvl: 2, title: 'SOMME.SI.ENS', cat: 'Excel', desc: 'Somme des montants où ville = Abidjan et statut = Payée.', sol: '=SOMME.SI.ENS(C2:C500;D2:D500;"Payée";A2:A500;"Abidjan")', explain: 'La plage de somme est la première donnée de la formule.' },
  { lvl: 3, title: 'Dernier relevé par groupe', cat: 'SQL', desc: 'Dernier prix par marché et produit.', sol: "WITH t AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY marche, produit ORDER BY date_releve DESC) AS rn\n  FROM prix_marche\n)\nSELECT * FROM t WHERE rn = 1;", explain: 'ROW_NUMBER permet de numériser les lignes au sein de chaque partition.' },
  { lvl: 3, title: 'Précision d’un détecteur', cat: 'Fraude', desc: '100 fraudes sur 10 000 transactions, sensibilité 80 %, spécificité 95 %.', sol: 'TP = 80 ; FN = 20 ; FP = 495 ; TN = 9405 ; Précision = 80/(80+495) ≈ 13,9%.', explain: 'La base rate faible fait exploser le nombre de faux positifs.' },
  { lvl: 4, title: 'Résumé exécutif', cat: 'Analyse', desc: 'Rédiger en 5 phrases le constat d’une baisse de CA.', sol: '« Le CA baisse de 8 %, concentré sur le segment B2B. La baisse est réelle et non imputable à un artefact. La principale hypothèse est la hausse tarifaire client. Recommandation : revoir la grille commerciale. »', explain: 'Le BLUF commence par la conclusion et les chiffres clés.' }
];

const CASES = [
  {
    cat: 'Fraude bancaire',
    title: 'Détection de transactions atypiques',
    context: 'Banque de détail, 500k transactions/mois, fraude confirmée 0,3%.',
    dataset: 'Transactions, clients, alertes.',
    questions: ['Comment évaluer un système à 500 alertes/jour ?', 'Effet du seuil 1M FCFA ?', 'Détecter le smurfing ?', '3 requêtes SQL utiles ?'],
    rubric: 'Précision/rappel, revue humaine, données représentatives.'
  },
  {
    cat: 'Retail',
    title: 'Baisse du panier moyen',
    context: 'Chaîne de distribution, panier moyen T2 -12% vs T1.',
    dataset: 'Ventes, produits, clients.',
    questions: ['Décomposer le changement ?', 'Le mix est-il dégradé ?', 'RFM ?', 'Actions concrètes ?'],
    rubric: 'Décomposition rigoureuse, impact par segment, priorisation.'
  }
];

const INTERVIEW_SQL = [
  { q: 'WHERE vs HAVING ?', a: 'WHERE filtre les lignes avant agrégation, HAVING filtre les groupes après GROUP BY.' },
  { q: 'INNER vs LEFT JOIN ?', a: 'INNER garde les correspondances. LEFT garde toutes les lignes de gauche.' },
  { q: 'Détecter des doublons ?', a: 'GROUP BY avec COUNT(*) > 1, ou ROW_NUMBER() OVER (PARTITION BY ...).' },
  { q: 'NULLIF ?', a: 'Renvoie NULL si les deux valeurs sont égales, utile pour éviter la division par zéro.' }
];

const INTERVIEW_EXCEL = [
  { q: '$A$1 vs A1 ?', a: 'Le $ bloque la ligne et/ou colonne. Utilisé pour figer une référence.' },
  { q: 'RECHERCHEV vs RECHERCHEX ?', a: 'XLOOKUP est plus flexible et plus propre, surtout pour les recherches non-colonne-1.' },
  { q: 'SOMME.SI vs SOMME.SI.ENS ?', a: 'Un seul critère ou plusieurs critères. L’ordre des arguments reste critique.' }
];

const INTERVIEW_STATS = [
  { q: 'Médiane > moyenne ?', a: 'Oui, souvent quand la distribution est asymétrique à gauche ou avec valeurs basses extrêmes.' },
  { q: 'IC ?', a: 'Un intervalle contenant le vrai paramètre avec une confiance donnée sous le modèle utilisé.' },
  { q: 'p-value ?', a: 'P (résultat extrême | H0), pas P(H0 | données).' }
];

const INTERVIEW_BEHAVIORAL = [
  { q: 'Projet dont vous êtes fier ?', a: 'Répondre avec la structure STAR : Situation, Tâche, Action, Résultat.' },
  { q: 'Que faire si on ne sait pas ?', a: 'Reformuler, vérifier les hypothèses, dire ce que l’on sait et ce qu’on vérifie.' },
  { q: 'Désaccord avec un collègue ?', a: 'Reprendre les définitions, utiliser les sources, regarder la logique métier et documenter.' }
];

const QUIZ = [
  ['q1', 'WHERE filtre où ?', ['Avant le groupe', 'Après le groupe', 'Trie'], 'a'],
  ['q2', 'Anomalie = fraude ?', ['Oui', 'À investiguer', 'Ignorer'], 'b'],
  ['q3', 'LEFT JOIN ?', ['Correspondances uniquement', 'Toutes lignes de gauche + droite', 'Tout'], 'b'],
  ['q4', 'Médiane vs moyenne ?', ['Médiane plus robuste aux extrêmes', 'Moyenne plus robuste', 'Identique'], 'a'],
  ['q5', 'NULL ?', ['= NULL', 'IS NULL', '== EMPTY'], 'b'],
  ['q6', 'Précision ?', ['TP/(TP+FP)', 'TP/(TP+FN)', 'TN/(TN+FP)'], 'a'],
  ['q7', 'p-value signifie ?', ['P(H0)', 'P(données | H0)', 'Taille d’effet'], 'b'],
  ['q8', 'VAN positive ?', ['Projet non rentable', 'Projet crée de la valeur', 'Projet sans risque'], 'b'],
  ['q9', 'TCAC ?', ['Moyenne des taux annuels', 'Taux composé lissé', 'Inflation'], 'b'],
  ['q10', 'Risque résiduel ?', ['Avant contrôles', 'Après contrôles', 'Maximum'], 'b']
];

const FLASHCARDS = [
  ['SELECT vs WHERE', 'SELECT = colonnes. WHERE = filtre les lignes.'],
  ['WHERE vs HAVING', 'WHERE sur les lignes, HAVING sur les groupes.'],
  ['Médiane', 'Plus robuste que la moyenne aux valeurs extrêmes.'],
  ['NULL', 'Une valeur absente ou inconnue, jamais égale à NULL.'],
  ['Corrélation', 'Association, pas cause.'],
  ['VAN', 'Flux actualisés - investissement initial.'],
  ['Précision', 'TP / (TP + FP).'],
  ['STAR', 'Situation, Tâche, Action, Résultat.']
];

const SKILLS = [
  ['math1', 'Sommes, moyennes, médianes'],
  ['math2', 'Log, ln, puissances'],
  ['stat1', 'Descriptives complètes'],
  ['stat2', 'Inférence'],
  ['sql1', 'SELECT, WHERE'],
  ['sql2', 'GROUP BY, HAVING'],
  ['sql3', 'Jointures'],
  ['sql4', 'CTE et fenêtres'],
  ['gov1', 'Gouvernance entreprise'],
  ['gov2', 'Gouvernance données'],
  ['ri1', 'Fraude et alertes'],
  ['py1', 'Python pandas'],
  ['an1', 'Question métier'],
  ['an2', 'Contrôle qualité'],
  ['an3', 'Dashboard'],
  ['an4', 'Résumé exécutif']
];

const PROJECT_ITEMS = ['Question métier', 'Dictionnaire données', 'Qualité', 'Modèle relationnel', 'SQL', 'Indicateurs', 'Hypothèses', 'Risques', 'Recommandations', 'Résumé exécutif', 'Reproductibilité'];

const defaultStore = {
  modules: [],
  skills: [],
  exercises: [],
  project: [],
  concepts: [],
  timeSpent: 0,
  streak: 0,
  lastActive: null,
  lastNav: 'accueil'
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast('Stockage indisponible', 'error');
    return false;
  }
}

function getStore() {
  const s = safeGet(STORE_KEY, defaultStore);
  return {
    modules: Array.isArray(s.modules) ? s.modules : [],
    skills: Array.isArray(s.skills) ? s.skills : [],
    exercises: Array.isArray(s.exercises) ? s.exercises : [],
    project: Array.isArray(s.project) ? s.project : [],
    concepts: Array.isArray(s.concepts) ? s.concepts : [],
    timeSpent: typeof s.timeSpent === 'number' ? s.timeSpent : 0,
    streak: typeof s.streak === 'number' ? s.streak : 0,
    lastActive: s.lastActive || null,
    lastNav: s.lastNav || 'accueil'
  };
}

function saveStore(s) {
  safeSet(STORE_KEY, s);
}

function $(id) { return document.getElementById(id); }

function showToast(msg, type = '') {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast on' + (type === 'error' ? ' error' : '');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => { t.className = 'toast'; }, 2200);
}

function normText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateThemeBtn() {
  const btn = $('themeBtn');
  if (!btn) return;
  const iconMap = { auto: '🌓', light: '☀', dark: '🌙' };
  btn.textContent = iconMap[state.theme] || '🌓';
}

function applyTheme(theme) {
  state.theme = theme;
  const root = document.documentElement;
  if (theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  safeSet(THEME_KEY, theme);
  updateThemeBtn();
}

function cycleTheme() {
  const order = ['auto', 'light', 'dark'];
  const currentIndex = order.indexOf(state.theme);
  const next = order[(currentIndex + 1) % order.length];
  applyTheme(next);
}

function goTo(name) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.toggle('hidden', section.id !== name);
  });
  document.querySelectorAll('.navitem').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === name);
  });
  const store = getStore();
  store.lastNav = name;
  saveStore(store);
  state.nav = name;
  if ($('sidebar')) $('sidebar').classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderParcours() {
  const container = $('parcoursContainer');
  if (!container) return;
  const data = state.modules.slice(0, 20);
  const years = [
    { year: 'Licence 1 — Année 1', color: '#4f46e5', semestres: [
      { s: 'Semestre 1', objectif: 'Fondations absolues', modules: data.slice(0, 4), livrables: ['Fiche de synthèse', 'Exercice SQL', 'Rapport qualité'] },
      { s: 'Semestre 2', objectif: 'SQL avancé et qualité des données', modules: data.slice(4, 8), livrables: ['Analyse descriptive', '5 exercices', 'Pipeline simple'] }
    ]},
    { year: 'Licence 2 — Année 2', color: '#0d9488', semestres: [
      { s: 'Semestre 3', objectif: 'Inférence, économie et modélisation', modules: data.slice(8, 11), livrables: ['Test d’hypothèse', 'Régression simple', 'Analyse économique'] },
      { s: 'Semestre 4', objectif: 'Finance, gouvernance et Python', modules: data.slice(11, 16), livrables: ['Dashboard', 'Script Python', 'Étude de cas fraude'] }
    ]},
    { year: 'Licence 3 — Année 3', color: '#7c3aed', semestres: [
      { s: 'Semestre 5', objectif: 'Communication et éthique', modules: data.slice(16, 19), livrables: ['Résumé exécutif', 'Portfolio', 'Préparation entretien'] },
      { s: 'Semestre 6', objectif: 'Projet capstone et certification', modules: data.slice(19), livrables: ['Capstone complet', 'Présentation oral', 'Dossier final'] }
    ]}
  ];

  container.innerHTML = years.map(y => `
    <div class="card" style="margin-bottom:12px; border-color:${y.color}">
      <div class="cat" style="color:${y.color}">${y.year}</div>
      ${y.semestres.map(s => `
        <div style="margin-top:12px; padding:12px; border-left:4px solid ${y.color}; background: var(--bg); border-radius: 8px;">
          <strong style="color:${y.color}">${s.s}</strong>
          <p class="desc"><strong>Objectif:</strong> ${esc(s.objectif)}</p>
          <p class="desc"><strong>Modules:</strong> ${s.modules.map(m => `<a href="#" data-open-mod="${m.id}">${m.title}</a>`).join(', ')}</p>
          <ul>${s.livrables.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  `).join('');

  container.querySelectorAll('[data-open-mod]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = Number(link.getAttribute('data-open-mod'));
      goTo('curriculum');
      setTimeout(() => openModule(id), 180);
    });
  });
}

function renderModules() {
  const grid = $('moduleGrid');
  if (!grid) return;
  const store = getStore();
  grid.innerHTML = state.modules.map(module => {
    const done = store.modules.includes(module.id);
    return `
      <article class="module">
        <div class="num">M${String(module.id).padStart(2, '0')} · ${esc(module.lmd)} · ${esc(module.level)}</div>
        <h3>${esc(module.title)}</h3>
        <p>${esc(module.summary)}</p>
        <div>
          <span class="tag">${esc(module.time)}</span>
          ${done ? '<span class="tag done">✓ Validé</span>' : ''}
        </div>
        <div style="margin-top:12px"><button class="btn ${done ? '' : 'primary'}" data-mod="${module.id}">${done ? 'Revoir' : 'Étudier'}</button></div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('[data-mod]').forEach(button => {
    button.addEventListener('click', () => openModule(Number(button.dataset.mod)));
  });
}

function openModule(id) {
  const module = state.modules.find(item => item.id === id);
  if (!module) return;
  const panel = $('lessonPanel');
  if (!panel) return;
  const store = getStore();
  const done = store.modules.includes(id);
  panel.className = 'lesson';
  panel.innerHTML = `
    <div class="cat">${esc(module.lmd)} · Module ${module.id} · ${esc(module.time)} · ${esc(module.level)}</div>
    <h2>${esc(module.title)}</h2>
    <p class="desc">${esc(module.summary)}</p>
    <h3>Objectifs</h3>
    <ul>${(module.goals || []).map(goal => `<li>${esc(goal)}</li>`).join('')}</ul>
    <div class="callout">
      <strong>Exemple d’application métier :</strong> on compare la performance de deux segments, on identifie les drivers, on produit un indicateur et on recommande une action.
    </div>
    <h3>Exemple technique</h3>
    <div class="codewrap"><pre><code>SELECT ville, SUM(montant) AS ca
FROM commandes
WHERE statut = 'Payée'
GROUP BY ville
ORDER BY ca DESC;</code></pre></div>
    <h3>Vérification rapide</h3>
    <div class="quizq">
      <strong>Que signifie la moyenne pondérée ?</strong>
      <label><input type="radio" name="module-choice-${id}" value="a" /> La somme des valeurs divisée par le nombre d’éléments.</label>
      <label><input type="radio" name="module-choice-${id}" value="b" /> La somme des valeurs pondérées par les poids divisée par la somme des poids.</label>
      <label><input type="radio" name="module-choice-${id}" value="c" /> Le minimum des valeurs.</label>
    </div>
    <div id="moduleFeedback-${id}" class="result">Choisissez une réponse.</div>
    <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn" data-check="${id}">Vérifier</button>
      <button class="btn primary" data-done="${id}">${done ? 'Validé ✓' : 'Marquer comme maîtrisé'}</button>
    </div>
  `;

  panel.querySelector('[data-check]').addEventListener('click', () => {
    const choice = panel.querySelector(`input[name="module-choice-${id}"]:checked`);
    const feedback = $(`moduleFeedback-${id}`);
    if (!choice) {
      feedback.textContent = 'Choisissez une réponse.';
      feedback.className = 'result';
      return;
    }
    const correct = choice.value === 'b';
    feedback.className = 'result' + (correct ? '' : ' bad');
    feedback.innerHTML = correct ? '<strong>Correct.</strong> La moyenne pondérée tient compte du poids de chaque observation.' : '<strong>À revoir.</strong> La bonne réponse est : somme pondérée / somme des poids.';
  });

  panel.querySelector('[data-done]').addEventListener('click', () => {
    const newStore = getStore();
    if (!newStore.modules.includes(id)) newStore.modules.push(id);
    saveStore(newStore);
    renderModules();
    openModule(id);
    updateKPIs();
  });
}

function renderConcepts() {
  const chips = $('conceptChips');
  const list = $('conceptList');
  if (!chips) return;
  const cats = [...new Set(state.concepts.map(item => item.cat))];
  chips.innerHTML = `
    <button class="chip" data-cat="" aria-pressed="${state.conceptCat === '' ? 'true' : 'false'}">Tout</button>
    ${cats.map(cat => `<button class="chip" data-cat="${esc(cat)}" aria-pressed="${state.conceptCat === cat ? 'true' : 'false'}">${esc(cat)}</button>`).join('')}
  `;

  chips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const selected = chip.getAttribute('data-cat') || '';
      state.conceptCat = selected;
      renderConcepts();
    });
  });

  if (!list) return;
  const filtered = state.concepts.filter(item => !state.conceptCat || item.cat === state.conceptCat);
  list.innerHTML = filtered.map(item => `
    <div class="concept-card">
      <div class="level">${esc(item.cat)} · ${esc(item.lvl)}</div>
      <h3>${esc(item.title)}</h3>
      <p><strong>Définition :</strong> ${esc(item.definition)}</p>
      <p><strong>Exemple :</strong> ${esc(item.example)}</p>
      <p><strong>⚠ Piège :</strong> ${esc(item.pitfall)}</p>
    </div>
  `).join('');
}

function renderLexique() {
  const tbody = document.querySelector('#lexTable tbody');
  if (!tbody) return;
  const termFilter = $('lexSearch');
  const data = state.lexicon;
  const render = (filterValue) => {
    const val = normText(filterValue);
    const list = data.filter(entry => {
      const text = `${entry[0]} ${entry[1]} ${entry[2]}`;
      return !val || normText(text).includes(val);
    });
    tbody.innerHTML = list.sort((a, b) => a[0].localeCompare(b[0])).map(term => `
      <tr><td>${esc(term[0])}</td><td>${esc(term[1])} <em class="muted">→ ${esc(term[2])}</em></td></tr>
    `).join('');
  };
  render('');
  if (termFilter) termFilter.addEventListener('input', e => render(e.target.value));
}

function getFichesForTab(tab) {
  const tabs = {
    sql: [
      { cat: 'Bases', title: 'SELECT', desc: 'Sélectionner des colonnes', code: "SELECT ville, montant FROM commandes;" },
      { cat: 'Filtres', title: 'WHERE', desc: 'Filtrer sur des lignes', code: "SELECT * FROM commandes WHERE montant > 5000;" },
      { cat: 'Agrégat', title: 'SUM', desc: 'Somme par groupe', code: "SELECT ville, SUM(montant) AS ca FROM commandes GROUP BY ville;" },
      { cat: 'Fenêtres', title: 'ROW_NUMBER', desc: 'Top N par groupe', code: "SELECT *, ROW_NUMBER() OVER (PARTITION BY ville ORDER BY montant DESC) AS rn FROM commandes;" }
    ],
    excel: [
      { cat: 'Bases', title: 'SOMME', desc: 'Additionner une plage', code: '=SOMME(B2:B100)' },
      { cat: 'Bases', title: 'MOYENNE', desc: 'Calculer la moyenne', code: '=MOYENNE(B2:B100)' },
      { cat: 'Condition', title: 'SI', desc: 'Condition simple', code: '=SI(B2>1000;"Élevé";"Standard")' },
      { cat: 'Condition', title: 'SOMME.SI', desc: 'Somme conditionnelle', code: '=SOMME.SI(A2:A100;"Paris";C2:C100)' }
    ],
    equiv: [
      { cat: 'SQL / Excel', title: 'Sélection', desc: 'SELECT vs FILTRE', code: 'SELECT ville FROM commandes; // FILTRE(A2:A100; A2:A100="Paris")' },
      { cat: 'SQL / Excel', title: 'Agrégation', desc: 'SUM / SOMME', code: 'SELECT SUM(montant) ... // =SOMME(C2:C100)' },
      { cat: 'SQL / Excel', title: 'DISTINCT', desc: 'Unique', code: 'SELECT DISTINCT ville FROM commandes; // =UNIQUE(A2:A100)' }
    ],
    stats: [
      { cat: 'Descriptif', title: 'Moyenne', desc: 'Mesure la tendance centrale', code: '=MOYENNE(B2:B100)' },
      { cat: 'Descriptif', title: 'Médiane', desc: 'Robuste aux valeurs extrêmes', code: '=MEDIANE(B2:B100)' },
      { cat: 'Dispersion', title: 'Écart-type', desc: 'Mesure la dispersion', code: '=ECARTYPE.STANDARD(B2:B100)' }
    ],
    econ: [
      { cat: 'Finance', title: 'VAN', desc: 'Valeur actuelle nette', code: 'VAN = Σ CF_t/(1+r)^t - Investissement' },
      { cat: 'Finance', title: 'TRI', desc: 'Taux interne de rentabilité', code: 'TRI : r tel que VAN(r)=0' },
      { cat: 'Macro', title: 'TCAC', desc: 'Taux de croissance annuel composé', code: 'TCAC = (Vf/Vi)^(1/n)-1' }
    ],
    risk: [
      { cat: 'Fraude', title: 'Précision', desc: 'Fiabilité des alertes', code: 'Précision = TP / (TP + FP)' },
      { cat: 'Risque', title: 'Risk residual', desc: 'Risque après contrôles', code: 'Résiduel = Inhérent × (1 − Efficacité)' },
      { cat: 'Fraude', title: 'Base rate', desc: 'Taux de fraude', code: 'La base rate conditionne fortement la précision.' }
    ]
  };
  return tabs[tab] || tabs.sql;
}

function renderFiches() {
  const chips = $('chips');
  const out = $('out');
  const fiches = getFichesForTab(state.ficheTab);
  if (chips) {
    const cats = [...new Set(fiches.map(item => item.cat))];
    chips.innerHTML = `
      <button class="chip" data-fav="" aria-pressed="${state.fav ? 'true' : 'false'}">★ Favoris</button>
      ${cats.map(cat => `<button class="chip" data-cat="${esc(cat)}" aria-pressed="${state.cat === cat ? 'true' : 'false'}">${esc(cat)}</button>`).join('')}
    `;

    chips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.dataset.fav !== undefined) state.fav = !state.fav;
        else state.cat = chip.getAttribute('data-cat') || '';
        renderFiches();
      });
    });
  }

  if (!out) return;
  const list = fiches.filter(item => {
    const matchesCat = !state.cat || item.cat === state.cat;
    return matchesCat && (!state.fav || true);
  });
  out.innerHTML = `<div class="grid">${list.map(item => `
    <article class="card">
      <div class="cat">${esc(item.cat)}</div>
      <h3>${esc(item.title)}</h3>
      <p class="desc">${esc(item.desc)}</p>
      <div class="codewrap"><pre><code>${esc(item.code)}</code></pre></div>
    </article>
  `).join('')}</div>`;
}

function renderExercises() {
  const store = getStore();
  [1, 2, 3, 4].forEach(level => {
    const box = $(`ex-level-${level}`);
    if (!box) return;
    box.innerHTML = EXERCISES.filter(item => item.lvl === level).map(item => {
      const idx = EXERCISES.indexOf(item);
      const done = store.exercises.includes(idx);
      return `
        <div class="ex-card">
          <div class="ex-head"><h4>${esc(item.title)}</h4><span class="ex-tag">${esc(item.cat)}</span></div>
          <p>${esc(item.desc)}</p>
          <div class="inline-actions">
            <button class="btn sm" data-ex-sol="${idx}">Correction</button>
            <label><input type="checkbox" data-ex-done="${idx}" ${done ? 'checked' : ''} /> Résolu</label>
          </div>
          <div id="ex-sol-${idx}" class="hidden" style="margin-top:12px">
            <div class="codewrap"><pre><code>${esc(item.sol)}</code></pre></div>
            <div class="result">${esc(item.explain)}</div>
          </div>
        </div>
      `;
    }).join('');

    box.querySelectorAll('[data-ex-sol]').forEach(button => {
      button.addEventListener('click', () => {
        const id = `ex-sol-${button.dataset.exSol}`;
        const panel = $(id);
        if (panel) panel.classList.toggle('hidden');
      });
    });

    box.querySelectorAll('[data-ex-done]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const newStore = getStore();
        const idx = Number(checkbox.dataset.exDone);
        if (checkbox.checked && !newStore.exercises.includes(idx)) newStore.exercises.push(idx);
        if (!checkbox.checked) newStore.exercises = newStore.exercises.filter(id => id !== idx);
        saveStore(newStore);
        updateKPIs();
      });
    });
  });
}

function renderCases() {
  const box = $('casesContainer');
  if (!box) return;
  box.innerHTML = CASES.map(item => `
    <div class="card" style="margin-bottom:14px">
      <div class="cat">${esc(item.cat)}</div>
      <h3>${esc(item.title)}</h3>
      <p class="desc"><strong>Contexte :</strong> ${esc(item.context)}</p>
      <p class="desc"><strong>Données :</strong> ${esc(item.dataset)}</p>
      <ul>${item.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul>
      <div class="warn" style="margin-top:8px"><strong>Grille :</strong> ${esc(item.rubric)}</div>
    </div>
  `).join('');
}

function renderInterview() {
  const groups = [
    ['interview-sql', INTERVIEW_SQL],
    ['interview-excel', INTERVIEW_EXCEL],
    ['interview-stats', INTERVIEW_STATS],
    ['interview-behavioral', INTERVIEW_BEHAVIORAL]
  ];
  groups.forEach(([id, items]) => {
    const box = $(id);
    if (!box) return;
    box.innerHTML = items.map(item => `
      <details class="q-item">
        <summary>${esc(item.q)}</summary>
        <div class="ans">${esc(item.a)}</div>
      </details>
    `).join('');
  });
}

let currentQuiz = QUIZ.slice();

function renderQuiz() {
  const form = $('quizForm');
  if (!form) return;
  form.innerHTML = currentQuiz.map(([name, question, options, correct]) => `
    <div class="quizq">
      <strong>${esc(question)}</strong>
      ${options.map((option, index) => `<label><input type="radio" name="${name}" value="${String.fromCharCode(97 + index)}" /> ${esc(option)}</label>`).join('')}
    </div>
  `).join('');
}

function renderRandomQuiz() {
  const shuffled = [...QUIZ].sort(() => Math.random() - 0.5).slice(0, 10);
  currentQuiz = shuffled.map(([name, q, options, correct], index) => [`rq${index}`, q, options, correct]);
  renderQuiz();
  showToast('Quiz aléatoire : 10 questions');
}

function gradeQuiz() {
  let score = 0;
  currentQuiz.forEach(([name, , , correct]) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (checked && checked.value === correct) score += 1;
  });
  const result = $('quizResult');
  if (!result) return;
  result.classList.remove('hidden');
  const pct = Math.round((score / currentQuiz.length) * 100);
  result.innerHTML = `<strong>Score : ${score}/${currentQuiz.length} (${pct}%).</strong>`;
}

function resetQuiz() {
  currentQuiz = QUIZ.slice();
  renderQuiz();
  const result = $('quizResult');
  if (result) {
    result.classList.add('hidden');
    result.innerHTML = '';
  }
}

function renderFlashcards() {
  const wrap = $('flashcards');
  if (!wrap) return;
  wrap.innerHTML = '';
  FLASHCARDS.forEach(([q, a]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'flashcard';
    button.innerHTML = `<strong>${esc(q)}</strong><span class="muted">Cliquer pour révéler</span>`;
    let revealed = false;
    button.addEventListener('click', () => {
      revealed = !revealed;
      button.classList.toggle('revealed', revealed);
      button.innerHTML = `<strong>${esc(revealed ? a : q)}</strong><span class="muted">${revealed ? 'Masquer' : 'Révéler'}</span>`;
    });
    wrap.appendChild(button);
  });
}

function renderSkillChecklist() {
  const box = $('skillChecklist');
  if (!box) return;
  const store = getStore();
  const left = SKILLS.slice(0, Math.ceil(SKILLS.length / 2));
  const right = SKILLS.slice(Math.ceil(SKILLS.length / 2));
  box.innerHTML = `
    <div class="card">
      <h3>Techniques</h3>
      ${left.map(([key, label]) => `<label><input type="checkbox" data-skill="${key}" ${store.skills.includes(key) ? 'checked' : ''} /> ${esc(label)}</label>`).join('')}
    </div>
    <div class="card">
      <h3>Analyse & gestion</h3>
      ${right.map(([key, label]) => `<label><input type="checkbox" data-skill="${key}" ${store.skills.includes(key) ? 'checked' : ''} /> ${esc(label)}</label>`).join('')}
    </div>
  `;

  box.querySelectorAll('[data-skill]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const newStore = getStore();
      const key = checkbox.dataset.skill;
      if (checkbox.checked && !newStore.skills.includes(key)) newStore.skills.push(key);
      if (!checkbox.checked) newStore.skills = newStore.skills.filter(item => item !== key);
      saveStore(newStore);
      updateKPIs();
    });
  });
}

function renderProjectChecklist() {
  const box = $('projectChecklist');
  if (!box) return;
  const store = getStore();
  box.innerHTML = `<div class="card"><h3>Checklist capstone</h3>${PROJECT_ITEMS.map((item, index) => `
    <label><input type="checkbox" data-project="${index}" ${store.project.includes(index) ? 'checked' : ''} /> ${esc(item)}</label>
  `).join('')}</div>`;
  box.querySelectorAll('[data-project]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const newStore = getStore();
      const idx = Number(checkbox.dataset.project);
      if (checkbox.checked && !newStore.project.includes(idx)) newStore.project.push(idx);
      if (!checkbox.checked) newStore.project = newStore.project.filter(item => item !== idx);
      saveStore(newStore);
      updateKPIs();
    });
  });
}

function renderProjectCards() {
  const box = $('projectCards');
  if (!box) return;
  const cards = [
    { title: 'Livrable A', description: 'Données, dictionnaire, modèle relationnel, rapport qualité.' },
    { title: 'Livrable B', description: 'Analyse, indicateurs, comparaisons, hypothèses, faux positifs.' },
    { title: 'Livrable C', description: 'Décision, matrice de risque, dashboard et recommandations.' }
  ];
  box.innerHTML = cards.map(item => `
    <div class="card">
      <div class="cat">${esc(item.title)}</div>
      <h3>${esc(item.title)}</h3>
      <p class="desc">${esc(item.description)}</p>
    </div>
  `).join('');
}

function renderNotesOverview() {
  const box = $('notesOverview');
  if (!box) return;
  const notes = safeGet(NOTES_KEY, {});
  const ids = Object.keys(notes).filter(key => notes[key] && notes[key].trim());
  if (!ids.length) {
    box.innerHTML = '<div class="card"><p class="desc">Aucune note pour l’instant. Ouvrez un module pour écrire.</p></div>';
    return;
  }
  box.innerHTML = ids.map(id => `
    <div class="card">
      <div class="cat">Module ${id}</div>
      <h3>${esc(state.modules.find(m => m.id === Number(id))?.title || 'Note')}</h3>
      <p class="desc">${esc(notes[id])}</p>
    </div>
  `).join('');
}

function updateKPIs() {
  const store = getStore();
  $('kpiModules').textContent = store.modules.length;
  $('kpiConcepts').textContent = store.concepts.length;
  $('kpiExercises').textContent = store.exercises.length;
  $('kpiProject').textContent = store.project.length;

  $('kpiModulesBar').style.width = `${Math.round((store.modules.length / 21) * 100)}%`;
  $('kpiConceptsBar').style.width = `${Math.round((store.concepts.length / 70) * 100)}%`;
  $('kpiExercisesBar').style.width = `${Math.round((store.exercises.length / 35) * 100)}%`;
  $('kpiProjectBar').style.width = `${Math.round((store.project.length / 12) * 100)}%`;
}

function loadDataFromApi() {
  return fetch('/api/knowledge-pack').then(r => r.json()).then(data => {
    state.modules = data.modules || [];
    state.concepts = data.concepts || [];
    state.lexicon = data.lexicon || [];
    state.faq = data.faq || [];
    state.updates = data.updates || {};
  });
}

function loadGuides() {
  return fetch('/api/reference-sources').then(r => r.json()).then(data => {
    state.guides = data.guides || [];
  });
}

function renderUpdateStatus() {
  const status = $('updateStatus');
  if (!status) return;
  status.innerHTML = `
    <div class="card">
      <div class="cat">Mise à jour</div>
      <h3>Sources de référence</h3>
      <p class="desc">Dernière synchronisation : ${esc(state.updates.lastSync || 'n/a')}</p>
      <ul>${(state.guides || []).slice(0, 4).map(g => `<li>${esc(g.name)} · ${esc(g.type)}</li>`).join('')}</ul>
    </div>
  `;
}

function exportProgress() {
  const payload = {
    version: '5.0',
    exportedAt: new Date().toISOString(),
    progress: getStore(),
    favorites: safeGet(FAV_KEY, {}),
    notes: safeGet(NOTES_KEY, {})
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'datalab_progression.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Progression exportée');
}

function importProgress() {
  $('importFile').click();
}

$('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const store = getStore();
      if (data.progress) {
        if (Array.isArray(data.progress.modules)) store.modules = data.progress.modules;
        if (Array.isArray(data.progress.skills)) store.skills = data.progress.skills;
        if (Array.isArray(data.progress.exercises)) store.exercises = data.progress.exercises;
        if (Array.isArray(data.progress.project)) store.project = data.progress.project;
        saveStore(store);
      }
      if (data.favorites) safeSet(FAV_KEY, data.favorites);
      if (data.notes) safeSet(NOTES_KEY, data.notes);
      renderSkillChecklist();
      renderProjectChecklist();
      renderNotesOverview();
      updateKPIs();
      showToast('Progression importée');
    } catch (err) {
      showToast('Import invalide', 'error');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
});

function resetAllProgress() {
  if (!window.confirm('Réinitialiser toute la progression ?')) return;
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(FAV_KEY);
  localStorage.removeItem(NOTES_KEY);
  state.favorites = {};
  renderSkillChecklist();
  renderProjectChecklist();
  renderNotesOverview();
  updateKPIs();
  showToast('Progression réinitialisée');
}

function exportChecklist() {
  const store = getStore();
  const lines = ['Élément;Terminé'];
  PROJECT_ITEMS.forEach((label, index) => {
    lines.push(`"${label}";${store.project.includes(index) ? 'Oui' : 'Non'}`);
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'checklist_projet.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function renderGlobalUpdateCard() {
  const guideBox = document.createElement('div');
  guideBox.className = 'card';
  guideBox.innerHTML = `
    <div class="cat">Moteur de mise à jour</div>
    <h3>Sources reconnues</h3>
    <p class="desc">Le système intègre des sources de référence connues et s'appuie sur des règles de vérification.</p>
    <ul>${SOURCE_GUIDES.protectedSources.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <div class="warn">${SOURCE_GUIDES.rules.map(r => `<div>${esc(r)}</div>`).join('')}</div>
  `;
  const existing = $('updateStatus');
  if (existing) existing.appendChild(guideBox);
}

function init() {
  const savedTheme = safeGet(THEME_KEY, 'auto');
  applyTheme(['auto', 'light', 'dark'].includes(savedTheme) ? savedTheme : 'auto');

  Promise.all([loadDataFromApi(), loadGuides()]).then(() => {
    renderModules();
    renderConcepts();
    renderLexique();
    renderParcours();
    renderFiches();
    renderExercises();
    renderCases();
    renderInterview();
    renderQuiz();
    renderFlashcards();
    renderSkillChecklist();
    renderProjectChecklist();
    renderProjectCards();
    renderNotesOverview();
    renderGlobalUpdateCard();
    renderUpdateStatus();
    updateKPIs();
  });

  document.querySelectorAll('.navitem').forEach(button => {
    button.addEventListener('click', () => goTo(button.dataset.nav));
  });

  document.querySelectorAll('[data-nav]').forEach(button => {
    button.addEventListener('click', () => goTo(button.dataset.nav));
  });

  $('themeBtn').addEventListener('click', cycleTheme);
  $('mobileMenuBtn').addEventListener('click', () => $('sidebar').classList.toggle('show'));
  $('pdfBtn').addEventListener('click', () => window.print());
  $('helpBtn').addEventListener('click', () => $('helpModal').classList.add('on'));
  $('closeHelpBtn').addEventListener('click', () => $('helpModal').classList.remove('on'));
  $('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.addEventListener('keydown', (event) => {
    const target = event.target.tagName;
    if (target === 'INPUT' || target === 'TEXTAREA' || target === 'SELECT') return;
    if (event.key === '/' && $('globalSearch')) $('globalSearch').focus();
    if (event.key === '?') $('helpModal').classList.add('on');
    if (event.key === 'Escape') $('helpModal').classList.remove('on');
    if (event.key === 'g') goTo('accueil');
    if (event.key === 'c') goTo('curriculum');
    if (event.key === 'b') goTo('concepts');
    if (event.key === 'l') goTo('lexique');
    if (event.key === 'f') goTo('fiches');
    if (event.key === 'e') goTo('exercices');
    if (event.key === 'a') goTo('atelier');
    if (event.key === 'p') goTo('progression');
  });

  $('globalSearch').addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    if (state.query) goTo('fiches');
    renderFiches();
  });

  document.querySelectorAll('#ficheTabs .tab').forEach(button => {
    button.addEventListener('click', () => {
      state.ficheTab = button.dataset.tab;
      state.cat = '';
      state.fav = false;
      renderFiches();
    });
  });

  window.addEventListener('scroll', () => {
    $('backToTop').classList.toggle('show', window.scrollY > 400);
  });

  const store = getStore();
  const savedNav = store.lastNav || 'accueil';
  goTo(savedNav);
}

window.addEventListener('DOMContentLoaded', init);
window.goTo = goTo;
window.cycleTheme = cycleTheme;
window.loadCsv = function () {
  const fileInput = $('csvFile');
  if (!fileInput.files.length) { showToast('Choisissez un CSV', 'error'); return; }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    const rows = text.split(/\r?\n/).filter(r => r.trim());
    const headers = rows[0].split(',');
    const data = rows.slice(1).map(row => row.split(','));
    const table = $('previewTable');
    table.innerHTML = `<thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${data.slice(0, 10).map(row => `<tr>${row.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    showToast('CSV analysé');
  };
  reader.readAsText(file);
};
window.loadSample = function () {
  const sample = [
    ['transaction_id', 'client_id', 'date', 'ville', 'montant', 'statut'],
    ['T001', '101', '2026-01-03', 'Abidjan', '25000', 'Payée'],
    ['T002', '102', '2026-01-04', 'Bouaké', '12000', 'En attente'],
    ['T003', '101', '2026-01-15', 'Abidjan', '18000', 'Payée']
  ];
  const table = $('previewTable');
  table.innerHTML = `<thead><tr>${sample[0].map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${sample.slice(1).map(row => `<tr>${row.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  showToast('Exemple chargé');
};
window.clearData = function () {
  $('previewTable').innerHTML = '';
  showToast('Données vidées');
};
window.exportCsv = function () {
  const table = $('previewTable');
  if (!table) return;
  const rows = [...table.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('th,td')].map(td => td.textContent.trim()).join(';'));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'export.csv'; a.click();
  URL.revokeObjectURL(url);
};
window.exportJson = function () {
  const table = $('previewTable');
  if (!table) return;
  const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim());
  const rows = [...table.querySelectorAll('tbody tr')].map(tr => Object.fromEntries(headers.map((h, i) => [h, tr.children[i]?.textContent.trim() || ''])));
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'export.json'; a.click();
  URL.revokeObjectURL(url);
};
window.exportSql = function () {
  const table = $('previewTable');
  if (!table) return;
  const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim());
  const rows = [...table.querySelectorAll('tbody tr')].map(tr => [...tr.children].map(td => td.textContent.trim()));
  const sql = ['CREATE TABLE sample (', headers.map(h => `  ${h} TEXT`).join(',\n'), ');', ...rows.map(r => `INSERT INTO sample (${headers.join(', ')}) VALUES ('${r.join("', '") }');`)].join('\n');
  const blob = new Blob([sql], { type: 'text/sql;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'export.sql'; a.click();
  URL.revokeObjectURL(url);
};
window.calcRisk = function () {
  const prob = Number($('riskProb').value);
  const impact = Number($('riskImpact').value);
  const control = Number($('riskControl').value);
  const result = $('riskResult');
  const value = (prob / 100) * impact * (1 - control / 100);
  result.textContent = `Exposition : ${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} FCFA`;
  result.classList.remove('hidden');
};
window.calcFinance = function () {
  const init = Number($('finInit').value);
  const final = Number($('finFinal').value);
  const inflation = Number($('finInflation').value) / 100;
  const cf = Number($('finCF').value);
  const inv = Number($('finInvest').value);
  const rate = Number($('finDiscount').value) / 100;
  const nominal = ((final - init) / init) * 100;
  const real = ((1 + ((final - init) / init)) / (1 + inflation) - 1) * 100;
  let npv = -inv;
  for (let t = 1; t <= 3; t++) npv += cf / Math.pow(1 + rate, t);
  const result = $('finResult');
  result.textContent = `Nominal : ${nominal.toFixed(2)}% | Réel : ${real.toFixed(2)}% | VAN 3 ans : ${npv.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`;
  result.classList.remove('hidden');
};
window.gradeQuiz = gradeQuiz;
window.resetQuiz = resetQuiz;
window.renderRandomQuiz = renderRandomQuiz;
window.exportProgress = exportProgress;
window.importProgress = importProgress;
window.exportChecklist = exportChecklist;
window.resetAllProgress = resetAllProgress;
window.loadSample = window.loadSample;
window.loadCsv = window.loadCsv;
window.clearData = window.clearData;
window.exportCsv = window.exportCsv;
window.exportJson = window.exportJson;
window.exportSql = window.exportSql;
window.calcRisk = window.calcRisk;
window.calcFinance = window.calcFinance;
