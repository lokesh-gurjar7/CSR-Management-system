import { useState } from "react";
import axios from "axios";

export default function Register({ onRegistered }: { onRegistered: (u: any) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
      alert(res.data.message || "Registered");
      onRegistered && onRegistered(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /><br/><br/>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br/><br/>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="volunteer">Volunteer</option>
          <option value="organization">Organization</option>
        </select><br/><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
