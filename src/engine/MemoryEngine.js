/**
 * MemoryEngine v2 - Persistent chat history + enhanced memory
 * 
 * - Chat history saved to file (persistent across restarts)
 * - Increased maxHistory from 5 → 50
 * - Full conversation export/import
 */

const MEMORY_KEY = 'alya_memory_v2';
const HISTORY_KEY = 'alya_chat_history_v2';

export class MemoryEngine {
  constructor() {
    this.conversationHistory = [];
    this.maxHistory = 50;
    
    this.userPreferences = {};
    this.behaviorTracker = {};
    
    this._loadMemory();
    this._loadChatHistory();
  }

  addMessage(role, message, metadata = {}) {
    const entry = {
      role,
      message,
      metadata,
      timestamp: Date.now()
    };
    this.conversationHistory.push(entry);

    if (this.conversationHistory.length > this.maxHistory) {
      this.conversationHistory.shift();
    }

    if (role === 'user') {
      this._detectPreferences(message);
    }

    // Auto-save chat history
    this._saveChatHistory();
  }

  getHistory(count = 50) {
    return this.conversationHistory.slice(-count);
  }

  getFullHistory() {
    return [...this.conversationHistory];
  }

  getLastMessage() {
    if (this.conversationHistory.length === 0) return null;
    return this.conversationHistory[this.conversationHistory.length - 1];
  }

  getLastUserIntent() {
    for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
      const msg = this.conversationHistory[i];
      if (msg.role === 'user' && msg.metadata?.intent) {
        return msg.metadata.intent;
      }
    }
    return null;
  }

  getIntentRepeatCount(intent, withinMessages = 5) {
    let count = 0;
    const history = this.getHistory(withinMessages);
    for (const msg of history) {
      if (msg.role === 'user' && msg.metadata?.intent === intent) {
        count++;
      }
    }
    return count;
  }

  trackBehavior(behavior) {
    if (!this.behaviorTracker[behavior]) {
      this.behaviorTracker[behavior] = { count: 0, lastTime: 0 };
    }
    this.behaviorTracker[behavior].count++;
    this.behaviorTracker[behavior].lastTime = Date.now();
    this._saveMemory();
  }

  getBehavior(behavior) {
    return this.behaviorTracker[behavior] || { count: 0, lastTime: 0 };
  }

  setPreference(key, value) {
    this.userPreferences[key] = value;
    this._saveMemory();
  }

  getPreference(key) {
    return this.userPreferences[key];
  }

  getAllPreferences() {
    return { ...this.userPreferences };
  }

  _detectPreferences(message) {
    const lower = message.toLowerCase();
    
    const sukaPatterns = [
      /aku\s+(suka|seneng|doyan)\s+(.+)/i,
      /favorit\s*(aku|ku|gue|gw)?\s*(itu|tuh|adalah)?\s*(.+)/i,
    ];
    
    const gaSukaPatterns = [
      /aku\s+(ga|gak|nggak|tidak)\s+suka\s+(.+)/i,
      /(ga|gak|nggak)\s+doyan\s+(.+)/i,
      /(benci|sebel sama|males sama)\s+(.+)/i,
    ];

    for (const pattern of sukaPatterns) {
      const match = lower.match(pattern);
      if (match) {
        const item = match[match.length - 1].trim();
        if (item.length > 1 && item.length < 50) {
          if (!this.userPreferences.suka) this.userPreferences.suka = [];
          if (!this.userPreferences.suka.includes(item)) {
            this.userPreferences.suka.push(item);
          }
        }
      }
    }

    for (const pattern of gaSukaPatterns) {
      const match = lower.match(pattern);
      if (match) {
        const item = match[match.length - 1].trim();
        if (item.length > 1 && item.length < 50) {
          if (!this.userPreferences.ga_suka) this.userPreferences.ga_suka = [];
          if (!this.userPreferences.ga_suka.includes(item)) {
            this.userPreferences.ga_suka.push(item);
          }
        }
      }
    }

    const namaPatterns = [
      /nama\s*(aku|ku|gue|gw)\s+(itu|tuh|adalah)?\s*(\w+)/i,
      /panggil\s*(aku|gue|gw)\s+(\w+)/i,
      /aku\s+(namanya|dipanggil)\s+(\w+)/i,
    ];

    for (const pattern of namaPatterns) {
      const match = lower.match(pattern);
      if (match) {
        const nama = match[match.length - 1].trim();
        if (nama.length > 1 && nama.length < 30) {
          this.userPreferences.nama_user = nama;
        }
      }
    }

    this._saveMemory();
  }

  getContext(thinkEngine = null) {
    const context = {
      historyLength: this.conversationHistory.length,
      lastIntent: this.getLastUserIntent(),
      preferences: this.userPreferences,
      recentTopics: this._getRecentTopics(),
      namaUser: this.userPreferences.nama_user || null
    };

    if (thinkEngine) {
      thinkEngine.addStep('memory', `History: ${context.historyLength} pesan, Last intent: ${context.lastIntent || 'none'}`, context);
      if (context.namaUser) {
        thinkEngine.addStep('memory', `Nama user: ${context.namaUser}`);
      }
    }

    return context;
  }

  _getRecentTopics() {
    const topics = [];
    for (const msg of this.conversationHistory) {
      if (msg.metadata?.intent && !topics.includes(msg.metadata.intent)) {
        topics.push(msg.metadata.intent);
      }
    }
    return topics;
  }

  _loadMemory() {
    try {
      const dataStr = localStorage.getItem(MEMORY_KEY);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        this.userPreferences = data.userPreferences || {};
        this.behaviorTracker = data.behaviorTracker || {};
      }
    } catch (e) {
      this.userPreferences = {};
      this.behaviorTracker = {};
    }
  }

  _saveMemory() {
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify({
        userPreferences: this.userPreferences,
        behaviorTracker: this.behaviorTracker,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) { /* silent */ }
  }

  _loadChatHistory() {
    try {
      const dataStr = localStorage.getItem(HISTORY_KEY);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        this.conversationHistory = data.conversations || [];
        // Trim to maxHistory
        if (this.conversationHistory.length > this.maxHistory) {
          this.conversationHistory = this.conversationHistory.slice(-this.maxHistory);
        }
      }
    } catch (e) {
      this.conversationHistory = [];
    }
  }

  _saveChatHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify({
        conversations: this.conversationHistory,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) { /* silent */ }
  }

  clearHistory() {
    this.conversationHistory = [];
    this._saveChatHistory();
  }

  reset() {
    this.conversationHistory = [];
    this.userPreferences = {};
    this.behaviorTracker = {};
    this._saveMemory();
    this._saveChatHistory();
  }
}
