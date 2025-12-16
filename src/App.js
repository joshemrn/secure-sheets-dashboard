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
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  const fetchData = async () => {
    try {
      setError("");
      const token = await auth.currentUser.getIdToken(true);

      const res = await fetch(`${API_URL}?token=${token}`, {
        method: "GET",
        redirect: "follow"
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setRole(data.role);
      setRows(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
    const i = setInterval(fetchData, 10000);
    return () => clearInterval(i);
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Secure Sheets Dashboard</h2>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <br /><br />
        <button
          onClick={() => signInWithEmailAndPassword(auth, email, password)}
        >
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

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          Error: {error}
        </p>
      )}

      <table border="1" cellPadding="6" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            {rows[0] &&
              Object.keys(rows[0]).map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {Object.values(r).map((v, j) => (
                <td key={j}>{String(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
