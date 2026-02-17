// export default function MatchList() {
//   return <div style={{ padding: 16 }}>Match List</div>;
// }

import { Link } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function MatchList() {
  const matches = useAppStore((s) => s.matches);

  return (
    <div style={{ padding: 16 }}>
      <h2>Matches</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/new">+ New Match</Link>
      </div>

      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        <ul>
          {matches.map((m) => (
            <li key={m.id}>
              <Link to={`/match/${m.id}`}>
                {m.playerA} vs {m.playerB} — {new Date(m.createdAt).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
