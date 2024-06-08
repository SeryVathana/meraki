import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("overview");
  const location = useLocation();

  useEffect(() => {
    switch (window.location.pathname) {
      case "/dashboard/overview":
        setActivePage("overview");
        break;
      case "/dashboard/user":
        setActivePage("user");
        break;
      case "/dashboard/report":
        setActivePage("report");
        break;
      case "/dashboard/group":
        setActivePage("group");
        break;
      case "/dashboard/admin":
        setActivePage("admin");
        break;
      case "/dashboard/categories":
        setActivePage("categories");
        break;
      default:
        setActivePage("overview");
        break;
    }
  }, [location.pathname]);

  return (
    <main className="mx-auto grid w-full max-w-full items-start gap-6 md:grid-cols-[150px_1fr] lg:grid-cols-[200px_1fr] my-5">
      <nav
        className="gap-1 border rounded-md font-semibold flex flex-col text-sm text-muted-foreground min-h-[92dvh] p-2"
        x-chunk="dashboard-04-chunk-0"
      >
        <h1 className="text-lg border-b pb-2 mb-2">Dashboard</h1>
        <Link
          to="/dashboard/overview"
          className={cn(activePage == "overview" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2")}
          onClick={() => {
            setActivePage("overview");
          }}
        >
          Overview
        </Link>
        <Link
          to="/dashboard/user"
          className={cn(activePage == "user" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2")}
          onClick={() => {
            setActivePage("user");
          }}
        >
          Users
        </Link>
        <Link
          to="/dashboard/report"
          className={cn(activePage == "report" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2")}
          onClick={() => {
            setActivePage("report");
          }}
        >
          Report
        </Link>
        <Link
          to="/dashboard/admin"
          className={cn(activePage == "admin" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2")}
          onClick={() => {
            setActivePage("admin");
          }}
        >
          Admins
        </Link>
        <Link
          to="/dashboard/group"
          className={cn(activePage == "group" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2")}
          onClick={() => {
            setActivePage("group");
          }}
        >
          Groups
        </Link>
        <Link
          to="/dashboard/categories"
          className={cn(activePage == "categories" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2")}
          onClick={() => {
            setActivePage("categories");
          }}
        >
          Category
        </Link>

        {/* <Link to="#">Support</Link>
          <Link to="#">Organizations</Link>
          <Link to="#">Advanced</Link> */}
      </nav>
      <div className="grid gap-6 max-h-[88vh] overflow-y-auto p-2">
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
