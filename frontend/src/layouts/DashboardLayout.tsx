import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("overview");

  const auth = useSelector((state: RootState) => state.auth);

  // if (auth?.userData.role != "admin") {
  //   return <Navigate to={"/"} />;
  // }

  useEffect(() => {
    switch (window.location.pathname) {
      case "/dashboard/overview":
        setActivePage("overview");
        break;
      case "/dashboard/user":
        setActivePage("user");
        break;
      case "/dashboard/group":
        setActivePage("group");
        break;
      case "/dashboard/admin":
        setActivePage("admin");
        break;
      default:
        setActivePage("overview");
        break;
    }
  }, [window.location.pathname]);

  return (
    <main className="flex max-h-[90vh] flex-1 flex-col gap-4 py-4 md:gap-8 md:pb-4">
      <div className="mx-auto grid w-full max-w-full items-start gap-6 md:grid-cols-[150px_1fr] lg:grid-cols-[200px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
          <Link
            to="/dashboard/overview"
            className={cn(activePage == "overview" ? "font-semibold text-primary" : "")}
            onClick={() => {
              setActivePage("overview");
            }}
          >
            Overview
          </Link>
          <Link
            to="/dashboard/user"
            className={cn(activePage == "user" ? "font-semibold text-primary" : "")}
            onClick={() => {
              setActivePage("user");
            }}
          >
            Users
          </Link>
          <Link
            to="/dashboard/admin"
            className={cn(activePage == "admin" ? "font-semibold text-primary" : "")}
            onClick={() => {
              setActivePage("admin");
            }}
          >
            Admins
          </Link>
          <Link
            to="/dashboard/group"
            className={cn(activePage == "group" ? "font-semibold text-primary" : "")}
            onClick={() => {
              setActivePage("group");
            }}
          >
            Groups
          </Link>

          {/* <Link to="#">Support</Link>
          <Link to="#">Organizations</Link>
          <Link to="#">Advanced</Link> */}
        </nav>
        <div className="grid gap-6 max-h-[88vh] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
