import type { Match, Rally, Event } from "../types/models";

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export function buildMatchExport(match: Match, rallies: Rally[], events: Event[]) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    match,
    rallies,
    events,
  };
}
