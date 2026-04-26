export const MODEL_CATALOG = [
  // --- Text-out models ---
  {
    key: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    apiModel: 'gemini-2.5-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Generasi terbaru Flash yang cepat dan efisien.'
  },
  {
    key: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    apiModel: 'gemini-2.5-pro',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Pro tercanggih untuk penalaran kompleks.'
  },
  {
    key: 'gemini-2-flash',
    label: 'Gemini 2 Flash',
    apiModel: 'gemini-2.0-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Flash generasi 2.'
  },
  {
    key: 'gemini-2-flash-lite',
    label: 'Gemini 2 Flash Lite',
    apiModel: 'gemini-2.0-flash-lite',
    mode: 'chat',
    family: 'Gemini',
    note: 'Versi paling ringan dari Gemini 2 Flash.'
  },
  {
    key: 'gemini-3-flash',
    label: 'Gemini 3 Flash',
    apiModel: 'gemini-3.0-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Flash generasi 3.'
  },
  {
    key: 'gemini-3.1-flash-lite',
    label: 'Gemini 3.1 Flash Lite',
    apiModel: 'gemini-3.1-flash-lite',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Flash Lite generasi 3.1.'
  },
  {
    key: 'gemini-3.1-pro',
    label: 'Gemini 3.1 Pro',
    apiModel: 'gemini-3.1-pro',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Pro generasi 3.1.'
  },
  {
    key: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    apiModel: 'gemini-2.5-flash-lite',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Flash Lite generasi 2.5.'
  },

  // --- Multi-modal generative models (Image/Video/Audio/TTS) ---
  {
    key: 'gemini-2.5-flash-tts',
    label: 'Gemini 2.5 Flash TTS',
    apiModel: 'gemini-2.5-flash-tts',
    mode: 'tts',
    family: 'Gemini',
    note: 'Text-to-Speech berbasis Gemini 2.5 Flash.'
  },
  {
    key: 'gemini-2.5-pro-tts',
    label: 'Gemini 2.5 Pro TTS',
    apiModel: 'gemini-2.5-pro-tts',
    mode: 'tts',
    family: 'Gemini',
    note: 'Text-to-Speech berbasis Gemini 2.5 Pro.'
  },
  {
    key: 'imagen-4-generate',
    label: 'Imagen 4 Generate',
    apiModel: 'imagen-4',
    mode: 'image',
    family: 'Imagen',
    note: 'Generasi gambar Imagen 4 standar.'
  },
  {
    key: 'imagen-4-ultra',
    label: 'Imagen 4 Ultra Generate',
    apiModel: 'imagen-4-ultra',
    mode: 'image',
    family: 'Imagen',
    note: 'Generasi gambar kualitas tertinggi Imagen 4.'
  },
  {
    key: 'imagen-4-fast',
    label: 'Imagen 4 Fast Generate',
    apiModel: 'imagen-4-fast',
    mode: 'image',
    family: 'Imagen',
    note: 'Generasi gambar tercepat Imagen 4.'
  },
  {
    key: 'nano-banana',
    label: 'Nano Banana (Gemini 2.5 Flash Preview Image)',
    apiModel: 'nano-banana',
    mode: 'image',
    family: 'Gemini',
    note: 'Model preview gambar berbasis Gemini 2.5 Flash.'
  },
  {
    key: 'nano-banana-pro',
    label: 'Nano Banana Pro (Gemini 3 Pro Image)',
    apiModel: 'nano-banana-pro',
    mode: 'image',
    family: 'Gemini',
    note: 'Model preview gambar berbasis Gemini 3 Pro.'
  },
  {
    key: 'nano-banana-2',
    label: 'Nano Banana 2 (Gemini 3.1 Flash Image)',
    apiModel: 'nano-banana-2',
    mode: 'image',
    family: 'Gemini',
    note: 'Model preview gambar berbasis Gemini 3.1 Flash.'
  },
  {
    key: 'lyria-3-clip',
    label: 'Lyria 3 Clip',
    apiModel: 'lyria-3-clip',
    mode: 'audio',
    family: 'Lyria',
    note: 'Model klip musik/audio Lyria 3.'
  },
  {
    key: 'lyria-3-pro',
    label: 'Lyria 3 Pro',
    apiModel: 'lyria-3-pro',
    mode: 'audio',
    family: 'Lyria',
    note: 'Model audio profesional Lyria 3.'
  },
  {
    key: 'veo-3-generate',
    label: 'Veo 3 Generate',
    apiModel: 'veo-3',
    mode: 'video',
    family: 'Veo',
    note: 'Generasi video Veo 3.'
  },
  {
    key: 'veo-3-fast',
    label: 'Veo 3 Fast Generate',
    apiModel: 'veo-3-fast',
    mode: 'video',
    family: 'Veo',
    note: 'Generasi video Veo 3 cepat.'
  },
  {
    key: 'veo-3-lite',
    label: 'Veo 3 Lite Generate',
    apiModel: 'veo-3-lite',
    mode: 'video',
    family: 'Veo',
    note: 'Generasi video Veo 3 ringan.'
  },
  {
    key: 'gemini-3.1-flash-tts',
    label: 'Gemini 3.1 Flash TTS',
    apiModel: 'gemini-3.1-flash-tts',
    mode: 'tts',
    family: 'Gemini',
    note: 'Text-to-Speech berbasis Gemini 3.1 Flash.'
  },

  // --- Gemma models ---
  {
    key: 'gemma-3-1b',
    label: 'Gemma 3 1B',
    apiModel: 'gemma-3-1b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 ultra ringan.'
  },
  {
    key: 'gemma-3-2b',
    label: 'Gemma 3 2B',
    apiModel: 'gemma-3-2b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 ringan 2B.'
  },
  {
    key: 'gemma-3-4b',
    label: 'Gemma 3 4B',
    apiModel: 'gemma-3-4b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 seimbang 4B.'
  },
  {
    key: 'gemma-3-12b',
    label: 'Gemma 3 12B',
    apiModel: 'gemma-3-12b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 kuat 12B.'
  },
  {
    key: 'gemma-3-27b',
    label: 'Gemma 3 27B',
    apiModel: 'gemma-3-27b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 performa tinggi 27B.'
  },
  {
    key: 'gemma-4-26b',
    label: 'Gemma 4 26B',
    apiModel: 'gemma-4-26b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 4 generasi berikutnya 26B.'
  },
  {
    key: 'gemma-4-31b',
    label: 'Gemma 4 31B',
    apiModel: 'gemma-4-31b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 4 generasi berikutnya 31B.'
  },

  // --- Other/Special models ---
  {
    key: 'gemini-embedding-1',
    label: 'Gemini Embedding 1',
    apiModel: 'text-embedding-004',
    mode: 'embedding',
    family: 'Gemini',
    note: 'Embedding teks v1.'
  },
  {
    key: 'gemini-embedding-2',
    label: 'Gemini Embedding 2',
    apiModel: 'text-embedding-005',
    mode: 'embedding',
    family: 'Gemini',
    note: 'Embedding teks v2.'
  },
  {
    key: 'gemini-robotics-1.5',
    label: 'Gemini Robotics ER 1.5 Preview',
    apiModel: 'gemini-robotics-1.5',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model khusus robotika v1.5.'
  },
  {
    key: 'gemini-robotics-1.6',
    label: 'Gemini Robotics ER 1.6 Preview',
    apiModel: 'gemini-robotics-1.6',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model khusus robotika v1.6.'
  },
  {
    key: 'computer-use-preview',
    label: 'Computer Use Preview',
    apiModel: 'computer-use-preview',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model dengan kemampuan navigasi komputer.'
  },
  {
    key: 'deep-research-pro',
    label: 'Deep Research Pro Preview',
    apiModel: 'deep-research-pro',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model khusus riset mendalam.'
  },

  // --- Live API models ---
  {
    key: 'gemini-2.5-flash-audio-dialog',
    label: 'Gemini 2.5 Flash Native Audio Dialog',
    apiModel: 'gemini-2.5-flash-audio',
    mode: 'live',
    family: 'Gemini',
    note: 'Dialog audio native dengan Gemini 2.5 Flash.'
  },
  {
    key: 'gemini-3-flash-live',
    label: 'Gemini 3 Flash Live',
    apiModel: 'gemini-3.0-flash-live',
    mode: 'live',
    family: 'Gemini',
    note: 'Mode Live realtime Gemini 3 Flash.'
  }
];

export const DEFAULT_MODEL_KEY = 'gemini-2.5-flash';

export function getModelByKey(key) {
  return MODEL_CATALOG.find((item) => item.key === key) || null;
}

export function getModelByApiModel(apiModel) {
  return MODEL_CATALOG.find((item) => item.apiModel === apiModel) || null;
}

export function getStoredModelSelection() {
  const customModelId = (localStorage.getItem('alya_custom_model_id') || '').trim();
  const selectedKey = localStorage.getItem('alya_model_key') || DEFAULT_MODEL_KEY;
  const legacyModel = localStorage.getItem('alya_gemini_model') || '';

  if (customModelId) {
    return {
      key: 'custom',
      label: 'Custom Model',
      apiModel: customModelId,
      mode: 'chat',
      family: 'Custom',
      note: 'Model custom dari user. Pastikan mendukung generateContent.'
    };
  }

  const byKey = getModelByKey(selectedKey);
  if (byKey) return byKey;

  const byLegacy = getModelByApiModel(legacyModel);
  if (byLegacy) return byLegacy;

  return getModelByKey(DEFAULT_MODEL_KEY);
}

export function isChatModel(model) {
  return !!model && model.mode === 'chat';
}
