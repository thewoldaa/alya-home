export const MODEL_CATALOG = [
  // --- EXISTING / CLASSIC ---
  {
    key: 'gemini-1.5-flash',
    label: 'Gemini 1.5 Flash',
    apiModel: 'gemini-1.5-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Sangat cepat dan efisien. Cocok untuk penggunaan harian.'
  },
  {
    key: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    apiModel: 'gemini-1.5-pro',
    mode: 'chat',
    family: 'Gemini',
    note: 'Paling cerdas, bisa mikir lebih dalam dan kompleks.'
  },

  // --- GEMINI 2.x & 3.x ---
  {
    key: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    apiModel: 'gemini-2.5-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Generasi terbaru Flash, lebih pintar dan tetap kilat.'
  },
  {
    key: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    apiModel: 'gemini-2.5-pro',
    mode: 'chat',
    family: 'Gemini',
    note: 'Versi Pro 2.5 untuk tugas-tugas sangat berat.'
  },
  {
    key: 'gemini-2-flash',
    label: 'Gemini 2 Flash',
    apiModel: 'gemini-2.0-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Gemini 2 yang lincah.'
  },
  {
    key: 'gemini-2-flash-lite',
    label: 'Gemini 2 Flash Lite',
    apiModel: 'gemini-2.0-flash-lite',
    mode: 'chat',
    family: 'Gemini',
    note: 'Versi paling ringan dari seri Gemini 2.'
  },
  {
    key: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    apiModel: 'gemini-2.5-flash-lite',
    mode: 'chat',
    family: 'Gemini',
    note: 'Versi Lite dari Gemini 2.5.'
  },
  {
    key: 'gemini-3-flash',
    label: 'Gemini 3 Flash',
    apiModel: 'gemini-3.0-flash',
    mode: 'chat',
    family: 'Gemini',
    note: 'Model Gemini 3 tercepat (Preview).'
  },
  {
    key: 'gemini-3.1-flash-lite',
    label: 'Gemini 3.1 Flash Lite',
    apiModel: 'gemini-3.1-flash-lite',
    mode: 'chat',
    family: 'Gemini',
    note: 'Optimasi terbaru untuk kecepatan maksimal.'
  },
  {
    key: 'gemini-3.1-pro',
    label: 'Gemini 3.1 Pro',
    apiModel: 'gemini-3.1-pro',
    mode: 'chat',
    family: 'Gemini',
    note: 'Kecerdasan puncak di seri 3.1.'
  },

  // --- GEMMA 3 & 4 ---
  {
    key: 'gemma-3-1b',
    label: 'Gemma 3 1B',
    apiModel: 'gemma-3-1b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Model Gemma 3 terkecil dan super ringan.'
  },
  {
    key: 'gemma-3-2b',
    label: 'Gemma 3 2B',
    apiModel: 'gemma-3-2b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 versi 2B yang seimbang.'
  },
  {
    key: 'gemma-3-4b',
    label: 'Gemma 3 4B',
    apiModel: 'gemma-3-4b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 dengan performa lebih baik.'
  },
  {
    key: 'gemma-3-12b',
    label: 'Gemma 3 12B',
    apiModel: 'gemma-3-12b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 kelas menengah yang cerdas.'
  },
  {
    key: 'gemma-3-27b',
    label: 'Gemma 3 27B',
    apiModel: 'gemma-3-27b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Gemma 3 paling matang dan berkualitas.'
  },
  {
    key: 'gemma-4-26b',
    label: 'Gemma 4 26B',
    apiModel: 'gemma-4-26b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Generasi 4 dari Gemma, sangat eksperimental.'
  },
  {
    key: 'gemma-4-31b',
    label: 'Gemma 4 31B',
    apiModel: 'gemma-4-31b-it',
    mode: 'chat',
    family: 'Gemma',
    note: 'Varian tertinggi Gemma 4 saat ini.'
  },

  // --- MULTI-MODAL & GENERATIVE ---
  {
    key: 'gemini-2.5-flash-tts',
    label: 'Gemini 2.5 Flash TTS',
    apiModel: 'gemini-2.5-flash-tts',
    mode: 'multimodal',
    family: 'Gemini',
    note: 'Fokus pada Text-to-Speech berkualitas tinggi.'
  },
  {
    key: 'gemini-2.5-pro-tts',
    label: 'Gemini 2.5 Pro TTS',
    apiModel: 'gemini-2.5-pro-tts',
    mode: 'multimodal',
    family: 'Gemini',
    note: 'Pro TTS untuk narasi yang sangat alami.'
  },
  {
    key: 'imagen-4-generate',
    label: 'Imagen 4 Generate',
    apiModel: 'imagen-4',
    mode: 'multimodal',
    family: 'Imagen',
    note: 'Bikin gambar estetik langsung lewat chat.'
  },
  {
    key: 'imagen-4-ultra',
    label: 'Imagen 4 Ultra Generate',
    apiModel: 'imagen-4-ultra',
    mode: 'multimodal',
    family: 'Imagen',
    note: 'Kualitas gambar terbaik di kelasnya.'
  },
  {
    key: 'imagen-4-fast',
    label: 'Imagen 4 Fast Generate',
    apiModel: 'imagen-4-fast',
    mode: 'multimodal',
    family: 'Imagen',
    note: 'Cepat buat gambar dalam sekejap.'
  },
  {
    key: 'nano-banana',
    label: 'Nano Banana (Gemini 2.5 Flash Preview Image)',
    apiModel: 'nano-banana',
    mode: 'multimodal',
    family: 'Gemini',
    note: 'Model ringan untuk pemrosesan gambar cepat.'
  },
  {
    key: 'nano-banana-pro',
    label: 'Nano Banana Pro (Gemini 3 Pro Image)',
    apiModel: 'nano-banana-pro',
    mode: 'multimodal',
    family: 'Gemini',
    note: 'Versi Pro dari Nano Banana.'
  },
  {
    key: 'nano-banana-2',
    label: 'Nano Banana 2 (Gemini 3.1 Flash Image)',
    apiModel: 'nano-banana-2',
    mode: 'multimodal',
    family: 'Gemini',
    note: 'Generasi ke-2 Nano Banana.'
  },
  {
    key: 'lyria-3-clip',
    label: 'Lyria 3 Clip',
    apiModel: 'lyria-3-clip',
    mode: 'multimodal',
    family: 'Lyria',
    note: 'Fokus pada pemahaman audio/musik.'
  },
  {
    key: 'lyria-3-pro',
    label: 'Lyria 3 Pro',
    apiModel: 'lyria-3-pro',
    mode: 'multimodal',
    family: 'Lyria',
    note: 'Penciptaan audio profesional.'
  },
  {
    key: 'veo-3-generate',
    label: 'Veo 3 Generate',
    apiModel: 'veo-3',
    mode: 'multimodal',
    family: 'Veo',
    note: 'Generasi video dari teks.'
  },
  {
    key: 'veo-3-fast',
    label: 'Veo 3 Fast Generate',
    apiModel: 'veo-3-fast',
    mode: 'multimodal',
    family: 'Veo',
    note: 'Video generator super cepat.'
  },
  {
    key: 'veo-3-lite',
    label: 'Veo 3 Lite Generate',
    apiModel: 'veo-3-lite',
    mode: 'multimodal',
    family: 'Veo',
    note: 'Versi ringan untuk video pendek.'
  },
  {
    key: 'gemini-3.1-flash-tts',
    label: 'Gemini 3.1 Flash TTS',
    apiModel: 'gemini-3.1-flash-tts',
    mode: 'multimodal',
    family: 'Gemini',
    note: 'TTS generasi 3.1 yang lebih ekspresif.'
  },

  // --- SPECIALIZED / OTHER ---
  {
    key: 'gemini-robotics-er-1.5',
    label: 'Gemini Robotics ER 1.5 Preview',
    apiModel: 'gemini-robotics-1.5',
    mode: 'other',
    family: 'Gemini',
    note: 'Fokus pada instruksi robotik dan fisik.'
  },
  {
    key: 'gemini-robotics-er-1.6',
    label: 'Gemini Robotics ER 1.6 Preview',
    apiModel: 'gemini-robotics-1.6',
    mode: 'other',
    family: 'Gemini',
    note: 'Versi terbaru untuk penalaran robotik.'
  },
  {
    key: 'computer-use-preview',
    label: 'Computer Use Preview',
    apiModel: 'computer-use-preview',
    mode: 'other',
    family: 'Gemini',
    note: 'Kemampuan mengendalikan antarmuka komputer.'
  },
  {
    key: 'gemini-embedding-1',
    label: 'Gemini Embedding 1',
    apiModel: 'text-embedding-001',
    mode: 'embedding',
    family: 'Gemini',
    note: 'Pencarian semantik versi awal.'
  },
  {
    key: 'gemini-embedding-2',
    label: 'Gemini Embedding 2',
    apiModel: 'text-embedding-004',
    mode: 'embedding',
    family: 'Gemini',
    note: 'Embedding terbaru untuk akurasi tinggi.'
  },
  {
    key: 'deep-research-pro',
    label: 'Deep Research Pro Preview',
    apiModel: 'deep-research-pro',
    mode: 'other',
    family: 'Gemini',
    note: 'Agen riset mendalam untuk mencari info kompleks.'
  },

  // --- LIVE API ---
  {
    key: 'gemini-2.5-flash-audio-dialog',
    label: 'Gemini 2.5 Flash Native Audio Dialog',
    apiModel: 'gemini-2.5-flash-audio',
    mode: 'live',
    family: 'Gemini',
    note: 'Percakapan audio real-time tanpa delay.'
  },
  {
    key: 'gemini-3-flash-live',
    label: 'Gemini 3 Flash Live',
    apiModel: 'gemini-3.0-flash-live',
    mode: 'live',
    family: 'Gemini',
    note: 'Interaksi live generasi ke-3.'
  }
];

export const DEFAULT_MODEL_KEY = 'gemini-1.5-flash';

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
