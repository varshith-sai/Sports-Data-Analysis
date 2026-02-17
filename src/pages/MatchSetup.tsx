// export default function MatchSetup() {
//   return <div style={{ padding: 16 }}>Match Setup</div>;
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function MatchSetup() {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const createMatch = useAppStore((s) => s.createMatch);
  const startRally = useAppStore((s) => s.startRally);
  const navigate = useNavigate();

  function onStart() {
    const matchId = createMatch(playerA, playerB);
    startRally(matchId); // create Rally 1
    navigate(`/match/${matchId}`);
  }

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h2>New Match</h2>

      <div style={{ display: "grid", gap: 8 }}>
        <label>
          Player A
          <input
            value={playerA}
            onChange={(e) => setPlayerA(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="Player A"
          />
        </label>

        <label>
          Player B
          <input
            value={playerB}
            onChange={(e) => setPlayerB(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="Player B"
          />
        </label>

        <button onClick={onStart} style={{ padding: 10, cursor: "pointer" }}>
          Start Match
        </button>
      </div>
    </div>
  );
}
