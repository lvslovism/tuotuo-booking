/** Format date in Taiwan timezone (UTC+8) */
export function toTaiwanDate(date: Date): string {
  return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' }); // YYYY-MM-DD
}

export function toTaiwanMonth(date: Date): string {
  return toTaiwanDate(date).slice(0, 7); // YYYY-MM
}

export function getTodayTaiwan(): string {
  return toTaiwanDate(new Date());
}

export function formatTime(timeStr: string): string {
  // HH:mm:ss → HH:mm
  return timeStr.slice(0, 5);
}

export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+08:00');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = weekdays[d.getDay()];
  return `${m}/${day}（${w}）`;
}
