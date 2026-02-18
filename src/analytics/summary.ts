import type { Event, Match, Rally, PlayerId, ShotType, PointEnd } from "../types/models";

export type MatchSummary = {
  match: Match;
  totalRallies: number;

  shotsByPlayer: Record<PlayerId, Record<ShotType, number>>;
  pointEndsByPlayer: Record<PlayerId, Record<PointEnd, number>>;

  avgShotsPerRally: number;
  longestRallyShots: number;
};

const shotTypes: ShotType[] = ["SERVE", "SMASH", "DROP", "LIFT_CLEAR", "DRIVE", "NET"];
const endTypes: PointEnd[] = ["WINNER", "FORCED_ERROR", "UNFORCED_ERROR", "OUT"];

function initNested<T extends string>(keys: T[]) {
  return keys.reduce((acc, k) => {
    acc[k] = 0;
    return acc;
  }, {} as Record<T, number>);
}

export function computeMatchSummary(match: Match, rallies: Rally[], events: Event[]): MatchSummary {
  const matchRallies = rallies.filter((r) => r.matchId === match.id);
  const matchEvents = events.filter((e) => e.matchId === match.id);

  const shotsByPlayer = {
    A: initNested(shotTypes),
    B: initNested(shotTypes),
  };

  const pointEndsByPlayer = {
    A: initNested(endTypes),
    B: initNested(endTypes),
  };

  // counts
  for (const e of matchEvents) {
    if (e.type === "SHOT" && e.shotType) shotsByPlayer[e.player][e.shotType] += 1;
    if (e.type === "POINT_END" && e.pointEnd) pointEndsByPlayer[e.player][e.pointEnd] += 1;
  }

  // rally lengths (shots only)
  const rallyShotCounts = matchRallies.map((r) => {
    const rallyEvents = matchEvents.filter((e) => e.rallyId === r.id);
    return rallyEvents.filter((e) => e.type === "SHOT").length;
  });

  const totalShots = rallyShotCounts.reduce((a, b) => a + b, 0);
  const totalRallies = matchRallies.length || 0;
  const avgShotsPerRally = totalRallies === 0 ? 0 : totalShots / totalRallies;
  const longestRallyShots = rallyShotCounts.length ? Math.max(...rallyShotCounts) : 0;

  return {
    match,
    totalRallies,
    shotsByPlayer,
    pointEndsByPlayer,
    avgShotsPerRally: Number(avgShotsPerRally.toFixed(2)),
    longestRallyShots,
  };
}
