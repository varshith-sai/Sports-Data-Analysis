// export default function MatchTagging() {
//   return <div style={{ padding: 16 }}>Live Tagging</div>;
// }


import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import type { PlayerId, ShotType, PointEnd } from "../types/models";
import { buildMatchExport, downloadJson } from "../utils/exportMatch";




const SHOTS: { key: ShotType; label: string }[] = [
  { key: "SERVE", label: "Serve" },
  { key: "SMASH", label: "Smash" },
  { key: "DROP", label: "Drop" },
  { key: "LIFT_CLEAR", label: "Lift/Clear" },
  { key: "DRIVE", label: "Drive" },
  { key: "NET", label: "Net" },
];

const ENDS: { key: PointEnd; label: string }[] = [
  { key: "WINNER", label: "Winner" },
  { key: "FORCED_ERROR", label: "Forced Err" },
  { key: "UNFORCED_ERROR", label: "Unforced Err" },
  { key: "OUT", label: "Out" },
];

export default function MatchTagging() {
  const { matchId } = useParams();
  const matches = useAppStore((s) => s.matches);
  const rallies = useAppStore((s) => s.rallies);
  const events = useAppStore((s) => s.events);
  const activePlayer = useAppStore((s) => s.activePlayer);

  const setActivePlayer = useAppStore((s) => s.setActivePlayer);
  const addShot = useAppStore((s) => s.addShot);
  const endPoint = useAppStore((s) => s.endPoint);
  const undoLastEvent = useAppStore((s) => s.undoLastEvent);

  const match = matches.find((m) => m.id === matchId);


  const matchRallies = useMemo(
  () => rallies.filter((r) => r.matchId === matchId),
  [rallies, matchId]
  );

  const matchEvents = useMemo(
  () => events.filter((e) => e.matchId === matchId),
  [events, matchId]
  );



  const currentRally = useMemo(() => {
    if (!matchId) return undefined;
    const rs = rallies.filter((r) => r.matchId === matchId);
    return rs.length ? rs[rs.length - 1] : undefined; // latest rally
  }, [rallies, matchId]);

  const rallyEvents = useMemo(() => {
    if (!currentRally) return [];
    return events
      .filter((e) => e.rallyId === currentRally.id)
      .sort((a, b) => a.seq - b.seq);
  }, [events, currentRally]);

  if (!matchId) return <div style={{ padding: 16 }}>Missing matchId</div>;
  if (!match) {
    return (
      <div style={{ padding: 16 }}>
        <p>Match not found.</p>
        <Link to="/">Back</Link>
      </div>
    );
  }
  if (!currentRally) {
    return (
      <div style={{ padding: 16 }}>
        <p>No rally found. Create a new match again.</p>
        <Link to="/">Back</Link>
      </div>
    );
  }

  function togglePlayer(p: PlayerId) {
    setActivePlayer(p);
  }

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>
            {match.playerA} vs {match.playerB}
          </h2>
          <p style={{ marginTop: 6 }}>
            Rally: <b>{currentRally.rallyNumber}</b>
          </p>
        </div>
        <Link to="/">← Matches</Link>
        <Link to={`/match/${matchId}/summary`}>Summary</Link>

      </div>


      {/* Player Toggle */}
      <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
        <button
          onClick={() => togglePlayer("A")}
          style={{
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: activePlayer === "A" ? "bold" : "normal",
          }}
        >
          {match.playerA} (A)
        </button>
        <button
          onClick={() => togglePlayer("B")}
          style={{
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: activePlayer === "B" ? "bold" : "normal",
          }}
        >
          {match.playerB} (B)
        </button>

        <button
          onClick={() => undoLastEvent(matchId, currentRally.id)}
          style={{ padding: "10px 14px", cursor: "pointer", marginLeft: "auto" }}
        >
          Undo
        </button>
      </div>

      {/* Shot Buttons */}
      <h3>Shots</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {SHOTS.map((s) => (
          <button
            key={s.key}
            onClick={() => addShot(matchId, currentRally.id, s.key)}
            style={{ padding: 14, cursor: "pointer" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Point End Buttons */}
      <h3 style={{ marginTop: 18 }}>Point End</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {ENDS.map((e) => (
          <button
            key={e.key}
            onClick={() => endPoint(matchId, currentRally.id, e.key)}
            style={{ padding: 14, cursor: "pointer" }}
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <h3 style={{ marginTop: 18 }}>Rally Timeline</h3>
      {rallyEvents.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ol>
          {rallyEvents.map((e) => (
            <li key={e.id}>
              <b>{e.player}</b>{" "}
              {e.type === "SHOT" ? e.shotType : `POINT END: ${e.pointEnd}`}
            </li>
          ))}
        </ol>
      )}

      <button
        onClick={() => {
          const payload = buildMatchExport(match, matchRallies, matchEvents);
          downloadJson(`${match.playerA}-vs-${match.playerB}-${match.id}.json`, payload);
          }}
        style={{ padding: "8px 12px", cursor: "pointer" }}
      >
        Export JSON
      </button>
    </div>
  );
}
