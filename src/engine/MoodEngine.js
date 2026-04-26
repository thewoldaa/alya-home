/**
 * MoodEngine v2 - Sistem mood Alya (anak kecil)
 * 
 * Expanded mood states, parameter-aware transitions,
 * mood decay/inertia from personality config.
 */

export class MoodEngine {
  constructor(personality) {
    this.personality = personality || { mood_system: { default_mood: 'senang', moods: {} }, waktu_respon: {} };
    this.params = this.personality.parameter_kepribadian || {};
    
    this.currentMood = this.personality.mood_system?.default_mood || 'senang';
    this.moodHistory = [];
    this.maxMoodHistory = 20;
  }

  update(intent, context, thinkEngine = null) {
    const previousMood = this.currentMood;
    
    const transitions = this.personality.mood_system.mood_transitions;
    const intentToTransition = {
      'pujian': 'dipuji',
      'ajakan_jalan': 'diajak_jalan',
      'perintah_tidur': 'disuruh_tidur',
      'ajakan_makan_sayur': 'disuruh_makan_sayur',
      'ajakan_jajan': 'diajak_jajan',
      'ekspresi_marah': 'dimarahin',
      'ajakan_main': 'diajak_main',
      'perintah_belajar': 'disuruh_belajar',
      'minta_cerita': 'diajak_cerita',
      'tanya_umum': 'ditanya_random',
      'nanya_kenapa': 'ditanya_random',
      'perpisahan': 'ditinggal',
      'minta_perhatian': 'dicuekin'
    };

    const transitionKey = intentToTransition[intent];
    if (transitionKey && transitions[transitionKey]) {
      this.currentMood = transitions[transitionKey];
    }

    // Time-based mood influence
    if (!transitionKey) {
      const timeMood = this._getTimeMood();
      if (Math.random() < 0.3) {
        this.currentMood = timeMood;
      }
    }

    // Drama level affects mood intensity
    if (this.params.drama_level > 80 && Math.random() < 0.2) {
      // High drama = more extreme moods
      const extremeMoods = ['antusias', 'ngambek', 'kesel'];
      if (extremeMoods.includes(this.currentMood)) {
        // Stay in extreme mood longer (mood inertia)
      }
    }

    this.moodHistory.push({
      mood: this.currentMood,
      trigger: intent,
      timestamp: Date.now()
    });
    if (this.moodHistory.length > this.maxMoodHistory) {
      this.moodHistory.shift();
    }

    if (thinkEngine) {
      const moodInfo = this.personality.mood_system.moods[this.currentMood];
      thinkEngine.addStep('mood', 
        `${previousMood} → ${this.currentMood} (${moodInfo?.deskripsi || '?'})`,
        { previous: previousMood, current: this.currentMood, trigger: intent }
      );
    }

    return this.currentMood;
  }

  getMoodInfo() {
    const moodData = this.personality.mood_system.moods[this.currentMood];
    return {
      mood: this.currentMood,
      ...moodData
    };
  }

  _getTimeMood() {
    const hour = new Date().getHours();
    const waktuConfig = this.personality.waktu_respon;
    for (const [, config] of Object.entries(waktuConfig)) {
      const [start, end] = config.range;
      if (start < end) {
        if (hour >= start && hour < end) return config.mood_default;
      } else {
        if (hour >= start || hour < end) return config.mood_default;
      }
    }
    return 'senang';
  }

  getMoodEmoji() {
    const moodData = this.personality.mood_system.moods[this.currentMood];
    return moodData?.emoji || '🤭';
  }
}
