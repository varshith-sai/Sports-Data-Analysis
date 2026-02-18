import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useAppStore } from "../store/appStore";
import { computeMatchSummary } from "../analytics/summary";

const SHOT_TYPES = ["SERVE", "SMASH", "DROP", "LIFT_CLEAR", "DRIVE", "NET"] as const;
const END_TYPES = ["WINNER", "FORCED_ERROR", "UNFORCED_ERROR", "OUT"] as const;


export default function MatchSummary() {
  const { matchId } = useParams();
  const matches = useAppStore((s) => s.matches);
  const rallies = useAppStore((s) => s.rallies);
  const events = useAppStore((s) => s.events);

  const match = matches.find((m) => m.id === matchId);

  const summary = useMemo(() => {
    if (!match) return null;
    return computeMatchSummary(match, rallies, events);
  }, [match, rallies, events]);

  if (!matchId) return <div style={{ padding: 16 }}>Missing matchId</div>;
  if (!match || !summary) {
    return (
      <div style={{ padding: 16 }}>
        <p>Match not found.</p>
        <Link to="/">Back</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>
            Summary: {summary.match.playerA} vs {summary.match.playerB}
          </h2>
          <p style={{ marginTop: 6 }}>
            Total rallies: <b>{summary.totalRallies}</b> | Avg shots/rally:{" "}
            <b>{summary.avgShotsPerRally}</b> | Longest rally (shots):{" "}
            <b>{summary.longestRallyShots}</b>
          </p>
        </div>
        <Link to={`/match/${matchId}`}>← Back to Tagging</Link>
      </div>

      <h3>Shots by Player</h3>
      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Shot</th>
            <th>A</th>
            <th>B</th>
          </tr>
        </thead>
        <tbody>
            {SHOT_TYPES.map((shot) => (
                <tr key={shot}>
                <td>{shot}</td>
                <td>{summary.shotsByPlayer.A[shot]}</td>
                <td>{summary.shotsByPlayer.B[shot]}</td>
                </tr>
            ))}
        </tbody>

      </table>

      <h3 style={{ marginTop: 18 }}>Point Ends by Player</h3>
      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>End Type</th>
            <th>A</th>
            <th>B</th>
          </tr>
        </thead>
        <tbody>
            {END_TYPES.map((end) => (
                <tr key={end}>
                <td>{end}</td>
                <td>{summary.pointEndsByPlayer.A[end]}</td>
                <td>{summary.pointEndsByPlayer.B[end]}</td>
                </tr>
            ))}
        </tbody>

      </table>
    </div>
  );
}
