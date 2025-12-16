import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxr-27n38VhLa782d_z5xJoU0bYNoUprcnfyuTCfo3iWjsiyqVYOH1SNxQRq8nMQAk/exec";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [rows, setRows] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  async function loadData() {
    try {
      const token = await auth.currentUser.getIdToken(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const json = await res.json();

      if (json.error) throw new Error(json.error);

      setRole(json.role);
      setRows(json.data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <br /><br />
        <button onClick={() => signInWithEmailAndPassword(auth, email, password)}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Secure Sheets Dashboard</h2>
      <p>{user.email} — {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            {rows[0] && Object.keys(rows[0]).map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {Object.values(r).map((v, j) => <td key={j}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
