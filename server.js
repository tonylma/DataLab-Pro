const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const knowledgePath = path.join(__dirname, 'data', 'knowledge-base.json');
const guidesPath = path.join(__dirname, 'data', 'reference-guides.json');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return { error: 'Unable to read ' + filePath };
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'DataLab Pro', time: new Date().toISOString() });
});

app.get('/api/knowledge-pack', (req, res) => {
  const data = readJson(knowledgePath);
  res.json(data);
});

app.get('/api/reference-sources', (req, res) => {
  const data = readJson(guidesPath);
  res.json(data);
});

app.get('/api/update-status', (req, res) => {
  const knowledge = readJson(knowledgePath);
  const guides = readJson(guidesPath);
  res.json({
    appVersion: '2.0.0',
    updateWindow: 'manual + scheduled',
    lastSync: knowledge.updates?.lastSync || 'n/a',
    status: knowledge.updates?.status || 'ready',
    sources: knowledge.updates?.sources || [],
    guides: guides.guides || [],
    rules: guides.rail || {}
  });
});

app.get('/api/ai-snapshot', (req, res) => {
  const knowledge = readJson(knowledgePath);
  res.json({
    version: knowledge.ai_engine?.version || 'v2.0.0',
    confidence: knowledge.ai_engine?.confidence || 96,
    goals: knowledge.ai_engine?.goals || [],
    modes: knowledge.ai_engine?.modes || [],
    sources: knowledge.ai_engine?.sources || []
  });
});

app.get('/api/excel-pathway', (req, res) => {
  const knowledge = readJson(knowledgePath);
  res.json({
    modules: knowledge.excel_modules || [],
    roadmap: [
      'Excel de base',
      'Formules et logique',
      'Nettoyage de données',
      'Recherche & jointures',
      'Tableaux dynamiques',
      'Formules avancées',
      'Power Query & modélisation',
      'Dashboard & monitoring'
    ]
  });
});

app.post('/api/sync', (req, res) => {
  const mode = req.body?.mode || 'manual-refresh';
  const knowledge = readJson(knowledgePath);
  const guides = readJson(guidesPath);
  const now = new Date().toISOString();

  knowledge.updates = {
    ...knowledge.updates,
    lastSync: now,
    status: 'updated'
  };

  fs.writeFileSync(knowledgePath, JSON.stringify(knowledge, null, 2));

  res.json({
    mode,
    syncedAt: now,
    status: 'updated',
    sourceCount: (knowledge.updates?.sources || []).length,
    guideCount: (guides.guides || []).length,
    rules: guides.rail?.refreshPolicy || []
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DataLab Pro is running on http://localhost:${PORT}`);
});
