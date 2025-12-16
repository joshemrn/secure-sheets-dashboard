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
  const [rows, setRows] = useState([]);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const token = await auth.currentUser.getIdToken(true);
      const res = await fetch(`${API_URL}?token=${token}`);
      const json = await res.json();
      setRows(json.data || []);
      setRole(json.role || "");
    };

    load();
    const i = setInterval(load, 10000);
    return () => clearInterval(i);
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        /><br /><br />
        <button
          onClick={() =>
            signInWithEmailAndPassword(auth, email, password)
          }
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Dashboard</h2>
      <p>{user.email} — {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>

      <table border="1" cellPadding="8">
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
                <td key={j}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
