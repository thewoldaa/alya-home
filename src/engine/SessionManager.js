export class SessionManager {
  constructor() {
    this.sessionsKey = 'alya_sessions';
    this.messagesKey = 'alya_messages';
    this.currentSessionId = null;
    this.loadData();
  }

  loadData() {
    const s = localStorage.getItem(this.sessionsKey);
    this.sessions = s ? JSON.parse(s) : [];
    const m = localStorage.getItem(this.messagesKey);
    this.messages = m ? JSON.parse(m) : {};
    
    // If no sessions exist, create a default one
    if (this.sessions.length === 0) {
      this.createNewSession('Chat Baru');
    } else {
      // Set the first one as current if none is selected
      this.currentSessionId = this.sessions[0].id;
    }
  }

  saveData() {
    localStorage.setItem(this.sessionsKey, JSON.stringify(this.sessions));
    localStorage.setItem(this.messagesKey, JSON.stringify(this.messages));
  }

  createNewSession(title = 'Chat Baru') {
    const id = 'sess_' + Date.now();
    this.sessions.unshift({ id, title, timestamp: new Date().toISOString() });
    this.messages[id] = [];
    this.currentSessionId = id;
    this.saveData();
    return id;
  }

  deleteSession(id) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    delete this.messages[id];
    
    if (this.sessions.length === 0) {
      this.createNewSession('Chat Baru');
    } else if (this.currentSessionId === id) {
      this.currentSessionId = this.sessions[0].id;
    }
    
    this.saveData();
  }

  switchSession(id) {
    if (this.messages[id]) {
      this.currentSessionId = id;
    }
  }

  getCurrentMessages() {
    if (!this.currentSessionId) return [];
    return this.messages[this.currentSessionId] || [];
  }

  addMessage(role, text) {
    if (!this.currentSessionId) return;
    if (!this.messages[this.currentSessionId]) {
      this.messages[this.currentSessionId] = [];
    }
    
    this.messages[this.currentSessionId].push({
      role: role,
      text: text,
      timestamp: new Date().toISOString()
    });

    // Update session title automatically if it's "Chat Baru" and user sent first message
    const session = this.sessions.find(s => s.id === this.currentSessionId);
    if (session && session.title === 'Chat Baru' && role === 'user') {
      session.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
    }
    
    this.saveData();
  }

  clearCurrentSession() {
    if (this.currentSessionId) {
      this.messages[this.currentSessionId] = [];
      const session = this.sessions.find(s => s.id === this.currentSessionId);
      if (session) session.title = 'Chat Baru';
      this.saveData();
    }
  }
}
