/**
 * ResponseEngine v2 - Mesin respons Alya (anak kecil polos + tengil)
 * 
 * - Template-based responses with child personality injection
 * - Custom rule response support
 * - Parameter-aware modifiers from personality.json
 * - Behavioral rules (refuse sleep, hate vegetables, etc.)
 */

export class ResponseEngine {
  constructor(responses, personality) {
    this.responses = responses || {};
    this.personality = personality || {};
    this.params = this.personality.parameter_kepribadian || {};
    
    this.recentResponses = [];
    this.maxRecent = 15;
  }

  generate(intent, context, analysis, memoryEngine, thinkEngine = null) {
    let response = '';

    // Check for custom rule match first
    if (analysis.customRule && analysis.customRule.responses) {
      response = this._pickVariation(analysis.customRule.responses);
      if (thinkEngine) {
        thinkEngine.addStep('response', `Using custom rule: ${analysis.customRule.name}`);
      }
    } else {
      // Apply behavioral rules
      const behaviorResult = this._applyBehaviorRules(intent, context, memoryEngine, thinkEngine);
      if (behaviorResult) {
        response = behaviorResult;
      } else {
        response = this._getResponse(intent, context, analysis, thinkEngine);
      }
    }

    // Apply personality modifiers
    response = this._applyPersonalityModifiers(response, context, thinkEngine);

    // Apply child-like modifiers based on parameters
    response = this._applyChildModifiers(response, thinkEngine);

    // Track response
    this.recentResponses.push(response);
    if (this.recentResponses.length > this.maxRecent) {
      this.recentResponses.shift();
    }

    if (thinkEngine) {
      thinkEngine.addStep('response', `Final response generated (${response.length} chars)`);
    }

    return response;
  }

  _applyBehaviorRules(intent, context, memoryEngine, thinkEngine = null) {
    if (intent === 'perintah_tidur') {
      const repeatCount = memoryEngine.getIntentRepeatCount('perintah_tidur', 5);
      memoryEngine.trackBehavior('disuruh_tidur');
      
      if (thinkEngine) {
        thinkEngine.addStep('behavior', `Perintah tidur diulang ${repeatCount}x (resistance: ${this.params.bedtime_resistance}%)`, { repeatCount });
      }

      // High bedtime_resistance means more repeats needed
      const threshold = Math.max(2, Math.floor(this.params.bedtime_resistance / 40));
      if (repeatCount >= threshold) {
        if (thinkEngine) thinkEngine.addStep('behavior', 'Resistance broken → mulai nurut *tapi ga rela*');
        return this._pickVariation(this.responses.perintah_tidur.variasi_diulang);
      } else {
        if (thinkEngine) thinkEngine.addStep('behavior', 'Masih kuat nolak tidur! 😤');
        return this._pickVariation(this.responses.perintah_tidur.variasi_awal);
      }
    }

    if (intent === 'ajakan_makan_sayur') {
      if (thinkEngine) {
        thinkEngine.addStep('behavior', `Sayur detected → VEGETABLE HATRED: ${this.params.vegetable_hatred}% → AUTO REJECT! 😖`);
      }
      return this._pickVariation(this.responses.ajakan_makan_sayur.variasi);
    }

    return null;
  }

  _getResponse(intent, context, analysis, thinkEngine = null) {
    const responseSet = this.responses[intent];
    
    if (!responseSet) {
      if (thinkEngine) thinkEngine.addStep('response', `No response for: ${intent}, using fallback`);
      return this._pickVariation(this.responses.fallback.variasi);
    }

    // Time-based variants for sapaan
    if (intent === 'sapaan') {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11 && responseSet.variasi_pagi) {
        if (thinkEngine) thinkEngine.addStep('context', 'Pagi → Alya masih ngantuk~');
        return this._pickVariation(responseSet.variasi_pagi);
      }
      if (hour >= 18 && responseSet.variasi_malam) {
        if (thinkEngine) thinkEngine.addStep('context', 'Malam → Alya ga mau tidur!');
        return this._pickVariation(responseSet.variasi_malam);
      }
    }

    return this._pickVariation(responseSet.variasi);
  }

  _pickVariation(variations) {
    if (!variations || variations.length === 0) return 'hmm... 🤭';
    const available = variations.filter(v => !this.recentResponses.includes(v));
    const pool = available.length > 0 ? available : variations;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  _applyPersonalityModifiers(response, context, thinkEngine = null) {
    const hour = new Date().getHours();
    
    if ((hour >= 23 || hour < 4) && Math.random() < 0.3) {
      const sleepy = [' *nguap lebar*', ' ...zzz...', ' 💤', ' *mata merem melek*'];
      response += sleepy[Math.floor(Math.random() * sleepy.length)];
      if (thinkEngine) thinkEngine.addStep('mood', 'Larut malam → ngantuk tapi ngeyel');
    }

    if (hour >= 5 && hour < 8 && Math.random() < 0.3) {
      const morning = [' ...masih ngantuk...', ' *guling-guling*', ' *tarik selimut*'];
      response += morning[Math.floor(Math.random() * morning.length)];
      if (thinkEngine) thinkEngine.addStep('mood', 'Pagi → ga mau bangun');
    }

    return response;
  }

  /**
   * Apply child-like modifiers based on personality parameters
   */
  _applyChildModifiers(response, thinkEngine = null) {
    const modifiers = this.personality.response_modifiers || {};

    // Chance to add "tapi kenapa?" 
    if (Math.random() < (modifiers.tambah_kenapa_chance || 0)) {
      const kenapa = [' ...tapi kenapa?', ' emangnya kenapa?', ' tapi kok?'];
      response += kenapa[Math.floor(Math.random() * kenapa.length)];
    }

    // Chance to add sound effects
    if (Math.random() < (modifiers.tambah_suara_efek_chance || 0)) {
      const sfx = [' *WUUSH!*', ' *BAAM!*', ' *TADAAA!*', ' *pew pew!*'];
      response += sfx[Math.floor(Math.random() * sfx.length)];
    }

    // Chance to add random singing
    if (Math.random() < (modifiers.tambah_nyanyi_chance || 0)) {
      const songs = [' 🎵 lalala~', ' 🎵 nanana~', ' 🎵 dududu~'];
      response += songs[Math.floor(Math.random() * songs.length)];
    }

    // Self-refer as "Alya" (already in responses but boost consistency)
    if (Math.random() < (modifiers.self_refer_as_alya_chance || 0)) {
      response = response.replace(/\baku\b/i, 'Alya');
    }

    return response;
  }
}
