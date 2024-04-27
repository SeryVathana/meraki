import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 py-4 md:gap-8 md:pb-4">
      <div className="mx-auto grid w-full max-w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link to="/dashboard/overview" className="font-semibold text-primary">
            Overview
          </Link>
          <Link to="#">Security</Link>
          <Link to="#">Integrations</Link>
          <Link to="#">Support</Link>
          <Link to="#">Organizations</Link>
          <Link to="#">Advanced</Link>
        </nav>
        <div className="grid gap-6">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
