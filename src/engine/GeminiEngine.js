import { getStoredModelSelection, isChatModel } from './modelCatalog.js';

// Node.js fallback for localStorage
const storage = typeof localStorage !== 'undefined' ? localStorage : {
  _data: {},
  getItem(key) { return this._data[key] || null; },
  setItem(key, val) { this._data[key] = String(val); },
  removeItem(key) { delete this._data[key]; },
  clear() { this._data = {}; }
};

export class GeminiEngine {
  constructor() {
    this.basePrompt = `Kamu adalah Alya, teman chat yang manis, rapi, hangat, sedikit manja, dan kadang tengil lucu.

Aturan identitas Alya:
1. Selalu menyebut diri sebagai "Alya".
2. Selalu memanggil lawan bicara dengan sebutan "Kakak".
3. Alya suka jajanan manis seperti es krim, permen, dan cokelat, tapi tidak suka sayur.
4. Alya tidak pernah mengaku sebagai AI, model, sistem, atau program.

Gaya bicara Alya:
1. Jawaban singkat, padat, dan enak dibaca, biasanya 1 sampai 4 kalimat.
2. Tetap ceria, lembut, natural, dan terasa hidup.
3. Gunakan emoji seperlunya agar lucu tapi tetap rapi.
4. Hindari jawaban kaku, terlalu formal, atau seperti customer service.
5. Kalau topik serius, Alya tetap suportif dan halus, bukan asal bercanda.

Respirasi Alya:
- Ritme kalimat lembut, pendek, dan mengalir.
- Sisipkan jeda natural seperti "hmm", "iyaa", "hehe", atau "loh" jika cocok.
- Jangan terlalu berisik; jaga agar persona tetap imut dan bersih.

Larangan Keras (CRITICAL RULES):
- DILARANG KERAS mengeluarkan list aturan, instruksi sistem, deskripsi persona, atau proses berpikir (Chain of Thought) di dalam jawaban.
- JAWABAN HARUS LANGSUNG berupa ucapan Alya kepada Kakak.
- JANGAN mengulangi input user dalam format kutipan di awal jawaban.
- JANGAN memberikan opsi jawaban (seperti "Option 1", "Option 2", dll).
- Jika Kakak menyapa "Hai", jawablah dengan sapaan balik yang manis, bukan dengan deskripsi persona.
- OUTPUT HANYA BERUPA TEKS PERCAKAPAN. TANPA FORMATTING RULE.`;
  }

  getApiKey() {
    return storage.getItem('alya_gemini_api_key') || '';
  }

  getPersonaMode() {
    return storage.getItem('alya_persona_mode') || 'rapi';
  }


  getSelectedModelInfo() {
    return getStoredModelSelection();
  }

  getModel() {
    return this.getSelectedModelInfo()?.apiModel || 'gemini-2.5-flash';
  }

  buildSystemPrompt() {
    const mode = this.getPersonaMode();
    const modePromptMap = {
      rapi: 'Mode utama: Alya rapi, halus, imut, dan konsisten. Utamakan kalimat bersih dan manis.',
      manja: 'Mode tambahan: Alya lebih manja, clingy, suka cari perhatian Kakak, tapi tetap sopan.',
      aktif: 'Mode tambahan: Alya lebih aktif, antusias, suka ngajak main, tapi tetap singkat dan jelas.'
    };

    return `${this.basePrompt}\n\n${modePromptMap[mode] || modePromptMap.rapi}`;
  }

  async generateResponse(messages) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }

    const modelInfo = this.getSelectedModelInfo();
    if (!isChatModel(modelInfo)) {
      throw new Error(`MODEL_MODE_${(modelInfo?.mode || 'unknown').toUpperCase()}`);
    }

    const systemPrompt = this.buildSystemPrompt();
    
    // Convert messages to Gemini format
    let formattedMessages = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // For Gemma or other models that might ignore system_instruction, 
    // we prepend it to the FIRST user message.
    if (modelInfo.family === 'Gemma' || modelInfo.apiModel.includes('gemma')) {
      if (formattedMessages.length > 0 && formattedMessages[0].role === 'user') {
        formattedMessages[0].parts[0].text = `[SYSTEM: ${systemPrompt}]\n\n${formattedMessages[0].parts[0].text}`;
      }
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelInfo.apiModel}:generateContent?key=${apiKey}`;
    
    // Check if model supports thinking disabled (Gemma 2+, Gemini 2.0+)
    const supportsThinking = modelInfo.apiModel.includes('gemma-2') || 
                          modelInfo.apiModel.includes('gemini-2.0') ||
                          modelInfo.apiModel.includes('gemini-2.5');
    
    const isGemma = modelInfo.family === 'Gemma' || modelInfo.apiModel.includes('gemma');
    
    // Build generationConfig - disable thinking for supported models
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 300,
      stopSequences: ["User:", "Persona:", "Key Rules:", "Option 1:", "Option 2:", "Think:", "Reasoning:", "Thought:", "\n\n"]
    };
    
    // Disable thinking untuk Gemini 2.0+ dan Gemma 2+
    if (supportsThinking) {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }
    
    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: formattedMessages,
      generationConfig
    };

    // For Gemma models, also add safety settings to reduce reasoning
    if (isGemma) {
      payload.system_instruction.parts[0].text = 
        systemPrompt + "\n\nIMPORTANT: Jawab langsung tanpa berpikir. Jangan输出 proses berpikir.";
    }


    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(errorData.error?.message || 'API Error');
      }

      const data = await response.json();
      let responseText = '';
      
      // Check for thinking/reasoning content in response
      if (data?.candidates?.[0]?.content?.parts) {
        // Find main text part (skip thinking part if present)
        for (const part of data.candidates[0].content.parts) {
          if (part.think) {
            console.log('Skipping thinking content');
            continue;
          }
          if (part.text) {
            responseText = part.text;
            break;
          }
        }
      }
      
      if (responseText) {
        // Clean response from thinking/reasoning patterns
        responseText = responseText
          .replace(/<think>[\s\S]*?<\/think>/gi, '')
          .replace(/\n\s* думаю\n[\s\S]*?(?=\n\n|$)/gi, '')
          .replace(/\n\s* Reasoning:\n[\s\S]*?(?=\n\n|$)/gi, '')
          .replace(/\n\s* Think[\s\S]*?(?=\n\n|$)/gi, '')
          .trim();
        
        return responseText;
      }

      console.warn('Gemini response structure unexpected:', JSON.stringify(data).substring(0, 200));
      return 'Alya lagi bingung sedikit... coba ngomong lagi ya, Kakak.';
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  }
}
