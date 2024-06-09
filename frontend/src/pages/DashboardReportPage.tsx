import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontalIcon, PlusCircleIcon, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ListFilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
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

  return (
    <main className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <div className="w-auto flex gap-3 items-center">
          <Input type="text" placeholder="Search by name or email" className="w-[500px]" />
          <Button type="button" variant={"secondary"}>
            <Search className="w-4 mr-2" />
            Search
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1" variant="outline">
              <ListFilterIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>None</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Name</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Newest</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Oldest</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="py-4">
          <CardTitle>Reported</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Reporter (Email)</TableHead>
                <TableHead>Post ID</TableHead>
                <TableHead className="hidden md:table-cell">Post Owner (Email)</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <ReportItem key={index} report={report} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing
            <strong>1-10</strong> of <strong>32</strong>
            products
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

const ReportItem = ({ report }) => {
  const navigate = useNavigate();
  return (
    <TableRow className="">
      <TableCell className="hidden sm:table-cell">
        <Avatar className="">
          <AvatarImage src={report.post_img_url} alt="@shadcn" className="object-cover w-12 h-12" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{report.reporter_email}</TableCell>
      <TableCell>{report.post_id}</TableCell>
      <TableCell className="hidden md:table-cell">{report.port_owner_email}</TableCell>
      <TableCell className="hidden md:table-cell truncate max-w-[250px]">{report.reason}</TableCell>
      <TableCell className="hidden md:table-cell">{format(new Date(report.created_at), "Pp")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <p className="hover:bg-secondary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    Report Detail
                  </p>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Report Detail</DialogTitle>
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 items-center">
                      <p className="col-span-3 text-sm font-semibold">Reporter: </p>
                      <p className="col-span-9">{report.reporter_email}</p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                      <p className="col-span-3 text-sm font-semibold">Post ID: </p>
                      <p className="col-span-9">{report.post_id}</p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                      <p className="col-span-3 text-sm font-semibold">Post Owner: </p>
                      <p className="col-span-9">{report.port_owner_email}</p>
                    </div>
                    <div className="grid grid-cols-12 items-center">
                      <p className="col-span-3 text-sm font-semibold">Date: </p>
                      <p className="col-span-9">{format(new Date(report.created_at), "Pp")}</p>
                    </div>
                    <div className="grid grid-cols-12 items-start">
                      <p className="col-span-3 text-sm font-semibold">Reason: </p>
                      <div className="col-span-9 p-2 border rounded-md ">
                        <p>{report.reason}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>

            <DropdownMenuItem onClick={() => navigate(`/post/${report.post_id}`)}>View Post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default DashboardReportPage;
