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
import { ListFilterIcon, MoreHorizontalIcon, Pencil, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Import your Dialog components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

const DashboardGroupPage = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleFetchGroups = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/group?` + new URLSearchParams({ q: searchQuery }), {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    })
      .then((response) => response.json())
      .then((data) => setGroups(data.groups));
  };

  useEffect(() => {
    if (searchQuery.length >= 1) {
      return;
    }
    handleFetchGroups();
  }, [searchQuery]);

  return (
    <main className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <div className="w-auto flex gap-3 items-center">
          <Input
            type="text"
            placeholder="Search by name or owner's email"
            className="w-[500px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="button" variant={"secondary"} onClick={handleFetchGroups}>
            <Search className="w-4 mr-2" />
            Search
          </Button>
        </div>
        {/* <DropdownMenu>
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
        </DropdownMenu> */}
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
                <TableHead>Group ID</TableHead>
                <TableHead>Group Name</TableHead>
                <TableHead>Owner Email</TableHead>
                <TableHead className="hidden md:table-cell text-center">Members</TableHead>
                <TableHead className="hidden md:table-cell text-center">Posts</TableHead>
                <TableHead className="hidden md:table-cell text-center">Status</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                {/* <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups?.map((group, index) => (
                <GroupItem key={index} group={group} handleFetchGroups={handleFetchGroups} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

const GroupItem = ({ group, handleFetchGroups }) => {
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [openRemoveAlert, setOpenRemoveAlert] = useState<boolean>(false);

  const handleRemoveGroup = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/group/${group.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          handleFetchGroups();
          setOpenRemoveAlert(false);
          setOpenDropDown(false);
        }
      });
  };

  return (
    <TableRow className="">
      <TableCell className="hidden sm:table-cell">
        <img alt="Product image" className="aspect-square rounded-full object-cover" height="48" src={group.img_url} width="48" />
      </TableCell>
      <TableCell className="font-medium">{group.id}</TableCell>
      <TableCell className="font-medium">{group.title}</TableCell>
      <TableCell className="font-medium">{group.owner_email}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{group.members_count}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{group.posts_count}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{group.status}</TableCell>
      <TableCell className="hidden md:table-cell">{format(new Date(group.created_at), "Pp")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <div className="flex items-center gap-2">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditGroupDialog group={group} handleFetchGroups={handleFetchGroups} />
            <Dialog open={openRemoveAlert} onOpenChange={() => setOpenRemoveAlert(!openRemoveAlert)}>
              <DialogTrigger asChild>
                <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
                  <span>Delete</span>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete group</DialogTitle>
                  <DialogDescription>Are you sure you want to delete this group?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenRemoveAlert(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRemoveGroup} variant="destructive">
                    Delete
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

const EditGroupDialog = ({ group, handleFetchGroups }) => {
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [isEditError, setIsEditError] = useState<boolean>(false);
  const [editErrMsg, setEditErrMsg] = useState<string>("");

  const [groupTitle, setGroupTitle] = useState<string>(group.title);
  const [groupStatus, setGroupStatus] = useState<string>(group.status);
  const [groupImgUrl, setGroupImgUrl] = useState<string>(group.img_url);
  const [groupImgFile, setGroupImgFile] = useState<File | null>(null);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setGroupImgFile(file);
      setGroupImgUrl(URL.createObjectURL(file));
    }
  };

  const handleEditGroup = async () => {
    if (!groupTitle) {
      setIsEditError(true);
      setEditErrMsg("Category title is required");
      return;
    }
    let imgDownloadURL = "";
    if (groupImgFile) {
      const fileName = `user-uploaded/${groupImgFile} - ${new Date().getTime()}`;
      const imgs = ref(storage, fileName);
      const uploadDisplay = await uploadBytes(imgs, groupImgFile);
      imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
    }

    fetch(`${import.meta.env.VITE_SERVER_URL}/group/${group.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status: groupStatus, title: groupTitle, img_url: imgDownloadURL ? imgDownloadURL : group.img_url }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          handleFetchGroups();
          setOpenEditDialog(false);
        } else {
          if (data.message == "Tag already exists") {
            setIsEditError(true);
            setEditErrMsg("Category already exists");
          } else {
            setIsEditError(true);
            setEditErrMsg("Something went wrong. Please try again");
          }
        }
      });
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
          <DialogTitle>Edit group details</DialogTitle>
          <DialogDescription>You can edit the group details below. Click on the save button to save the changes.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 my-5">
            <Label htmlFor="img_url">Profile Image</Label>
            <label htmlFor="dropzone-file" className="w-32 h-32 col-span-3 rounded-full relative group cursor-pointer mx-auto">
              <Avatar className="w-32 h-32  border-2  group-hover:border-4 border-gray-200 ">
                <AvatarImage src={groupImgUrl ? groupImgUrl : group.img_url} referrerPolicy="no-referrer" className="object-cover w-full h-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div
                className="absolute inset-0 group-hover:bg-black/20 rounded-full
                    transition-all duration-300
                  "
              ></div>

              <div className="absolute right-0 top-0 bg-gray-200 p-2 rounded-full">
                <Pencil className=" w-5 h-5" />
              </div>

              <input id="dropzone-file" type="file" className="hidden" onChange={handleUploadImage} accept="image/png, image/jpeg" />
            </label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">Title</Label>
            <Input id="username" value={groupTitle} className="col-span-3" onChange={(e) => setGroupTitle(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpenEditDialog(false);
              setGroupImgUrl(group.img_url);
              setGroupTitle(group.title);
              setGroupImgFile(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => handleEditGroup()}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardGroupPage;
