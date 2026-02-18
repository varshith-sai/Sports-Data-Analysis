// export default function MatchList() {
//   return <div style={{ padding: 16 }}>Match List</div>;
// }

// import { Link } from "react-router-dom";
// import { useAppStore } from "../store/appStore";
// import { useRef } from "react";
// import { useAppStore } from "../store/appStore";


// export default function MatchList() {
//   const matches = useAppStore((s) => s.matches);

//   return (
//     <div style={{ padding: 16 }}>
//       <h2>Matches</h2>

//       <div style={{ marginBottom: 12 }}>
//         <Link to="/new">+ New Match</Link>
//       </div>

//       {matches.length === 0 ? (
//         <p>No matches yet.</p>
//       ) : (
//         <ul>
//           {matches.map((m) => (
//             <li key={m.id}>
//               <Link to={`/match/${m.id}`}>
//                 {m.playerA} vs {m.playerB} — {new Date(m.createdAt).toLocaleString()}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


import { Link } from "react-router-dom";
import { useRef } from "react";
import { useAppStore } from "../store/appStore";

export default function MatchList() {
  const matches = useAppStore((s) => s.matches);
  const importMatchBundle = useAppStore((s) => s.importMatchBundle);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // minimal validation
      if (!parsed?.match?.id || !Array.isArray(parsed?.rallies) || !Array.isArray(parsed?.events)) {
        alert("Invalid file format");
        return;
      }

      importMatchBundle({
        match: parsed.match,
        rallies: parsed.rallies,
        events: parsed.events,
      });

      alert("Import successful!");
    } catch (err) {
      console.error(err);
      alert("Failed to import JSON");
    } finally {
      // reset input so you can import same file again if needed
      e.target.value = "";
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Matches</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Link to="/new">+ New Match</Link>

        <button
          onClick={() => fileRef.current?.click()}
          style={{ padding: "6px 10px", cursor: "pointer" }}
        >
          Import JSON
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={onPickFile}
        />
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
