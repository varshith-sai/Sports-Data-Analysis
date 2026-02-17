import { create } from "zustand";
import type { Match, Rally, Event, PlayerId, ShotType, PointEnd } from "../types/models";

function uuid() {
  return crypto.randomUUID();
}

type AppState = {
  matches: Match[];
  rallies: Rally[];
  events: Event[];

  // UI state
  activePlayer: PlayerId;

  // actions
  createMatch: (playerA: string, playerB: string) => string; // returns matchId
  startRally: (matchId: string) => string; // returns rallyId
  setActivePlayer: (p: PlayerId) => void;

  addShot: (matchId: string, rallyId: string, shotType: ShotType) => void;
  endPoint: (matchId: string, rallyId: string, end: PointEnd) => void;
  undoLastEvent: (matchId: string, rallyId: string) => void;

  getCurrentRallySeq: (rallyId: string) => number;
};

export const useAppStore = create<AppState>((set, get) => ({
  matches: [],
  rallies: [],
  events: [],
  activePlayer: "A",

  createMatch: (playerA, playerB) => {
    const matchId = uuid();
    const match: Match = {
      id: matchId,
      createdAt: new Date().toISOString(),
      playerA: playerA.trim() || "Player A",
      playerB: playerB.trim() || "Player B",
    };
    set((s) => ({ matches: [match, ...s.matches] }));
    return matchId;
  },

  startRally: (matchId) => {
    const rallyId = uuid();
    const nextNumber =
      Math.max(
        0,
        ...get()
          .rallies.filter((r) => r.matchId === matchId)
          .map((r) => r.rallyNumber)
      ) + 1;

    const rally: Rally = { id: rallyId, matchId, rallyNumber: nextNumber };
    set((s) => ({ rallies: [...s.rallies, rally] }));
    return rallyId;
  },

  setActivePlayer: (p) => set({ activePlayer: p }),

  getCurrentRallySeq: (rallyId) => {
    const events = get().events.filter((e) => e.rallyId === rallyId);
    return events.length === 0 ? 0 : Math.max(...events.map((e) => e.seq));
  },

  addShot: (matchId, rallyId, shotType) => {
    const seq = get().getCurrentRallySeq(rallyId) + 1;
    const e: Event = {
      id: uuid(),
      matchId,
      rallyId,
      seq,
      player: get().activePlayer,
      type: "SHOT",
      shotType,
      createdAt: new Date().toISOString(),
      source: "MANUAL",
    };
    set((s) => ({ events: [...s.events, e] }));
  },

//   endPoint: (matchId, rallyId, end) => {
//     const seq = get().getCurrentRallySeq(rallyId) + 1;
//     const e: Event = {
//       id: uuid(),
//       matchId,
//       rallyId,
//       seq,
//       player: get().activePlayer,
//       type: "POINT_END",
//       pointEnd: end,
//       createdAt: new Date().toISOString(),
//       source: "MANUAL",
//     };
//     set((s) => ({ events: [...s.events, e] }));
//   },


endPoint: (matchId, rallyId, end) => {
  const seq = get().getCurrentRallySeq(rallyId) + 1;

  const e: Event = {
    id: uuid(),
    matchId,
    rallyId,
    seq,
    player: get().activePlayer,
    type: "POINT_END",
    pointEnd: end,
    createdAt: new Date().toISOString(),
    source: "MANUAL",
  };

  set((s) => ({ events: [...s.events, e] }));

  // automatically start next rally
  get().startRally(matchId);
},


  undoLastEvent: (_matchId, rallyId) => {
    const events = get().events;
    const rallyEvents = events.filter((e) => e.rallyId === rallyId);
    if (rallyEvents.length === 0) return;

    const lastSeq = Math.max(...rallyEvents.map((e) => e.seq));
    const lastEvent = rallyEvents.find((e) => e.seq === lastSeq);
    if (!lastEvent) return;

    set((s) => ({ events: s.events.filter((e) => e.id !== lastEvent.id) }));
  },
}));
