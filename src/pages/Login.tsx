import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }: { setUser: (u: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { user } = res.data;
      // store token if needed: localStorage.setItem('token', token)
      setUser(user);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

