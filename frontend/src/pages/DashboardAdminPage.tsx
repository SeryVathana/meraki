import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, MoreHorizontalIcon, PlusCircleIcon, Search } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const DashboardAdminPage = () => {

  const [openRemoveAlert, setOpenRemoveAlert] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  const handleRemoveUser = (userId: string) => {
    setOpenRemoveAlert(false);
    // Add your logic to handle user removal here
  };

  const handleEditUser = (userId: string) => {
    setOpenEditDialog(true);
    // Add your logic to handle user editing here
  };

  const userInfo = () => ({
    group_name: "Laser Lemonade Machine",
    owner_email:"yooseryvathana@gmail.com",
    img_url:"http://example.png",
    status:"private"
    
  });

  // Call the food function to get the object
  const userObject = userInfo();

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>("");
  
    const handleRegisterAdmin = (e) => {
      e.preventDefault();
  
      setIsError(false);
      setErrMsg("");
  
      if (!firstName || !lastName || !email || !password) {
        setIsError(true);
        setErrMsg("All fields are required");
        return;
      }
  
      fetch("http://localhost:3000/auth/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.code === 200) {
            setIsOpen(false);
            // handleFetchAdmins();
          } else {
            setIsError(true);
            setErrMsg(data.message);
          }
        });
    };
  

  return (
    <main className="grid flex-1 items-start gap-4 p-2">
      <div className="flex items-center justify-between">
        <div className="w-auto flex gap-3 items-center">
          <Input type="text" placeholder="Search by name or email" className="w-[500px]" />
          <Button type="button" variant={"secondary"}>
            <Search className="w-4 mr-2" />
            Search
          </Button>
        </div>
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New Admin </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add new admin</DialogTitle>
          <DialogDescription>Enter information about new admin to add to list.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" className="col-span-3" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" className="col-span-3" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" className="col-span-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errMsg}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" onClick={(e) => handleRegisterAdmin(e)}>
            Add New
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="py-4">
          <CardTitle>Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((admin, index) => {
                return (
                  <TableRow className="" key={index}>
                    <TableCell className="hidden sm:table-cell">
                      <img alt="Product image" className="aspect-square rounded-full object-cover" height="48" src="/placeholder.svg" width="48" />
                    </TableCell>
                    <TableCell className="font-medium">Laser Lemonade Machine</TableCell>
                    <TableCell className="hidden md:table-cell">example@gmail.com</TableCell>
                    <TableCell className="hidden md:table-cell">2023-07-12 10:42 AM</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                          <DropdownMenuItem asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="text-sm w-full text-left justify-start p-2" variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                  <DialogTitle>Edit group details</DialogTitle>
                                  <DialogDescription>Enter new information about group to change it.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="img_url">Image URL</Label>
                                    <Input id="img_url" defaultValue={userObject.img_url} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title">Group name</Label>
                                    <Input id="username" defaultValue={userObject.group_name} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description">Owner Email</Label>
                                    <Input id="description" defaultValue={userObject.owner_email} className="col-span-3" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="shift">Status</Label>
                                    <Select defaultValue="available">
                                      <SelectTrigger id="shift" defaultValue={userObject.status} className="col-span-3">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent position="popper">
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="public">Public</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                
                                <DialogFooter>
                                  <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Dialog open={openRemoveAlert} onOpenChange={setOpenRemoveAlert}>
                              <DialogTrigger asChild>
                                <Button className="text-sm w-full text-left justify-start p-2" variant="ghost" size="sm">
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm</DialogTitle>
                                  <DialogDescription>Are you sure you want to delete this group?</DialogDescription>
                                  {/* <div className="space-y-2">
                                    <p className="text-sm">
                                      Name: <span className="font-semibold">food name</span>
                                    </p>
                                  </div> */}
                                </DialogHeader>
                                <DialogFooter>
                                  <Button type="submit" variant="secondary" onClick={() => setOpenRemoveAlert(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleRemoveUser}>
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
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
            <strong>1-10</strong> of <strong>32</strong>
            products
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};


export default DashboardAdminPage;
