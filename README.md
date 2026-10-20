# DataLab Pro

DataLab Pro est une application Web orientée apprentissage analytique, SQL, Excel, statistiques, finance, gouvernance, fraude, visualisation et storytelling.

## Ce qui a été transformé

- conversion d'un document HTML unique en application web structurée ;
- séparation du contenu, des styles et du code applicatif ;
- ajout d'un serveur Express pour servir l'application ;
- ajout d'un système de données internes, de références et de mises à jour ;
- ajout d'une couche d'actualisation alimentée par plusieurs sources reconnues ;
- stockage local par navigateur pour la progression et les favoris ;
- export/import de progression et de checklist.

## Stack

- Node.js / Express
- HTML5 / CSS3 / JavaScript vanilla
- localStorage pour l'état utilisateur
- JSON pour la base de connaissance et les sources de référence

## Lancer le projet

```bash
npm install
npm start
```

Puis ouvrir : http://localhost:3000

## Organisation

```text
/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/
│   ├── knowledge-base.json
│   └── reference-guides.json
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Fonctionnalités clés

- navigation multi-sections
- modules pédagogiques
- concepts et lexique
- fiches de référence
- exercices et corrigés
- cas de synthèse
- dashboard de progression locale
- moteur d'actualisation avec sources de référence intégrées
- export/import de progression
- thèmes clair/sombre

## Sources de référence intégrées

Le système tient explicitement compte des sources suivantes :

- MDN Web Docs
- PostgreSQL Documentation
- Microsoft Excel Support
- NIST AI Risk Management Framework
- OWASP
- CNIL / RGPD
- HBR / McKinsey analytical playbooks

Cela permet au programme d'évoluer comme une base de connaissance structurée, et non comme un simple fichier HTML figé.
