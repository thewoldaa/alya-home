/**
 * AlyaBrain - Otak utama Alya
 * 
 * Terinspirasi dari arsitektur QueryEngine.ts:
 * - Pipeline: Input → Intent → Entity → Memory → Mood → Response
 * - Think mode terintegrasi di setiap tahap
 * - Session management dengan memori persistent
 * 
 * Ini adalah orchestrator utama yang menghubungkan semua engine.
 */

import { ThinkEngine } from './ThinkEngine.js';
import { IntentEngine } from './IntentEngine.js';
import { MemoryEngine } from './MemoryEngine.js';
import { MoodEngine } from './MoodEngine.js';
import { ResponseEngine } from './ResponseEngine.js';

export class AlyaBrain {
  constructor(options = {}, dataSets = {}) {
    // Initialize engines (public for server access)
    this.thinkEngine = new ThinkEngine();
    this.intentEngine = new IntentEngine(dataSets.intents);
    this.memoryEngine = new MemoryEngine();
    this.moodEngine = new MoodEngine(dataSets.personality);
    this.responseEngine = new ResponseEngine(dataSets.responses, dataSets.personality);

    // Think mode setting
    if (options.thinkMode) {
      this.thinkEngine.setMode(options.thinkMode);
    }

    // Session info
    this.sessionId = this._generateSessionId();
    this.startTime = Date.now();
    this.messageCount = 0;
  }

  /**
   * Proses pesan dari user dan generate respons Alya
   * 
   * Pipeline:
   * 1. Think engine start
   * 2. Intent recognition (keyword + pattern)
   * 3. Entity extraction
   * 4. Memory context retrieval
   * 5. Mood update
   * 6. Response generation
   * 7. Memory save
   * 8. Think engine finalize
   * 
   * @param {string} input - Pesan dari user
   * @returns {object} { response, think, mood, intent, entities }
   */
  processMessage(input) {
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return {
        response: 'hmm... kamu ngomong apa? aku ga denger 🤭',
        think: null,
        mood: this.moodEngine.getMoodInfo(),
        intent: 'fallback',
        entities: {}
      };
    }

    this.messageCount++;
    const trimmedInput = input.trim();

    // Check for special commands
    const commandResult = this._handleCommand(trimmedInput);
    if (commandResult) return commandResult;

    // ═══ PIPELINE START ═══

    // 1. Start thinking session
    const think = this.thinkEngine;
    think.startSession();
    think.addStep('input', `Received: "${trimmedInput}" (msg #${this.messageCount})`);

    // 2. Intent recognition
    const analysis = this.intentEngine.analyze(trimmedInput, think);

    // 3. Memory context
    const context = this.memoryEngine.getContext(think);

    // 4. Mood update
    const mood = this.moodEngine.update(analysis.intent, context, think);
    think.addStep('mood', `Current mood: ${mood} ${this.moodEngine.getMoodEmoji()}`);

    // 5. Response generation
    const response = this.responseEngine.generate(
      analysis.intent,
      { ...context, mood },
      analysis,
      this.memoryEngine,
      think
    );

    // 6. Save to memory
    this.memoryEngine.addMessage('user', trimmedInput, {
      intent: analysis.intent,
      entities: analysis.entities,
      confidence: analysis.confidence
    });
    this.memoryEngine.addMessage('alya', response, {
      mood,
      intent: analysis.intent
    });

    // 7. Finalize thinking
    const thinkResult = think.finalize();

    // ═══ PIPELINE END ═══

    return {
      response,
      think: thinkResult,
      mood: this.moodEngine.getMoodInfo(),
      intent: analysis.intent,
      confidence: analysis.confidence,
      entities: analysis.entities
    };
  }

  /**
   * Handle special commands
   * @param {string} input 
   * @returns {object|null}
   */
  _handleCommand(input) {
    const lower = input.toLowerCase().trim();

    // Think mode toggle
    if (lower === '/think on' || lower === '/think enable') {
      this.thinkEngine.setMode('enabled');
      return {
        response: '🧠 Think mode: ON! Sekarang kamu bisa lihat proses berpikirku~',
        think: null,
        mood: this.moodEngine.getMoodInfo(),
        intent: 'command',
        entities: {}
      };
    }

    if (lower === '/think off' || lower === '/think disable') {
      this.thinkEngine.setMode('disabled');
      return {
        response: '🧠 Think mode: OFF! Aku mikir diam-diam aja ya~',
        think: null,
        mood: this.moodEngine.getMoodInfo(),
        intent: 'command',
        entities: {}
      };
    }

    if (lower === '/think adaptive') {
      this.thinkEngine.setMode('adaptive');
      return {
        response: '🧠 Think mode: ADAPTIVE! Aku tunjukin pikiran aku kalau diperlukan~',
        think: null,
        mood: this.moodEngine.getMoodInfo(),
        intent: 'command',
        entities: {}
      };
    }

    if (lower === '/status') {
      const moodInfo = this.moodEngine.getMoodInfo();
      const prefs = this.memoryEngine.getAllPreferences();
      const uptime = Math.floor((Date.now() - this.startTime) / 1000);
      
      let status = `📊 Status Alya:\n`;
      status += `  Session: ${this.sessionId}\n`;
      status += `  Uptime: ${uptime}s\n`;
      status += `  Messages: ${this.messageCount}\n`;
      status += `  Mood: ${moodInfo.mood} ${this.moodEngine.getMoodEmoji()} (${moodInfo.deskripsi})\n`;
      status += `  Think mode: ${this.thinkEngine.mode}\n`;
      status += `  Memory: ${this.memoryEngine.getHistory().length} recent messages\n`;
      
      if (Object.keys(prefs).length > 0) {
        status += `  User preferences: ${JSON.stringify(prefs)}\n`;
      }

      return {
        response: status,
        think: null,
        mood: moodInfo,
        intent: 'command',
        entities: {}
      };
    }

    if (lower === '/reset') {
      this.memoryEngine.reset();
      this.messageCount = 0;
      return {
        response: '🔄 Memory direset! Aku lupa semuanya~ mulai dari awal ya! 😆',
        think: null,
        mood: this.moodEngine.getMoodInfo(),
        intent: 'command',
        entities: {}
      };
    }

    if (lower === '/help') {
      let help = `📖 Perintah yang tersedia:\n`;
      help += `  /think on     - Aktifkan think mode\n`;
      help += `  /think off    - Matikan think mode\n`;
      help += `  /think adaptive - Think mode otomatis\n`;
      help += `  /status       - Lihat status Alya\n`;
      help += `  /reset        - Reset memori\n`;
      help += `  /help         - Tampilkan bantuan ini\n`;
      help += `  /quit         - Keluar\n`;
      help += `\n💡 Coba ngobrol santai sama Alya!`;

      return {
        response: help,
        think: null,
        mood: this.moodEngine.getMoodInfo(),
        intent: 'command',
        entities: {}
      };
    }

    return null;
  }

  /**
   * Set think mode
   * @param {'adaptive'|'enabled'|'disabled'} mode 
   */
  setThinkMode(mode) {
    this.thinkEngine.setMode(mode);
  }

  /**
   * Get current think mode
   * @returns {string}
   */
  getThinkMode() {
    return this.thinkEngine.mode;
  }

  /**
   * Generate session ID
   * @returns {string}
   */
  _generateSessionId() {
    return `alya-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  }
}
