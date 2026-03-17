import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-mobile-col" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <div className="md:flex hidden">
        <Sidebar />
      </div>
      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
