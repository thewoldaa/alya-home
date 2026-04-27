/**
 * ThinkEngine - Sistem "berpikir" lokal untuk Alya
 * 
 * Terinspirasi dari pola thinking.ts pada source reference:
 * - Adaptive thinking: analisis konteks otomatis
 * - Enabled thinking: proses step-by-step terlihat
 * - Disabled thinking: langsung jawab tanpa proses visible
 * 
 * Think mode menampilkan proses internal Alya saat memahami pesan user,
 * termasuk intent detection, entity extraction, dan mood calculation.
 * Tanpa LLM - semua lokal menggunakan pattern matching.
 */

export class ThinkEngine {
  constructor() {
    /** @type {'adaptive'|'enabled'|'disabled'} */
    this.mode = 'disabled';
    this.steps = [];
    this.startTime = 0;
  }

  /**
   * Set mode thinking
   * @param {'adaptive'|'enabled'|'disabled'} mode 
   */
  setMode(mode) {
    if (['adaptive', 'enabled', 'disabled'].includes(mode)) {
      this.mode = mode;
    }
  }

  /**
   * Cek apakah thinking aktif
   * @returns {boolean}
   */
  isActive() {
    return this.mode !== 'disabled';
  }

  /**
   * Mulai sesi thinking baru
   */
  startSession() {
    this.steps = [];
    this.startTime = Date.now();
  }

  /**
   * Tambah langkah thinking
   * @param {string} category - Kategori step (intent, entity, memory, mood, response)
   * @param {string} description - Deskripsi langkah
   * @param {any} data - Data detail
   */
  addStep(category, description, data = null) {
    if (!this.isActive()) return;
    
    this.steps.push({
      timestamp: Date.now() - this.startTime,
      category,
      description,
      data
    });
  }

  /**
   * Akhiri sesi thinking dan generate output
   * @returns {object|null} Think output atau null jika disabled
   */
  finalize() {
    if (!this.isActive()) return null;

    const duration = Date.now() - this.startTime;
    
    return {
      mode: this.mode,
      duration_ms: duration,
      steps: this.steps,
      summary: this._generateSummary()
    };
  }

  /**
   * Generate ringkasan proses thinking
   * @returns {string}
   */
  _generateSummary() {
    const categories = {};
    for (const step of this.steps) {
      if (!categories[step.category]) {
        categories[step.category] = [];
      }
      categories[step.category].push(step.description);
    }

    let summary = '🧠 Proses Berpikir Alya:\n';
    
    if (categories.input) {
      summary += `  📥 Input: ${categories.input.join(', ')}\n`;
    }
    if (categories.intent) {
      summary += `  🎯 Intent: ${categories.intent.join(', ')}\n`;
    }
    if (categories.entity) {
      summary += `  📦 Entity: ${categories.entity.join(', ')}\n`;
    }
    if (categories.memory) {
      summary += `  💾 Memory: ${categories.memory.join(', ')}\n`;
    }
    if (categories.mood) {
      summary += `  😊 Mood: ${categories.mood.join(', ')}\n`;
    }
    if (categories.context) {
      summary += `  📋 Context: ${categories.context.join(', ')}\n`;
    }
    if (categories.response) {
      summary += `  💬 Response: ${categories.response.join(', ')}\n`;
    }
    if (categories.behavior) {
      summary += `  🎭 Behavior: ${categories.behavior.join(', ')}\n`;
    }

    return summary;
  }

  /**
   * Format thinking output untuk display
   * @param {object} thinkResult 
   * @returns {string}
   */
  static formatForDisplay(thinkResult) {
    if (!thinkResult) return '';

    let output = '\n┌─────────────────────────────────┐\n';
    output += '│  🧠 THINK MODE                  │\n';
    output += '├─────────────────────────────────┤\n';

    for (const step of thinkResult.steps) {
      const icon = {
        input: '📥',
        intent: '🎯',
        entity: '📦',
        memory: '💾',
        mood: '😊',
        context: '📋',
        response: '💬',
        behavior: '🎭'
      }[step.category] || '•';

      output += `│ ${icon} [${step.timestamp}ms] ${step.description}\n`;
      
      if (step.data && typeof step.data === 'object') {
        const dataStr = JSON.stringify(step.data, null, 2)
          .split('\n')
          .map(line => `│    ${line}`)
          .join('\n');
        output += `${dataStr}\n`;
      }
    }

    output += `├─────────────────────────────────┤\n`;
    output += `│ ⏱ Total: ${thinkResult.duration_ms}ms\n`;
    output += '└─────────────────────────────────┘\n';

    return output;
  }
}
