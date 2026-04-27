// Mock localStorage for Node.js environments
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
}

import { IntentEngine } from './IntentEngine.js';
import { MoodEngine } from './MoodEngine.js';
import { ResponseEngine } from './ResponseEngine.js';
import { ThinkEngine } from './ThinkEngine.js';
import { SessionManager } from './SessionManager.js';

// Load data from local directory
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const intentsData = JSON.parse(readFileSync(join(__dirname, '../data/intents.json'), 'utf8'));
const responsesData = JSON.parse(readFileSync(join(__dirname, '../data/responses.json'), 'utf8'));
const personalityData = JSON.parse(readFileSync(join(__dirname, '../data/personality.json'), 'utf8'));

/**
 * AlyaBrain - Orchestrator utama untuk chatbot Alya
 * Menghubungkan semua engine (Intent, Mood, Memory, Response, Think)
 */
export class AlyaBrain {
  constructor(options = {}) {
    this.thinkEngine = new ThinkEngine();
    if (options.thinkMode) {
      this.thinkEngine.setMode(options.thinkMode);
    }

    this.intentEngine = new IntentEngine(intentsData);
    this.moodEngine = new MoodEngine(personalityData);
    this.responseEngine = new ResponseEngine(responsesData, personalityData);
    
    // In node environment, SessionManager might need mock or different storage
    // but for consistency with existing imports, we keep it.
    this.sessionManager = new SessionManager();
  }

  /**
   * Proses pesan dari user dan kembalikan respons lengkap
   * @param {string} input 
   * @returns {object}
   */
  processMessage(input) {
    this.thinkEngine.startSession();
    
    // 1. Detect Intent
    const analysis = this.intentEngine.analyze(input, this.thinkEngine);
    
    // 2. Update Mood based on intent
    const moodInfo = this.moodEngine.updateFromIntent(analysis.intent, this.thinkEngine);
    
    // 3. Generate Response
    const response = this.responseEngine.generate(analysis, moodInfo, this.thinkEngine);
    
    // 4. Save to history
    this.sessionManager.addMessage('user', input);
    this.sessionManager.addMessage('alya', response);
    
    const thinkResult = this.thinkEngine.finalize();
    
    return {
      response,
      think: thinkResult,
      mood: moodInfo,
      intent: analysis.intent,
      confidence: analysis.confidence,
      entities: analysis.entities
    };
  }

  /**
   * Get current status Alya
   */
  getStatus() {
    return {
      mood: this.moodEngine.getMoodInfo(),
      thinkMode: this.thinkEngine.mode
    };
  }
}
