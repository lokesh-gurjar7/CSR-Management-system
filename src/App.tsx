import React, { useEffect, useState, type JSX } from "react";

// SocialWave - Single-file React + TypeScript app
// Drop this file into src/App.tsx of a Vite + React + TypeScript project using Tailwind CSS.
// Features:
// - Simple login (username: admin, password: admin)
// - CRUD for Projects and Volunteers
// - Data persisted to localStorage
// - Single-file, no backend required (good for demos / presentation)

// -----------------------------
// Types
// -----------------------------
interface User {
  username: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

interface Volunteer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  assignedProjectId?: string | null;
}

// -----------------------------
// Helpers
// -----------------------------
const makeId = (prefix = "id") => `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

const STORAGE_KEYS = {
  USER: "socialwave_user",
  PROJECTS: "socialwave_projects",
  VOLUNTEERS: "socialwave_volunteers",
};

// -----------------------------
// Seed data (first-run)
// -----------------------------
const seedProjects: Project[] = [
  {
    id: makeId("proj"),
    title: "Tree Plantation Drive",
    description: "Plant 200 trees in community park.",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
  },
  {
    id: makeId("proj"),
    title: "Clean Water Initiative",
    description: "Provide water filters to 50 households.",
    startDate: "2025-03-01",
  },
];

const seedVolunteers: Volunteer[] = [
  { id: makeId("vol"), name: "Asha Kumar", email: "asha@example.com", phone: "+91-9000000001", assignedProjectId: null },
  { id: makeId("vol"), name: "Ravi Sharma", email: "ravi@example.com", phone: "+91-9000000002", assignedProjectId: null },
];

// -----------------------------
// Main App
// -----------------------------
export default function SocialWaveApp(): JSX.Element {
  // Auth
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : seedProjects;
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    return raw ? JSON.parse(raw) : seedVolunteers;
  });

  const [route, setRoute] = useState<"projects" | "volunteers">("projects");

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user]);

  // -----------------------------
  // Auth functions
  // -----------------------------
  const login = (username: string, password: string) => {
    // Demo credentials: admin / admin
    if (username === "admin" && password === "admin") {
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // -----------------------------
  // Project CRUD
  // -----------------------------
  const createProject = (p: Omit<Project, "id">) => {
    const newP: Project = { ...p, id: makeId("proj") };
    setProjects((s) => [newP, ...s]);
    return newP;
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deleteProject = (id: string) => {
    // unassign volunteers assigned to this project
    setVolunteers((v) => v.map((vol) => (vol.assignedProjectId === id ? { ...vol, assignedProjectId: null } : vol)));
    setProjects((s) => s.filter((p) => p.id !== id));
  };

  // -----------------------------
  // Volunteer CRUD
  // -----------------------------
  const createVolunteer = (v: Omit<Volunteer, "id">) => {
    const newV: Volunteer = { ...v, id: makeId("vol") };
    setVolunteers((s) => [newV, ...s]);
    return newV;
  };

  const updateVolunteer = (id: string, patch: Partial<Volunteer>) => {
    setVolunteers((s) => s.map((vol) => (vol.id === id ? { ...vol, ...patch } : vol)));
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers((s) => s.filter((vol) => vol.id !== id));
  };

  // -----------------------------
  // UI pieces
  // -----------------------------
  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">SocialWave · CSR Management</h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <button
                className={`px-3 py-1 rounded ${route === "projects" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                onClick={() => setRoute("projects")}
              >
                Projects
              </button>
              <button
                className={`px-3 py-1 rounded ${route === "volunteers" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                onClick={() => setRoute("volunteers")}
              >
                Volunteers
              </button>
            </nav>
            <div className="text-sm text-gray-700">Signed in as <strong>{user.username}</strong></div>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main>
          {route === "projects" ? (
            <ProjectsView
              projects={projects}
              volunteers={volunteers}
              onCreate={createProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
            />
          ) : (
            <VolunteersView
              volunteers={volunteers}
              projects={projects}
              onCreate={createVolunteer}
              onUpdate={updateVolunteer}
              onDelete={deleteVolunteer}
            />
          )}
        </main>

        <footer className="mt-8 text-xs text-gray-500">
          Demo app — data saved to localStorage. Use <code>admin/admin</code> to login.
        </footer>
      </div>
    </div>
  );
}

// -----------------------------
// Login Component
// -----------------------------
function Login({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onLogin(username.trim(), password)) {
      setError(null);
    } else setError("Invalid credentials — use admin / admin for demo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">SocialWave — Sign in</h2>
        <label className="block mb-2 text-sm">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2 text-sm">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded mb-3" />
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <div className="flex items-center justify-between">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
          <div className="text-xs text-gray-500">Demo: <strong>admin</strong> / <strong>admin</strong></div>
        </div>
      </form>
    </div>
  );
}

// -----------------------------
// Projects View
// -----------------------------
function ProjectsView({
  projects,
  volunteers,
  onCreate,
  onUpdate,
  onDelete,
}: {
  projects: Project[];
  volunteers: Volunteer[];
  onCreate: (p: Omit<Project, "id">) => Project;
  onUpdate: (id: string, patch: Partial<Project>) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Omit<Project, "id">>({ title: "", description: "", startDate: "", endDate: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, startDate: p.startDate || "", endDate: p.endDate || "" });
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.title.trim()) return alert("Title required");
    if (editingId) {
      onUpdate(editingId, { ...form });
      setEditingId(null);
    } else {
      onCreate(form);
    }
    setForm({ title: "", description: "", startDate: "", endDate: "" });
  };

  return (
    <section>
      <div className="mb-6 flex gap-6">
        <form onSubmit={submit} className="bg-white p-4 rounded shadow w-full max-w-xl">
          <h3 className="font-semibold mb-3">{editingId ? "Edit Project" : "Create Project"}</h3>
          <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Title" className="w-full p-2 border rounded mb-2" />
          <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Short description" className="w-full p-2 border rounded mb-2" />
          <div className="flex gap-2">
            <input value={form.startDate} onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))} type="date" className="p-2 border rounded" />
            <input value={form.endDate} onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))} type="date" className="p-2 border rounded" />
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">{editingId ? "Save" : "Create"}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", description: "", startDate: "", endDate: "" }); }} className="px-3 py-1 border rounded">Cancel</button>
            )}
          </div>
        </form>

        <div className="flex-1">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Projects ({projects.length})</h3>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{p.title}</div>
                      <div className="text-sm text-gray-600">{p.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{p.startDate || "-"} → {p.endDate || "-"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="px-2 py-1 border rounded">Edit</button>
                      <button onClick={() => { if (confirm("Delete project? This will unassign volunteers.")) onDelete(p.id); }} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <div className="text-gray-500">No projects yet.</div>}
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Project - Volunteers mapping</h4>
            {projects.map((p) => {
              const assigned = volunteers.filter((v) => v.assignedProjectId === p.id);
              return (
                <div key={p.id} className="mb-2">
                  <div className="font-medium">{p.title} <span className="text-xs text-gray-500">({assigned.length})</span></div>
                  <div className="text-sm text-gray-600">{assigned.map((a) => a.name).join(", ") || "— none —"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------
// Volunteers View
// -----------------------------
function VolunteersView({
  volunteers,
  projects,
  onCreate,
  onUpdate,
  onDelete,
}: {
  volunteers: Volunteer[];
  projects: Project[];
  onCreate: (v: Omit<Volunteer, "id">) => Volunteer;
  onUpdate: (id: string, patch: Partial<Volunteer>) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Omit<Volunteer, "id">>({ name: "", email: "", phone: "", assignedProjectId: null });
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (v: Volunteer) => {
    setEditingId(v.id);
    setForm({ name: v.name, email: v.email || "", phone: v.phone || "", assignedProjectId: v.assignedProjectId || null });
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name.trim()) return alert("Name required");
    if (editingId) {
      onUpdate(editingId, { ...form });
      setEditingId(null);
    } else {
      onCreate(form);
    }
    setForm({ name: "", email: "", phone: "", assignedProjectId: null });
  };

  return (
    <section>
      <div className="mb-6 flex gap-6">
        <form onSubmit={submit} className="bg-white p-4 rounded shadow w-full max-w-md">
          <h3 className="font-semibold mb-3">{editingId ? "Edit Volunteer" : "Add Volunteer"}</h3>
          <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Full name" className="w-full p-2 border rounded mb-2" />
          <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="w-full p-2 border rounded mb-2" />
          <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="w-full p-2 border rounded mb-2" />

          <label className="block text-sm mb-2">Assign to project (optional)</label>
          <select value={form.assignedProjectId || ""} onChange={(e) => setForm((s) => ({ ...s, assignedProjectId: e.target.value || null }))} className="w-full p-2 border rounded mb-3">
            <option value="">— none —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">{editingId ? "Save" : "Add"}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", email: "", phone: "", assignedProjectId: null }); }} className="px-3 py-1 border rounded">Cancel</button>
            )}
          </div>
        </form>

        <div className="flex-1">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Volunteers ({volunteers.length})</h3>
            <div className="space-y-2">
              {volunteers.map((v) => {
                const projName = projects.find((p) => p.id === v.assignedProjectId)?.title || "— none —";
                return (
                  <div key={v.id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-gray-600">{v.email} • {v.phone}</div>
                      <div className="text-xs text-gray-500 mt-1">Assigned: {projName}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(v)} className="px-2 py-1 border rounded">Edit</button>
                      <button onClick={() => { if (confirm("Delete volunteer?")) onDelete(v.id); }} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>
                );
              })}
              {volunteers.length === 0 && <div className="text-gray-500">No volunteers yet.</div>}
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Quick stats</h4>
            <div className="flex gap-4 text-sm">
              <div>Total Projects: <strong>{projects.length}</strong></div>
              <div>Total Volunteers: <strong>{volunteers.length}</strong></div>
              <div>Assigned volunteers: <strong>{volunteers.filter((v) => v.assignedProjectId).length}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
