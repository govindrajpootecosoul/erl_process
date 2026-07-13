export type DateFormat =
  | 'M/D/YYYY'
  | 'MM/DD/YYYY'
  | 'YYYY-MM-DD'
  | 'YYYY-MM'
  | 'YYYY-M'
  | 'MMM-YY'
  | 'MMM-YYYY'
  | 'DD-MMM-YY'
  | 'DD-MMM-YYYY';

const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function parseMonth(token: string): number | undefined {
  const lower = token.toLowerCase();
  if (MONTHS[lower] !== undefined) return MONTHS[lower];
  return MONTHS[lower.slice(0, 3)];
}

function isValidYMD(y: number, m: number, d: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function isValidYM(y: number, m: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(m)) return false;
  if (y < 1900 || y > 2100) return false;
  return m >= 1 && m <= 12;
}

export function validateDateValue(raw: unknown, formats: readonly DateFormat[]) {
  const value = String(raw ?? '').trim();
  if (!value) return { ok: true as const };

  for (const fmt of formats) {
    if (fmt === 'YYYY-MM-DD') {
      const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) continue;
      const yyyy = Number(m[1]);
      const mm = Number(m[2]);
      const dd = Number(m[3]);
      if (isValidYMD(yyyy, mm, dd)) return { ok: true as const };
    }

    if (fmt === 'M/D/YYYY' || fmt === 'MM/DD/YYYY') {
      const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) continue;
      const mm = Number(m[1]);
      const dd = Number(m[2]);
      const yyyy = Number(m[3]);
      if (isValidYMD(yyyy, mm, dd)) return { ok: true as const };
    }

    if (fmt === 'YYYY-MM' || fmt === 'YYYY-M') {
      const m = value.match(/^(\d{4})-(\d{1,2})$/);
      if (!m) continue;
      const yyyy = Number(m[1]);
      const mm = Number(m[2]);
      if (isValidYM(yyyy, mm)) return { ok: true as const };
    }

    if (fmt === 'MMM-YY') {
      const m = value.match(/^([A-Za-z]+)-(\d{2})$/);
      if (!m) continue;
      const mon = parseMonth(m[1]);
      if (!mon) continue;
      const yy = Number(m[2]);
      const yyyy = yy >= 70 ? 1900 + yy : 2000 + yy;
      if (isValidYM(yyyy, mon)) return { ok: true as const };
    }

    if (fmt === 'MMM-YYYY') {
      const m = value.match(/^([A-Za-z]+)-(\d{4})$/);
      if (!m) continue;
      const mon = parseMonth(m[1]);
      if (!mon) continue;
      const yyyy = Number(m[2]);
      if (isValidYM(yyyy, mon)) return { ok: true as const };
    }

    if (fmt === 'DD-MMM-YY' || fmt === 'DD-MMM-YYYY') {
      const m = value.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2}|\d{4})$/);
      if (!m) continue;
      const dd = Number(m[1]);
      const mon = parseMonth(m[2]);
      if (!mon) continue;
      const yStr = m[3];
      const yyyy =
        yStr.length === 2 ? (Number(yStr) >= 70 ? 1900 + Number(yStr) : 2000 + Number(yStr)) : Number(yStr);
      if (isValidYMD(yyyy, mon, dd)) return { ok: true as const };
    }
  }

  return {
    ok: false as const,
    expected: formats.join(', '),
  };
}

export function makeRowFingerprint(row: Record<string, string>, columns: readonly string[]): string {
  const sep = '\u0001';
  let out = '';
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const v = row[col] ?? '';
    out += v;
    out += sep;
  }
  return out;
}
