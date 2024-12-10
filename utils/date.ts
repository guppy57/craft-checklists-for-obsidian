import { moment } from 'obsidian';

export function formatDate(date: Date, format: string): string {
  return moment(date).format(format);
}

export function parseDate(dateString: string, format: string): Date | null {
  const parsed = moment(dateString, format);
  return parsed.isValid() ? parsed.toDate() : null;
}