import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListFilterIcon, MoreHorizontalIcon, Search } from "lucide-react";

const DashboardGroupPage = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-2">
      <div className="flex items-center justify-between">
        <div className="w-auto flex gap-3 items-center">
          <Input type="text" placeholder="Search by name or owner's email" className="w-[500px]" />
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
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="hidden md:table-cell text-center">Members</TableHead>
                <TableHead className="hidden md:table-cell text-center">Posts</TableHead>
                <TableHead className="hidden md:table-cell text-center">Status</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 13, 13].map((admin, index) => {
                return (
                  <TableRow className="" key={index}>
                    <TableCell className="hidden sm:table-cell">
                      <img alt="Product image" className="aspect-square rounded-full object-cover" height="48" src="/placeholder.svg" width="48" />
                    </TableCell>
                    <TableCell className="font-medium">Laser Lemonade Machine</TableCell>
                    <TableCell className="font-medium">yooseryvathana@gmail.com</TableCell>
                    <TableCell className="hidden md:table-cell text-center">50</TableCell>
                    <TableCell className="hidden md:table-cell text-center">8</TableCell>
                    <TableCell className="hidden md:table-cell text-center">{index % 2 == 0 ? "private" : "public"}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(Date.now()).toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing
            <strong> 1-10</strong> of <strong>32</strong> groups
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default DashboardGroupPage;
