import React from "react";

export default function Dashboard({ user }: { user: any }) {
  return (
    <div style={{ padding: 24, fontFamily: "Inter, Arial, sans-serif" }}>
      <h1>Welcome, {user?.name || "User"} </h1>
      <p style={{ color: "#666" }}>Role: <strong>{user?.role || "N/A"}</strong></p>

      <section style={{ marginTop: 18 }}>
        <h3>Sample Projects</h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", maxWidth: 900 }}>
          <div style={{ padding: 12, borderRadius: 8, border: "1px solid #eee" }}>
            <strong>Clean Water Project</strong>
            <p style={{ margin: 6 }}>Organization: ABC Trust</p>
          </div>
          <div style={{ padding: 12, borderRadius: 8, border: "1px solid #eee" }}>
            <strong>Tree Plantation Drive</strong>
            <p style={{ margin: 6 }}>Organization: GreenOrg</p>
          </div>
        </div>
      </section>
    </div>
  );
}
