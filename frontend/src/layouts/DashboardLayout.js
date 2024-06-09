import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
    return (_jsxs("main", { className: "mx-auto grid w-full max-w-full items-start gap-6 md:grid-cols-[150px_1fr] lg:grid-cols-[200px_1fr] my-5", children: [_jsxs("nav", { className: "gap-1 border rounded-md font-semibold flex flex-col text-sm text-muted-foreground min-h-[92dvh] p-2", "x-chunk": "dashboard-04-chunk-0", children: [_jsx("h1", { className: "text-lg border-b pb-2 mb-2", children: "Dashboard" }), _jsx(Link, { to: "/dashboard/overview", className: cn(activePage == "overview" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2"), onClick: () => {
                            setActivePage("overview");
                        }, children: "Overview" }), _jsx(Link, { to: "/dashboard/user", className: cn(activePage == "user" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2"), onClick: () => {
                            setActivePage("user");
                        }, children: "Users" }), _jsx(Link, { to: "/dashboard/report", className: cn(activePage == "report" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2"), onClick: () => {
                            setActivePage("report");
                        }, children: "Report" }), _jsx(Link, { to: "/dashboard/admin", className: cn(activePage == "admin" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2"), onClick: () => {
                            setActivePage("admin");
                        }, children: "Admins" }), _jsx(Link, { to: "/dashboard/group", className: cn(activePage == "group" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2"), onClick: () => {
                            setActivePage("group");
                        }, children: "Groups" }), _jsx(Link, { to: "/dashboard/categories", className: cn(activePage == "categories" ? "text-primary rounded-sm bg-primary p-2 text-white" : "p-2"), onClick: () => {
                            setActivePage("categories");
                        }, children: "Category" })] }), _jsx("div", { className: "grid gap-6 max-h-[88vh] overflow-y-auto p-2", children: _jsx(Outlet, {}) })] }));
};
export default DashboardLayout;
