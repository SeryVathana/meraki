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
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListFilterIcon, MoreHorizontalIcon, Pencil, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Import your Dialog components
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

const DashboardUserPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleFetchUsers = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users?` + new URLSearchParams({ q: searchQuery }), {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
      });
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length < 2) {
      return;
    }
    handleFetchUsers();
  }, [searchQuery]);

  return (
    <main className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <div className="w-auto flex gap-3 items-center">
          <Input
            type="text"
            placeholder="Search by name or email"
            className="w-[500px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="button" variant={"secondary"} onClick={handleFetchUsers}>
            <Search className="w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="py-4">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell text-center">Posts</TableHead>
                <TableHead className="hidden md:table-cell text-center">Groups Own</TableHead>
                <TableHead className="hidden md:table-cell text-center">Groups</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <UserItem user={user} key={index} handleFetchUsers={handleFetchUsers} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

const UserItem = ({ user, handleFetchUsers }) => {
  const [openRemoveAlert, setOpenRemoveAlert] = useState<boolean>(false);

  const handleRemoveUser = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/deleteUser/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          handleFetchUsers();
          setOpenRemoveAlert(false);
        } else {
          console.error("Failed to delete user:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  return (
    <TableRow className="">
      <TableCell className="hidden sm:table-cell">
        <img alt="Product image" className="aspect-square rounded-full object-cover" height="48" src={user.pf_img_url} width="48" />
      </TableCell>
      <TableCell className="font-medium">{user.first_name + " " + user.last_name}</TableCell>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{user.posts}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{user.group_own}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{user.group_member}</TableCell>
      <TableCell className="hidden md:table-cell">{format(new Date(user.created_at), "Pp")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditUserDialog user={user} handleFetchUsers={handleFetchUsers} />
            <Dialog open={openRemoveAlert} onOpenChange={setOpenRemoveAlert}>
              <DialogTrigger asChild>
                <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
                  <span>Delete</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Confirm</DialogTitle>
                  <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="submit" variant="secondary" onClick={() => setOpenRemoveAlert(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => handleRemoveUser()}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const EditUserDialog = ({ user, handleFetchUsers }) => {
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [pfImgFile, setPfImgFile] = useState<File | null>(null);
  const [pfImgUrl, setPfImgUrl] = useState<string>("");
  const [firstName, setFirstName] = useState<string>(user.first_name);
  const [lastName, setLastName] = useState<string>(user.last_name);
  const [isFirstNameError, setIsFirstNameError] = useState<boolean>(false);
  const [isLastNameError, setIsLastNameError] = useState<boolean>(false);
  const [firstNameMsg, setFirstNameErrMsg] = useState<string>("");
  const [lastNameMsg, setLastNameErrMsg] = useState<string>("");

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPfImgFile(file);
      setPfImgUrl(URL.createObjectURL(file));
    }
  };

  const handleEditUser = async () => {
    setIsFirstNameError(false);
    setIsLastNameError(false);
    setFirstNameErrMsg("");
    setLastNameErrMsg("");

    if (!firstName.trim()) {
      setIsFirstNameError(true);
      setFirstNameErrMsg("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setIsLastNameError(true);
      setLastNameErrMsg("Last name is required");
      return;
    }

    let imgDownloadURL = user.pf_img_url;
    if (pfImgFile) {
      try {
        const fileName = `user-uploaded/${pfImgFile.name} - ${new Date().getTime()}`;
        const imgs = ref(storage, fileName);
        const uploadDisplay = await uploadBytes(imgs, pfImgFile);
        imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
      } catch (error) {
        console.error("Image upload error:", error);
        return;
      }
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      pf_img_url: imgDownloadURL,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.status === 200) {
        handleFetchUsers();
        setOpenEditDialog(false);
      } else {
        console.error("Failed to update user:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={() => setOpenEditDialog(!openEditDialog)}>
      <DialogTrigger asChild>
        <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
          <span>Edit</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit user details</DialogTitle>
          <DialogDescription>You can edit the user details below. Click on the save button to save the changes.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 my-5">
            <Label htmlFor="img_url">Profile Image</Label>
            <label htmlFor="dropzone-file" className="w-32 h-32 col-span-3 rounded-full relative group cursor-pointer mx-auto">
              <Avatar className="w-32 h-32  border-2  group-hover:border-4 border-gray-200 ">
                <AvatarImage src={pfImgUrl ? pfImgUrl : user.pf_img_url} referrerPolicy="no-referrer" className="object-cover w-full h-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 group-hover:bg-black/20 rounded-full transition-all duration-300"></div>

              <div className="absolute right-0 top-0 bg-gray-200 p-2 rounded-full">
                <Pencil className=" w-5 h-5" />
              </div>

              <input id="dropzone-file" type="file" className="hidden" onChange={handleUploadImage} accept="image/png, image/jpeg" />
            </label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">First Name</Label>
            <div className="relative col-span-3">
              <Input id="username" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              {isFirstNameError && <p className="text-xs text-destructive absolute">{firstNameMsg}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">Last Name</Label>
            <div className="relative col-span-3">
              <Input id="username" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              {isLastNameError && <p className="text-xs text-destructive absolute">{lastNameMsg}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpenEditDialog(false);
              setPfImgFile(null);
              setPfImgUrl("");
              setFirstName(user.first_name);
              setLastName(user.last_name);
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => handleEditUser()}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardUserPage;
