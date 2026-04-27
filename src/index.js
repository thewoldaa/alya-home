/**
 * Alya Chatbot - CLI Interactive Mode
 * 
 * Jalankan dengan: node src/index.js
 * 
 * Fitur:
 * - Chat interaktif di terminal
 * - Think mode (on/off/adaptive)
 * - Memori percakapan
 * - Mood system
 * - Personality konsisten
 */

import { createInterface } from 'readline';
import { AlyaBrain } from './engine/AlyaBrain.js';
import { ThinkEngine } from './engine/ThinkEngine.js';

// ═══════════════════════════════════════════
//  ALYA CHATBOT - CLI Entry Point
// ═══════════════════════════════════════════

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

function printBanner() {
  console.log(`
${COLORS.magenta}${COLORS.bright}
   ╔═══════════════════════════════════════╗
   ║                                       ║
   ║     ✨  A L Y A  C H A T B O T  ✨   ║
   ║                                       ║
   ║   Chatbot dengan kepribadian unik     ║
   ║   Bahasa Indonesia santai             ║
   ║                                       ║
   ╚═══════════════════════════════════════╝
${COLORS.reset}
${COLORS.gray}  Ketik /help untuk melihat perintah${COLORS.reset}
${COLORS.gray}  Ketik /think on untuk aktifkan think mode${COLORS.reset}
${COLORS.gray}  Ketik /quit untuk keluar${COLORS.reset}
`);
}

function printThinking(thinkResult) {
  if (!thinkResult) return;
  console.log(COLORS.dim + ThinkEngine.formatForDisplay(thinkResult) + COLORS.reset);
}

function printMoodBar(moodInfo) {
  const moodEmojis = {
    'senang': '😆',
    'malas': '😴',
    'manja': '🥺',
    'ngambek': '😤',
    'antusias': '🎉',
    'ngantuk': '💤'
  };
  const emoji = moodEmojis[moodInfo.mood] || '🤭';
  return `${COLORS.gray}[${emoji} ${moodInfo.mood}]${COLORS.reset}`;
}

async function main() {
  printBanner();

  // Check for CLI arguments
  const args = process.argv.slice(2);
  let thinkMode = 'disabled';
  
  for (const arg of args) {
    if (arg === '--think' || arg === '-t') {
      thinkMode = 'enabled';
    }
    if (arg === '--think-adaptive' || arg === '-ta') {
      thinkMode = 'adaptive';
    }
  }

  const brain = new AlyaBrain({ thinkMode });
  
  if (thinkMode !== 'disabled') {
    console.log(`${COLORS.yellow}🧠 Think mode: ${thinkMode.toUpperCase()}${COLORS.reset}\n`);
  }

  // Greeting
  const greeting = brain.processMessage('hai');
  console.log(`${COLORS.magenta}${COLORS.bright}Alya:${COLORS.reset} ${greeting.response}`);
  console.log();

  // Setup readline
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${COLORS.cyan}Kamu: ${COLORS.reset}`,
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    
    if (!input) {
      rl.prompt();
      return;
    }

    // Quit command
    if (input.toLowerCase() === '/quit' || input.toLowerCase() === '/exit') {
      console.log(`\n${COLORS.magenta}${COLORS.bright}Alya:${COLORS.reset} dadah~ nanti ngobrol lagi ya! 🥺✨\n`);
      rl.close();
      process.exit(0);
    }

    // Process message
    const result = brain.processMessage(input);
    
    console.log();

    // Show thinking if enabled
    if (result.think) {
      printThinking(result.think);
    }

    // Show Alya's response
    const moodBar = printMoodBar(result.mood);
    console.log(`${COLORS.magenta}${COLORS.bright}Alya${COLORS.reset} ${moodBar}: ${result.response}`);
    
    // Show debug info in dim
    if (result.intent !== 'command') {
      console.log(`${COLORS.dim}  [intent: ${result.intent} | confidence: ${((result.confidence || 0) * 100).toFixed(0)}%]${COLORS.reset}`);
    }
    
    console.log();
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(`\n${COLORS.magenta}bye bye~ 🥺${COLORS.reset}\n`);
    process.exit(0);
  });
}

main().catch(console.error);
