export function csvCell(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return '""';

  let text = value instanceof Date ? value.toISOString() : String(value);
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: Array<Array<string | number | Date | null | undefined>>): string {
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}
