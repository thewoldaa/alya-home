/**
 * Alya Chatbot - Web Server v2.0
 * 
 * Features:
 * - Chat UI with Alya image avatars
 * - Settings page for custom rules (manual, JSON, MD import)
 * - Static image serving
 * - Chat history persistence (server-side)
 * - Custom rules CRUD API
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { AlyaBrain } from './engine/AlyaBrain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const brain = new AlyaBrain({ thinkMode: 'disabled' });

const PAGES_DIR = join(__dirname, 'pages');
const IMAGES_DIR = join(__dirname, 'data', 'images');
const CUSTOM_RULES_FILE = join(__dirname, 'data', 'custom-rules.json');

// ═══ Helper: Read page files ═══
function readPage(name) {
  return readFileSync(join(PAGES_DIR, name), 'utf-8');
}

// ═══ Helper: Custom Rules CRUD ═══
function loadCustomRules() {
  try {
    if (existsSync(CUSTOM_RULES_FILE)) {
      return JSON.parse(readFileSync(CUSTOM_RULES_FILE, 'utf-8'));
    }
  } catch (e) { /* */ }
  return { rules: [], lastUpdated: null };
}

function saveCustomRules(data) {
  data.lastUpdated = new Date().toISOString();
  writeFileSync(CUSTOM_RULES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  // Reload rules in intent engine
  brain.intentEngine.reloadCustomRules();
}

function generateId() {
  return 'rule-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

// ═══ Helper: Parse Markdown rules ═══
function parseMdRules(mdText) {
  const rules = [];
  const sections = mdText.split(/^## /gm).filter(Boolean);
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const name = lines[0].trim();
    let keywords = [], patterns = [], responses = [], priority = 5;
    let inResponses = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- **keywords**:')) {
        keywords = line.replace('- **keywords**:', '').split(',').map(s => s.trim()).filter(Boolean);
        inResponses = false;
      } else if (line.startsWith('- **patterns**:')) {
        patterns = line.replace('- **patterns**:', '').split(',').map(s => s.trim()).filter(Boolean);
        inResponses = false;
      } else if (line.startsWith('- **responses**:')) {
        inResponses = true;
      } else if (line.startsWith('- **priority**:')) {
        priority = parseInt(line.replace('- **priority**:', '').trim()) || 5;
        inResponses = false;
      } else if (inResponses && line.startsWith('- ')) {
        responses.push(line.replace(/^- /, '').trim());
      }
    }
    if (name && keywords.length > 0 && responses.length > 0) {
      rules.push({ id: generateId(), name, keywords, patterns, responses, priority, createdAt: new Date().toISOString() });
    }
  }
  return rules;
}

// ═══ Helper: Read request body ═══
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// ═══ MIME types ═══
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml'
};

// ═══ HTTP Server ═══
const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    // ═══ PAGES ═══
    if (req.method === 'GET' && (path === '/' || path === '/index.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(readPage('chat.html'));
      return;
    }

    if (req.method === 'GET' && path === '/settings') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(readPage('settings.html'));
      return;
    }

    if (req.method === 'GET' && path === '/admin-push') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(readPage('admin-push.html'));
      return;
    }

    // ═══ GENERIC STATIC FILES (src & root fallback) ═══
    if (req.method === 'GET' && path.includes('.')) {
      const relPath = path.startsWith('/') ? path.slice(1) : path;
      const filePathSrc = join(__dirname, relPath);
      const filePathRoot = join(__dirname, '..', relPath);
      const filePath = existsSync(filePathSrc) ? filePathSrc : (existsSync(filePathRoot) ? filePathRoot : null);

      if (filePath) {
        const ext = extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' });
        res.end(readFileSync(filePath));
        return;
      }
    }

    // ═══ CHAT API ═══
    if (req.method === 'POST' && path === '/api/chat') {
      const body = JSON.parse(await readBody(req));
      brain.setThinkMode(body.thinkMode || 'disabled');
      const result = brain.processMessage(body.message || '');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
      return;
    }

    if (req.method === 'POST' && path === '/api/chat/clear') {
      brain.memoryEngine.clearHistory();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    if (req.method === 'GET' && path === '/api/chat/history') {
      const history = brain.memoryEngine.getFullHistory();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ history }));
      return;
    }

    // ═══ RULES API ═══
    if (req.method === 'GET' && path === '/api/rules') {
      const data = loadCustomRules();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
      return;
    }

    if (req.method === 'POST' && path === '/api/rules') {
      const body = JSON.parse(await readBody(req));
      const data = loadCustomRules();
      const rule = {
        id: generateId(),
        name: body.name || 'unnamed',
        keywords: body.keywords || [],
        patterns: body.patterns || [],
        responses: body.responses || [],
        priority: body.priority || 5,
        createdAt: new Date().toISOString()
      };
      data.rules.push(rule);
      saveCustomRules(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, rule }));
      return;
    }

    if (req.method === 'DELETE' && path.startsWith('/api/rules/')) {
      const id = path.replace('/api/rules/', '');
      const data = loadCustomRules();
      const before = data.rules.length;
      data.rules = data.rules.filter(r => r.id !== id);
      if (data.rules.length < before) {
        saveCustomRules(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rule not found' }));
      }
      return;
    }

    if (req.method === 'POST' && path === '/api/rules/import/json') {
      const body = JSON.parse(await readBody(req));
      try {
        const imported = JSON.parse(body.data);
        const newRules = (imported.rules || []).map(r => ({
          id: generateId(), name: r.name || 'imported',
          keywords: r.keywords || [], patterns: r.patterns || [],
          responses: r.responses || [], priority: r.priority || 5,
          createdAt: new Date().toISOString()
        }));
        const data = loadCustomRules();
        data.rules.push(...newRules);
        saveCustomRules(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: newRules.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON: ' + e.message }));
      }
      return;
    }

    if (req.method === 'POST' && path === '/api/rules/import/md') {
      const body = JSON.parse(await readBody(req));
      try {
        const newRules = parseMdRules(body.data);
        if (newRules.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Tidak ada rule valid ditemukan. Cek format MD.' }));
          return;
        }
        const data = loadCustomRules();
        data.rules.push(...newRules);
        saveCustomRules(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: newRules.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Parse error: ' + e.message }));
      }
      return;
    }

    if (req.method === 'GET' && path === '/api/status') {
      const result = brain.processMessage('/status');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
      return;
    }

    // 404 handled above if file exists, otherwise:
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ✨ Alya Chatbot v2.0 ✨');
  console.log('  ────────────────────────');
  console.log('  🌐 Chat:     http://localhost:' + PORT);
  console.log('  ⚙️  Settings: http://localhost:' + PORT + '/settings');
  console.log('  📡 API:      POST http://localhost:' + PORT + '/api/chat');
  console.log('');
  console.log('  Ayo ngobrol sama Alya! 😆');
  console.log('');
});
