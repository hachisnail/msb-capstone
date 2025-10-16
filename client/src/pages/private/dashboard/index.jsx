import { useAuth } from "../../../context/AuthProvider";
import RequirePerm from "../../../components/RequirePerm";

export default function Dashboard() {
  document.title = "Dashboard";

  const { session, signOut, hasRole } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={signOut}
              className="text-sm bg-rose-600 text-white px-3 py-1.5 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-medium mb-2">Session</h2>
          <pre className="bg-slate-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-medium mb-2">RBAC examples</h2>

          <div className="mb-3">
            <span className="text-sm">
              Has role <b>SUPERADMIN</b>? {hasRole("SUPERADMIN") ? "Yes" : "No"}
            </span>
          </div>

          <RequirePerm perm="inventory.create">
            <div className="p-3 rounded bg-emerald-50 text-emerald-800">
              You have <b>inventory.create</b> — show create UI here.
            </div>
          </RequirePerm>

          <div className="mt-3">
            <RequirePerm perm="articles.approve">
              <div className="p-3 rounded bg-blue-50 text-blue-800">
                You can <b>articles.approve</b>.
              </div>
            </RequirePerm>
          </div>
        </section>
      </div>
    </main>
  );
}
