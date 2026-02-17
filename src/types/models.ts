export type PlayerId = "A" | "B";

export type ShotType =
  | "SERVE"
  | "SMASH"
  | "DROP"
  | "LIFT_CLEAR"
  | "DRIVE"
  | "NET";

export type PointEnd =
  | "WINNER"
  | "FORCED_ERROR"
  | "UNFORCED_ERROR"
  | "OUT";

export type EventType = "SHOT" | "POINT_END";

export type Match = {
  id: string;
  createdAt: string; // ISO string
  playerA: string;
  playerB: string;
};

export type Rally = {
  id: string;
  matchId: string;
  rallyNumber: number; // 1,2,3...
};

export type Event = {
  id: string;
  matchId: string;
  rallyId: string;
  seq: number; // 1,2,3... within a rally
  player: PlayerId;
  type: EventType;
  shotType?: ShotType;     // when type === "SHOT"
  pointEnd?: PointEnd;     // when type === "POINT_END"
  createdAt: string;       // ISO string
  source: "MANUAL" | "AI";
};
