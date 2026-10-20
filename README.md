const knowledgeSources = [
  {
    id: 'excel',
    label: 'Excel',
    kind: 'Official Learn',
    title: 'Microsoft Excel — Fonctions de base & avancées',
    description: 'Tableaux croisés dynamiques, INDEX-MATCH, SUMIFS, validation, modèles de calcul, reporting automatisé.',
    url: 'https://support.microsoft.com/fr-fr/excel'
  },
  {
    id: 'powerbi',
    label: 'Power BI',
    kind: 'Business intelligence',
    title: 'Power BI — Dashboards & modélisation',
    description: 'DAX, visualisations, tableaux de bord, calibrage de KPI, storytelling data.',
    url: 'https://learn.microsoft.com/fr-fr/power-bi/'
  },
  {
    id: 'sql',
    label: 'SQL',
    kind: 'Database',
    title: 'SQL Server & analytics',
    description: 'Jointures, agrégations, filtres temporels, KPI business, requêtes d’exploration.',
    url: 'https://learn.microsoft.com/fr-fr/sql/'
  },
  {
    id: 'python',
    label: 'Python',
    kind: 'Data science',
    title: 'Python / pandas — transformation & qualité',
    description: 'Nettoyage des données, calculs, segmentation, anomalies et automatisation analytique.',
    url: 'https://pandas.pydata.org/'
  },
  {
    id: 'google',
    label: 'Google',
    kind: 'Data analytics',
    title: 'Google Data Analytics — méthodes de référence',
    description: 'Analyse exploratoire, apprentissage des data lifecycle, storytelling, structures de données.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics'
  },
  {
    id: 'ai',
    label: 'IA',
    kind: 'Native intelligence',
    title: 'IA native — synthèse de contexte & recommandations',
    description: 'Analyse contextuelle, recommandations actionnables, génération de brief analytique et priorisation.',
    url: '#'
  }
];

const dashboardMetrics = [
  { label: 'Ventes', value: '€ 1.24M', progress: 82 },
  { label: 'Conversion', value: '+18.7%', progress: 74 },
  { label: 'Délai moyen', value: '4.3j', progress: 64 },
  { label: 'Qualité data', value: '94%', progress: 94 }
];

const updateFeed = [
  {
    source: 'Microsoft Learn',
    type: 'Excel',
    title: 'Nouveaux modèles pour les tableaux de bord dynamiques',
    impact: 'Moyen',
    summary: 'Mise en avant des formules avancées pour un reporting plus rapide et plus robuste.'
  },
  {
    source: 'Power BI',
    type: 'BI',
    title: 'DAX : recommandations sur cohérence des KPI',
    impact: 'Élevé',
    summary: 'Correction des agrégations sur les périodes et amélioration des alertes métier.'
  },
  {
    source: 'SQL Server',
    type: 'Database',
    title: 'Bonnes pratiques de jointures et filtres temporels',
    impact: 'Élevé',
    summary: 'Optimisation des requêtes analytiques pour les tables volumineuses.'
  },
  {
    source: 'Google Data Analytics',
    type: 'Méthode',
    title: 'Cadre de décision centrée sur la qualité des données',
    impact: 'Moyen',
    summary: 'Approche de vérification des biais, validations et storytelling analytique.'
  },
  {
    source: 'Python / pandas',
    type: 'Data',
    title: 'Automatisation des contrôles de nettoyage',
    impact: 'Élevé',
    summary: 'Mise en place d’un pipeline de validation de données pour prévenir les écarts.'
  },
  {
    source: 'IA native',
    type: 'Synthèse',
    title: 'Priorisation des recommandations métier',
    impact: 'Très élevé',
    summary: 'Synthèse de la veille de sources pour orienter les priorités de la prochaine semaine.'
  }
];

const excelTabs = {
  formules: [
    {
      title: 'SUMIFS multi-critères',
      formula: '=SUMIFS(Sales[Montant], Sales[Zone], "EU", Sales[Segment], "Enterprise", Sales[Date], ">="&DATE(2025,1,1))',
      description: 'Calcule précisément le chiffre d’affaires sur des conditions cumulées et chronologiques.'
    },
    {
      title: 'INDEX + MATCH hybride',
      formula: '=INDEX(Tableau[Montant], MATCH(1, (Tableau[Client]=A2)*(Tableau[Zone]=B2), 0))',
      description: 'Récupère la valeur la plus fiable lorsque la correspondance multi-critères dépasse les capacités de VLOOKUP.'
    },
    {
      title: 'UNIQUE + FILTER',
      formula: '=UNIQUE(FILTER(Sales[Client], Sales[Zone]="APAC"))',
      description: 'Extrait les clients distincts d’une zone et prépare les listes de segmentation.'
    }
  ],
  exercices: [
    {
      title: 'Exercice 1 — Nettoyage de base',
      formula: 'Supprimer doublons, reformater les dates, normaliser les zones marketing.',
      description: 'Objectif : obtenir une base de 99,5% de complétude et calculer le KPI de validité du fichier.'
    },
    {
      title: 'Exercice 2 — Analyse de marge',
      formula: 'Calculer marge = (Prix de vente - Coût) / Prix de vente ; comparer par segment et canal.',
      description: 'Objectif : identifier le canal le plus rentable et les anomalies à corriger.'
    },
    {
      title: 'Exercice 3 — Dashboard de performance',
      formula: 'Créer 3 KPI : CA, taux de transformation, délai moyen de livraison par équipe.',
      description: 'Objectif : mettre en place une vue lisible et actionnable pour le comité de direction.'
    }
  ],
  'cas-pratiques': [
    {
      title: 'Cas — Gestion de portefeuilles B2B',
      formula: 'Modeliser un reporting par client, par produit, par segment et par zone géographique.',
      description: 'Utilisation de filtres, tables dynamiques, ratio de rétention et score de satisfaction.'
    },
    {
      title: 'Cas — Pilotage de stock',
      formula: 'Suivre les niveaux de stock, rotations, seuils d’alerte et stock mort.',
      description: 'Mise en place d’un plan d’optimisation et de comparaison sur les centres logistiques.'
    },
    {
      title: 'Cas — Analyse de campagnes',
      formula: 'Associer les leads, les conversions et les performances par canal d’acquisition.',
      description: 'Mesure du ROAS, efficacité des segments et recommandations décisionnelles.'
    }
  ]
};

const playbooks = [
  {
    tag: 'Déploiement',
    title: 'Architecture analytique pour PME & ETI',
    description: 'Conception d’un système de reporting réparti entre sources de capture, validation et tableaux de bord d’exécution.',
    badges: ['Excel', 'Power BI', 'SQL']
  },
  {
    tag: 'Qualité',
    title: 'Contrôle de qualité des données',
    description: 'Cadre d’audit sur complétude, cohérence, doublons et variance des segments.',
    badges: ['Validation', 'Audit', 'KPI']
  },
  {
    tag: 'Décision',
    title: 'Synthèse décisionnelle hebdomadaire',
    description: 'Rituel de reporting en 4 étapes : faire émerger les signaux, expliquer les causes, prioriser, déclencher les actions.',
    badges: ['Brief', 'Priorisation', 'Action']
  },
  {
    tag: 'Automatisation',
    title: 'Pipeline d’alertes & maintenance',
    description: 'Mise en œuvre de seuils et d’embeds d’alertes sur les KPI critiques pour prévenir les dérives.',
    badges: ['Workflow', 'Alertes', 'Ops']
  }
];

const state = {
  activeTab: 'formules',
  filter: 'all',
  theme: localStorage.getItem('datalab-theme') || 'light'
};

const kpiGrid = document.getElementById('kpi-grid');
const sourceFilters = document.getElementById('source-filters');
const sourceCards = document.getElementById('source-cards');
const playbookGrid = document.getElementById('playbook-grid');
const excelPanels = document.getElementById('excel-panels');
const chartBars = document.getElementById('chart-bars');
const briefOutput = document.getElementById('brief-output');

function renderKpis() {
  kpiGrid.innerHTML = dashboardMetrics
    .map(
      (item) => `
        <article class="kpi-card">
          <div class="label">${item.label}</div>
          <div class="value">${item.value}</div>
          <div class="progress" style="--progress:${item.progress}%"><span></span></div>
        </article>
      `
    )
    .join('');
}

function renderSourceFilters() {
  const filters = ['all', ...new Set(knowledgeSources.map((item) => item.label.toLowerCase()))];
  sourceFilters.innerHTML = filters
    .map(
      (filter) => `
        <button class="chip ${state.filter === filter ? 'active' : ''}" type="button" data-filter="${filter}">
          ${filter === 'all' ? 'Toutes' : filter}
        </button>
      `
    )
    .join('');

  sourceFilters.querySelectorAll('.chip').forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      renderSourceFilters();
      renderSources();
    });
  });
}

function renderSources() {
  const visibleSources = knowledgeSources.filter((source) => {
    if (state.filter === 'all') return true;
    return source.label.toLowerCase() === state.filter;
  });

  sourceCards.innerHTML = visibleSources
    .map(
      (source) => `
        <article class="source-card">
          <div class="source-header">
            <span class="badge">${source.kind}</span>
            <span>${source.label}</span>
          </div>
          <h4>${source.title}</h4>
          <p>${source.description}</p>
          <a href="${source.url}" target="_blank" rel="noreferrer">Consulter la source ↗</a>
        </article>
      `
    )
    .join('');

  document.getElementById('source-count').textContent = String(knowledgeSources.length);
}

function renderPlaybooks() {
  playbookGrid.innerHTML = playbooks
    .map(
      (item) => `
        <article class="module-card">
          <span class="module-tag">${item.tag}</span>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="badge-row">
            ${item.badges.map((badge) => `<span class="scope-badge">${badge}</span>`).join('')}
          </div>
        </article>
      `
    )
    .join('');
}

function renderExcelPanels() {
  const items = excelTabs[state.activeTab];
  excelPanels.innerHTML = `
    <div class="excel-panel">
      ${items
        .map(
          (item) => `
            <article class="excel-item">
              <h4>${item.title}</h4>
              <div class="formula">${item.formula}</div>
              <p>${item.description}</p>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderBars() {
  const months = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin'];
  const values = [48, 65, 72, 59, 81, 92];

  chartBars.innerHTML = months
    .map(
      (_, index) => `
        <div class="chart-bar-group">
          <div class="chart-bar" style="height:${values[index]}%"></div>
          <span class="chart-label">${months[index]}</span>
        </div>
      `
    )
    .join('');
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('datalab-theme', state.theme);
  const themeButton = document.getElementById('theme-toggle');
  themeButton.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeTab = button.dataset.tab;
      document.querySelectorAll('.tab').forEach((tab) => {
        const active = tab.dataset.tab === state.activeTab;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      renderExcelPanels();
    });
  });
}

function bindNav() {
  document.querySelectorAll('.nav-item, .btn[data-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button));
    });
  });
}

function refreshFeed() {
  const freshItem = updateFeed[Math.floor(Math.random() * updateFeed.length)];
  const card = document.createElement('article');
  card.className = 'source-card';
  card.innerHTML = `
    <div class="source-header">
      <span class="badge">${freshItem.type}</span>
      <span>${freshItem.source}</span>
    </div>
    <h4>${freshItem.title}</h4>
    <p>${freshItem.summary}</p>
    <div class="callout good">Impact : ${freshItem.impact}</div>
  `;
  sourceCards.prepend(card);
  document.getElementById('feed-count').textContent = String(Number(document.getElementById('feed-count').textContent) + 1);
}

function generateBrief() {
  const focus = [
    'optimiser le flux de données',
    'prioriser les indicateurs de performance',
    'réduire les pertes de conversion',
    'améliorer la qualité et la fiabilité des données',
    'accelerer le pilotage décisionnel'
  ];

  const sourceSummary = knowledgeSources
    .slice(0, 4)
    .map((source) => source.label)
    .join(', ');

  const brief = `Brief de synthèse IA native\n\nÀ partir des référentiels ${sourceSummary}, les priorités sont :\n1. Renforcer la qualité des données et les contrôles de cohérence avant toute modélisation.\n2. Mettre en place des KPI de performance par canal, par zone et par segment.\n3. Automatiser les alertes sur les écarts de marge ou la baisse de conversion.\n4. Structurer les décisions autour d’un tableau de bord lisible et de recommandations actionnables.\n\nRésultat attendu : un pilotage décisionnel plus rapide, plus fiable et aligné sur la croissance. `;

  briefOutput.textContent = brief;
}

function bindSearch() {
  const searchInput = document.getElementById('global-search');
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    const allCards = document.querySelectorAll('.source-card, .module-card, .excel-item, .kpi-card');

    allCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) || !query ? 'block' : 'none';
    });
  });
}

function init() {
  renderKpis();
  renderSourceFilters();
  renderSources();
  renderPlaybooks();
  renderExcelPanels();
  renderBars();
  bindTabs();
  bindNav();
  applyTheme();
  bindSearch();

  document.getElementById('theme-toggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });

  document.getElementById('refresh-feed').addEventListener('click', refreshFeed);
  document.getElementById('generate-brief').addEventListener('click', generateBrief);
}

init();
