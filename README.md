# ✨ Alya Chatbot ✨

Chatbot dengan kepribadian Indonesia yang konsisten, mampu memahami konteks dasar percakapan, merespons secara alami berbasis intent + pola + memori sederhana.

> **Tanpa LLM/AI API** - Semua pemrosesan dilakukan secara lokal menggunakan pattern matching dan template responses.

## 🎭 Kepribadian Alya

- **Sifat**: Nakal ringan, suka bercanda, agak manja
- **Suka**: Jajan, jalan-jalan, main, es krim, coklat
- **Tidak suka**: Sayur (PASTI menolak!), tidur cepat
- **Gaya bicara**: Santai, pakai "ih", "yaudah", "males ah", emoji

## 📋 Persyaratan

- **Node.js v18+** (direkomendasikan v24.14.1)
- Tidak perlu `npm install` - zero dependencies!

## 🚀 Cara Pakai

### Mode CLI (Terminal Chat)

```bash
cd alya-chatbot
node src/index.js
```

Dengan think mode aktif:
```bash
node src/index.js --think
```

### Mode Web (Browser Chat)

```bash
cd alya-chatbot
node src/web-server.js
```

Lalu buka browser: `http://localhost:3000`

## 🧠 Think Mode

Think mode menampilkan proses internal Alya saat memahami pesan:

| Command | Fungsi |
|---------|--------|
| `/think on` | Aktifkan think mode |
| `/think off` | Matikan think mode |
| `/think adaptive` | Think mode otomatis |
| `/status` | Lihat status Alya |
| `/reset` | Reset memori |
| `/help` | Bantuan |
| `/quit` | Keluar |

Contoh output think mode:
```
┌─────────────────────────────────┐
│  🧠 THINK MODE                  │
├─────────────────────────────────┤
│ 📥 [0ms] Received: "alya tidur"
│ 🎯 [1ms] Detected: perintah_tidur (confidence: 80%)
│ 💾 [1ms] History: 3 pesan
│ 🎭 [2ms] Perintah tidur diulang 1x
│ 🎭 [2ms] Pertama kali → menolak ringan
│ 😊 [2ms] senang → ngambek (agak kesel tapi ga beneran marah)
│ 💬 [3ms] Final response generated
├─────────────────────────────────┤
│ ⏱ Total: 3ms
└─────────────────────────────────┘
```

## 🏗 Arsitektur

```
┌─────────────────────────────────────────┐
│               AlyaBrain                  │
│  (Orchestrator utama)                    │
├──────────┬──────────┬──────────┬────────┤
│ Intent   │ Memory   │ Mood     │Response│
│ Engine   │ Engine   │ Engine   │Engine  │
├──────────┼──────────┼──────────┼────────┤
│ Keyword  │ History  │ Time     │Template│
│ Pattern  │ Prefs    │ Intent   │Behavior│
│ Regex    │ Context  │ Adaptive │Variety │
└──────────┴──────────┴──────────┴────────┘
         ↕              ↕
    ThinkEngine    Data (JSON)
```

### Pipeline Pemrosesan:

```
Input → Normalize → Intent Recognition → Entity Extraction
  → Memory Context → Mood Update → Behavior Rules → Response
  → Memory Save → Think Output
```

## 📁 Struktur File

```
alya-chatbot/
├── package.json          # Config project
├── README.md             # Dokumentasi
├── src/
│   ├── index.js          # Entry point CLI
│   ├── web-server.js     # Entry point Web + UI
│   ├── engine/
│   │   ├── AlyaBrain.js    # Orchestrator utama
│   │   ├── IntentEngine.js # Pengenalan intent
│   │   ├── MemoryEngine.js # Sistem memori
│   │   ├── MoodEngine.js   # Sistem mood
│   │   ├── ResponseEngine.js # Generator respons
│   │   └── ThinkEngine.js  # Think mode
│   └── data/
│       ├── personality.json # Kepribadian Alya
│       ├── intents.json     # Intent & entity
│       ├── responses.json   # Template respons
│       └── memory.json      # Memori persistent (auto-generated)
```

## 📡 REST API

### POST `/api/chat`

```json
// Request
{
  "message": "hai alya",
  "thinkMode": "enabled"  // "enabled" | "disabled" | "adaptive"
}

// Response
{
  "response": "hai juga! 😆 lagi ngapain?",
  "think": { ... },       // null jika think disabled
  "mood": { "mood": "senang", "energi": 80 },
  "intent": "sapaan",
  "confidence": 0.8,
  "entities": {}
}
```

### GET `/api/status`

Mengembalikan status Alya saat ini.

## 🎮 Contoh Interaksi

```
Kamu: hai alya
Alya: hai! aku kangen loh~ 🥺

Kamu: jalan yuk
Alya: ih ayo! kemana? aku ikut 😆

Kamu: makan sayur dulu
Alya: gaaa mau 😖 aku ga suka sayur

Kamu: alya tidur
Alya: ih males ah… tapi yaudah nanti dikit lagi ya 😴

Kamu: tidur sana!
Alya: yaudah yaudah... bentar lagi ya 😴

Kamu: ayo jajan
Alya: AYOO JAJAN!! aku mau es krim! 🍦
```

## 🔧 Kustomisasi

### Tambah Intent Baru

Edit `src/data/intents.json` → tambah entry baru di `intents`:

```json
"intent_baru": {
  "keywords": ["kata1", "kata2"],
  "patterns": ["regex_pattern"],
  "priority": 2
}
```

### Tambah Respons Baru

Edit `src/data/responses.json` → tambah entry sesuai nama intent:

```json
"intent_baru": {
  "variasi": [
    "respons 1 😆",
    "respons 2 🤭"
  ]
}
```

### Ubah Kepribadian

Edit `src/data/personality.json` untuk mengubah mood, gaya bicara, dan preferensi.

## 📝 Lisensi

MIT License - Made with ❤️ by craftkal

---

## 📡 Push Notification (Firebase)
Alya sekarang mendukung remote push notification menggunakan Capacitor + Firebase.

### Setup:
1. Buat project di [Firebase Console](https://console.firebase.google.com/).
2. Daftarkan aplikasi Android dengan package `com.craftkal.alya`.
3. Letakkan `google-services.json` ke dalam folder `android/app/`.
4. Salin **Server Key** (Legacy) dari tab Cloud Messaging di Firebase Settings.

### Admin Panel:
Akses panel rahasia untuk broadcast pesan ke semua user:
`http://localhost:3000/admin-push`
Masukkan Server Key di bagian pengaturan (tombol rahasia di bawah) untuk mengaktifkan pengiriman.
