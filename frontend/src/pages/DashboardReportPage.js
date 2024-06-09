import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontalIcon, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ListFilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
const DashboardReportPage = () => {
    const [reports, setReports] = useState([]);
    const handleFetchReports = async () => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/report`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        });
        const data = await response.json();
        setReports(data.reports);
    };
    useEffect(() => {
        handleFetchReports();
    }, []);
    return (_jsxs("main", { className: "grid flex-1 items-start gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "w-auto flex gap-3 items-center", children: [_jsx(Input, { type: "text", placeholder: "Search by name or email", className: "w-[500px]" }), _jsxs(Button, { type: "button", variant: "secondary", children: [_jsx(Search, { className: "w-4 mr-2" }), "Search"] })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { className: "gap-1", variant: "outline", children: [_jsx(ListFilterIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Filter" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuLabel, { children: "Filter by" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuCheckboxItem, { checked: true, children: "None" }), _jsx(DropdownMenuCheckboxItem, { children: "Name" }), _jsx(DropdownMenuCheckboxItem, { children: "Newest" }), _jsx(DropdownMenuCheckboxItem, { children: "Oldest" })] })] })] }), _jsxs(Card, { "x-chunk": "dashboard-06-chunk-0", children: [_jsx(CardHeader, { className: "py-4", children: _jsx(CardTitle, { children: "Reported" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "hidden w-[100px] sm:table-cell", children: _jsx("span", { className: "sr-only", children: "Image" }) }), _jsx(TableHead, { children: "Reporter (Email)" }), _jsx(TableHead, { children: "Post ID" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Post Owner (Email)" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Reason" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Created at" }), _jsx(TableHead, { children: _jsx("span", { className: "", children: "Actions" }) })] }) }), _jsx(TableBody, { children: reports.map((report, index) => (_jsx(ReportItem, { report: report }, index))) })] }) }), _jsx(CardFooter, { children: _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Showing", _jsx("strong", { children: "1-10" }), " of ", _jsx("strong", { children: "32" }), "products"] }) })] })] }));
};
const ReportItem = ({ report }) => {
    const navigate = useNavigate();
    return (_jsxs(TableRow, { className: "", children: [_jsx(TableCell, { className: "hidden sm:table-cell", children: _jsxs(Avatar, { className: "", children: [_jsx(AvatarImage, { src: report.post_img_url, alt: "@shadcn", className: "object-cover w-12 h-12" }), _jsx(AvatarFallback, { children: "CN" })] }) }), _jsx(TableCell, { className: "font-medium", children: report.reporter_email }), _jsx(TableCell, { children: report.post_id }), _jsx(TableCell, { className: "hidden md:table-cell", children: report.port_owner_email }), _jsx(TableCell, { className: "hidden md:table-cell truncate max-w-[250px]", children: report.reason }), _jsx(TableCell, { className: "hidden md:table-cell", children: format(new Date(report.created_at), "Pp") }), _jsx(TableCell, { children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { "aria-haspopup": "true", size: "icon", variant: "ghost", children: [_jsx(MoreHorizontalIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Toggle menu" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(_Fragment, { children: _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("p", { className: "hover:bg-secondary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", children: "Report Detail" }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Report Detail" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "grid grid-cols-12 items-center", children: [_jsx("p", { className: "col-span-3 text-sm font-semibold", children: "Reporter: " }), _jsx("p", { className: "col-span-9", children: report.reporter_email })] }), _jsxs("div", { className: "grid grid-cols-12 items-center", children: [_jsx("p", { className: "col-span-3 text-sm font-semibold", children: "Post ID: " }), _jsx("p", { className: "col-span-9", children: report.post_id })] }), _jsxs("div", { className: "grid grid-cols-12 items-center", children: [_jsx("p", { className: "col-span-3 text-sm font-semibold", children: "Post Owner: " }), _jsx("p", { className: "col-span-9", children: report.port_owner_email })] }), _jsxs("div", { className: "grid grid-cols-12 items-center", children: [_jsx("p", { className: "col-span-3 text-sm font-semibold", children: "Date: " }), _jsx("p", { className: "col-span-9", children: format(new Date(report.created_at), "Pp") })] }), _jsxs("div", { className: "grid grid-cols-12 items-start", children: [_jsx("p", { className: "col-span-3 text-sm font-semibold", children: "Reason: " }), _jsx("div", { className: "col-span-9 p-2 border rounded-md ", children: _jsx("p", { children: report.reason }) })] })] })] })] }) }), _jsx(DropdownMenuItem, { onClick: () => navigate(`/post/${report.post_id}`), children: "View Post" })] })] }) })] }));
};
export default DashboardReportPage;
