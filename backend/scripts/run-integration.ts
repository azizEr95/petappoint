import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

function runCommand(command: string) {
  try {
    execSync(command, { stdio: 'inherit', shell: true } as any);
  } catch (error) {
    console.error(`❌ Fehler beim Ausführen von: ${command}`);
    process.exit(1);
  }
}

async function start() {
  console.log('🚀 Starte Integration-Test-Umgebung...');

  // 2. Umgebungsvariablen laden 
  // (sucht nach einer .env Datei im aktuellen Verzeichnis)
  dotenv.config();

  // 3. Docker Compose
  console.log('📦 Starte Docker...');
  runCommand('docker-compose up -d');

  // 4. Prisma Migration
  console.log('🟡 Warte auf Datenbank & führe Migrations aus...');
  //runCommand('npx prisma migrate reset --force --skip-seed');

  console.log('🟢 Datenbank bereit!');

  // 5. Vitest Modus bestimmen
  const isUiMode = process.argv.includes('--ui');
  const vitestCmd = isUiMode 
    ? 'npx vitest -c ./vitest.config.integration.ts --ui' 
    : 'npx vitest -c ./vitest.config.integration.ts';

  runCommand(vitestCmd);
}

start();