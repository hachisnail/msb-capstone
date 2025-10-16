import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 shadow bg-white">
        <h1 className="text-xl font-semibold">Public Header</h1>
      </header>

      <main className="flex-1 p-6">
        <Outlet /> {/* This is where public pages render */}
      </main>

      <footer className="p-4 text-center border-t">
        © {new Date().getFullYear()} Museo Bulawan MIS
      </footer>
    </div>
  );
}
