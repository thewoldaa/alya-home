/**
 * IntentEngine - Mesin pengenalan intent berbasis keyword + pattern
 * 
 * v2.0 - Support custom rules dari user
 * Tanpa LLM - menggunakan regex pattern matching dan keyword scoring.
 */

const CUSTOM_RULES_KEY = 'alya_custom_rules_v2';

export class IntentEngine {
  constructor(intentData) {
    this.intentData = intentData || { intents: {}, entities: {} };
    this.intents = this.intentData.intents || {};
    this.entities = this.intentData.entities || {};
    
    // Load custom rules
    this.customRules = this._loadCustomRules();
  }

  /**
   * Load custom rules dari localStorage
   */
  _loadCustomRules() {
    try {
      const dataStr = localStorage.getItem(CUSTOM_RULES_KEY);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        return data.rules || [];
      }
    } catch (e) { /* silent */ }
    return [];
  }

  /**
   * Reload custom rules (dipanggil setelah rules diubah)
   */
  reloadCustomRules() {
    this.customRules = this._loadCustomRules();
  }

  /**
   * Analisis input user dan deteksi intent
   */
  analyze(input, thinkEngine = null) {
    const normalized = this._normalize(input);
    
    if (thinkEngine) {
      thinkEngine.addStep('input', `Normalized: "${normalized}"`, { original: input, normalized });
    }

    // Score built-in intents
    const scores = {};
    for (const [intentName, intentConfig] of Object.entries(this.intents)) {
      scores[intentName] = this._scoreIntent(normalized, intentConfig, thinkEngine);
    }

    // Score custom rules (higher base priority)
    let customMatch = null;
    let customBestScore = 0;
    for (const rule of this.customRules) {
      const ruleScore = this._scoreCustomRule(normalized, rule);
      if (ruleScore > customBestScore) {
        customBestScore = ruleScore;
        customMatch = rule;
      }
    }

    // Cari intent built-in terbaik
    let bestIntent = 'fallback';
    let bestScore = 0;
    for (const [intentName, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intentName;
      }
    }

    // Custom rules override jika score lebih tinggi
    if (customMatch && customBestScore > bestScore) {
      bestIntent = `custom:${customMatch.id || customMatch.name}`;
      bestScore = customBestScore;
      if (thinkEngine) {
        thinkEngine.addStep('intent', `Custom rule matched: ${customMatch.name}`);
      }
    }

    // Threshold minimum
    const confidence = Math.min(bestScore / 10, 1.0);
    if (bestScore < 2) {
      bestIntent = 'fallback';
    }

    // Extract entities
    const detectedEntities = this._extractEntities(normalized, thinkEngine);

    if (thinkEngine) {
      thinkEngine.addStep('intent', `Detected: ${bestIntent} (confidence: ${(confidence * 100).toFixed(0)}%)`, {
        intent: bestIntent,
        confidence,
        allScores: scores
      });
    }

    return {
      intent: bestIntent,
      confidence,
      entities: detectedEntities,
      scores,
      customRule: customMatch && customBestScore > bestScore ? customMatch : null
    };
  }

  _normalize(input) {
    return input.toLowerCase().trim().replace(/[!?.,:;'"()]/g, '').replace(/\s+/g, ' ');
  }

  _scoreIntent(input, intentConfig, thinkEngine = null) {
    let score = 0;
    for (const keyword of intentConfig.keywords || []) {
      if (input.includes(keyword.toLowerCase())) {
        score += 3;
      }
    }
    for (const pattern of intentConfig.patterns || []) {
      try {
        if (new RegExp(pattern, 'i').test(input)) {
          score += 5;
        }
      } catch (e) { /* skip */ }
    }
    if (score > 0 && intentConfig.priority) {
      score += intentConfig.priority;
    }
    return score;
  }

  _scoreCustomRule(input, rule) {
    let score = 0;
    for (const keyword of rule.keywords || []) {
      if (input.includes(keyword.toLowerCase())) {
        score += 4; // slightly higher than built-in
      }
    }
    for (const pattern of rule.patterns || []) {
      try {
        if (new RegExp(pattern, 'i').test(input)) {
          score += 6;
        }
      } catch (e) { /* skip */ }
    }
    if (score > 0) {
      score += (rule.priority || 5) + 2; // bonus for custom rules
    }
    return score;
  }

  _extractEntities(input, thinkEngine = null) {
    const detected = {};
    for (const [entityType, entityConfig] of Object.entries(this.entities)) {
      for (const [entityValue, keywords] of Object.entries(entityConfig.keywords)) {
        for (const keyword of keywords) {
          if (input.includes(keyword.toLowerCase())) {
            if (!detected[entityType]) detected[entityType] = [];
            if (!detected[entityType].includes(entityValue)) {
              detected[entityType].push(entityValue);
            }
          }
        }
      }
    }
    if (thinkEngine && Object.keys(detected).length > 0) {
      thinkEngine.addStep('entity', `Found: ${JSON.stringify(detected)}`);
    }
    return detected;
  }
}
