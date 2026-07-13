import * as fs from 'fs';
import * as path from 'path';

const reset = '\x1b[0m';
const bold = '\x1b[1m';
const dim = '\x1b[2m';

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
};

function paint(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${reset}`;
}

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
}

let logFilePath: string | undefined;

function writeToFile(line: string): void {
  if (!logFilePath) return;
  try {
    fs.appendFileSync(logFilePath, `${line}\n`, { encoding: 'utf8' });
  } catch {
    // If log file write fails, we still keep console logs working.
  }
}

function plain(message: string): string {
  return message.replace(/\x1b\[[0-9;]*m/g, '');
}

export const log = {
  init(): void {
    const logsDir = path.join(process.cwd(), 'logs');
    fs.mkdirSync(logsDir, { recursive: true });

    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fileName = `etl-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
      d.getHours()
    )}${pad(d.getMinutes())}${pad(d.getSeconds())}.log`;

    logFilePath = path.join(logsDir, fileName);
    writeToFile(`[${nowStamp()}] Log file created: ${logFilePath}`);
    console.log(`${paint('blue', '📝')} ${dim}Log file:${reset} ${paint('white', logFilePath)}`);
  },

  banner(): void {
    console.log('');
    console.log(paint('cyan', '╔══════════════════════════════════════════╗'));
    console.log(paint('cyan', '║') + bold + paint('white', '   Pattex Azure → MongoDB ETL Pipeline   ') + reset + paint('cyan', '║'));
    console.log(paint('cyan', '╚══════════════════════════════════════════╝'));
    console.log('');
    writeToFile(`[${nowStamp()}] Pattex Azure → MongoDB ETL Pipeline`);
  },

  start(message: string): void {
    const msg = `${paint('blue', '🚀')} ${bold}${message}${reset}`;
    console.log(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  connected(message: string): void {
    const msg = `${paint('green', '🔌')} ${paint('green', message)}`;
    console.log(msg);
    console.log('');
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  processing(file: string, collection: string): void {
    const msg = `${paint('cyan', '🔄')} ${bold}Processing${reset} ${paint('white', file)} ${dim}→${reset} ${paint('magenta', `[${collection}]`)}`;
    console.log(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  success(collection: string, count: number): void {
    const msg = `${paint('green', '✅')} ${paint('green', `Uploaded ${count.toLocaleString()} docs`)} ${dim}→${reset} ${paint('magenta', collection)}`;
    console.log(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  warn(message: string): void {
    const msg = `${paint('yellow', '⚠️')}  ${paint('yellow', message)}`;
    console.warn(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  warnItem(item: string): void {
    const msg = `${paint('yellow', '   └─')} ${paint('yellow', item)}`;
    console.warn(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  error(message: string): void {
    const msg = `${paint('red', '❌')} ${paint('red', message)}`;
    console.error(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  errorItem(item: string): void {
    const msg = `${paint('red', '   └─')} ${paint('red', item)}`;
    console.error(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  info(message: string): void {
    const msg = `${paint('blue', 'ℹ️')}  ${message}`;
    console.log(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  notFound(path: string): void {
    const msg = `${paint('yellow', '📭')} ${paint('yellow', 'File not found:')} ${dim}${path}${reset}`;
    console.warn(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  closed(message: string): void {
    const msg = `${paint('blue', '🔒')} ${dim}${message}${reset}`;
    console.log(msg);
    writeToFile(`[${nowStamp()}] ${plain(msg)}`);
  },

  summary(title: string, processed: number, failed: number, skipped: number): void {
    console.log('');
    console.log(paint('green', '╔══════════════════════════════════════════╗'));
    const trimmed = title.length > 30 ? `${title.slice(0, 27)}...` : title;
    const paddedTitle = `   ${trimmed}`.padEnd(34, ' ');
    console.log(paint('green', '║') + bold + paint('white', paddedTitle) + reset + paint('green', '║'));
    console.log(paint('green', '╠══════════════════════════════════════════╣'));
    console.log(paint('green', '║') + `  ${paint('green', '✓')} Uploaded : ${bold}${processed}${reset}                     ` + paint('green', '║'));
    console.log(paint('green', '║') + `  ${paint('red', '✗')} Failed   : ${bold}${failed}${reset}                     ` + paint('green', '║'));
    console.log(paint('green', '║') + `  ${paint('yellow', '○')} Skipped  : ${bold}${skipped}${reset}                     ` + paint('green', '║'));
    console.log(paint('green', '╚══════════════════════════════════════════╝'));
    console.log('');
    writeToFile(`[${nowStamp()}] ${title}: uploaded=${processed}, failed=${failed}, skipped=${skipped}`);
  },

  complete(processed: number, failed: number, skipped: number): void {
    log.summary('✨ ETL Complete', processed, failed, skipped);
  },
};

export type ProcessResult = 'success' | 'failed' | 'skipped';
