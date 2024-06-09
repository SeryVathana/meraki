import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontalIcon, Pencil, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Import your Dialog components
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
const DashboardGroupPage = () => {
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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
    return (_jsxs("main", { className: "grid flex-1 items-start gap-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "w-auto flex gap-3 items-center", children: [_jsx(Input, { type: "text", placeholder: "Search by name or owner's email", className: "w-[500px]", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsxs(Button, { type: "button", variant: "secondary", onClick: handleFetchGroups, children: [_jsx(Search, { className: "w-4 mr-2" }), "Search"] })] }) }), _jsxs(Card, { "x-chunk": "dashboard-06-chunk-0", children: [_jsx(CardHeader, { className: "py-4", children: _jsx(CardTitle, { children: "Groups" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "hidden w-[100px] sm:table-cell", children: _jsx("span", { className: "sr-only", children: "Image" }) }), _jsx(TableHead, { children: "Group ID" }), _jsx(TableHead, { children: "Group Name" }), _jsx(TableHead, { children: "Owner Email" }), _jsx(TableHead, { className: "hidden md:table-cell text-center", children: "Members" }), _jsx(TableHead, { className: "hidden md:table-cell text-center", children: "Posts" }), _jsx(TableHead, { className: "hidden md:table-cell text-center", children: "Status" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Created at" })] }) }), _jsx(TableBody, { children: groups?.map((group, index) => (_jsx(GroupItem, { group: group, handleFetchGroups: handleFetchGroups }, index))) })] }) })] })] }));
};
const GroupItem = ({ group, handleFetchGroups }) => {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openRemoveAlert, setOpenRemoveAlert] = useState(false);
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
    return (_jsxs(TableRow, { className: "", children: [_jsx(TableCell, { className: "hidden sm:table-cell", children: _jsx("img", { alt: "Product image", className: "aspect-square rounded-full object-cover", height: "48", src: group.img_url, width: "48" }) }), _jsx(TableCell, { className: "font-medium", children: group.id }), _jsx(TableCell, { className: "font-medium", children: group.title }), _jsx(TableCell, { className: "font-medium", children: group.owner_email }), _jsx(TableCell, { className: "hidden md:table-cell text-center", children: group.members_count }), _jsx(TableCell, { className: "hidden md:table-cell text-center", children: group.posts_count }), _jsx(TableCell, { className: "hidden md:table-cell text-center", children: group.status }), _jsx(TableCell, { className: "hidden md:table-cell", children: format(new Date(group.created_at), "Pp") }), _jsx(TableCell, { children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { "aria-haspopup": "true", size: "icon", variant: "ghost", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MoreHorizontalIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Toggle menu" })] }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(EditGroupDialog, { group: group, handleFetchGroups: handleFetchGroups }), _jsxs(Dialog, { open: openRemoveAlert, onOpenChange: () => setOpenRemoveAlert(!openRemoveAlert), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: _jsx("span", { children: "Delete" }) }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Delete group" }), _jsx(DialogDescription, { children: "Are you sure you want to delete this group?" })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setOpenRemoveAlert(false), children: "Cancel" }), _jsx(Button, { onClick: handleRemoveGroup, variant: "destructive", children: "Delete" })] })] })] })] })] }) })] }));
};
const EditGroupDialog = ({ group, handleFetchGroups }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [isEditError, setIsEditError] = useState(false);
    const [editErrMsg, setEditErrMsg] = useState("");
    const [groupTitle, setGroupTitle] = useState(group.title);
    const [groupStatus, setGroupStatus] = useState(group.status);
    const [groupImgUrl, setGroupImgUrl] = useState(group.img_url);
    const [groupImgFile, setGroupImgFile] = useState(null);
    const handleUploadImage = (e) => {
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
            }
            else {
                if (data.message == "Tag already exists") {
                    setIsEditError(true);
                    setEditErrMsg("Category already exists");
                }
                else {
                    setIsEditError(true);
                    setEditErrMsg("Something went wrong. Please try again");
                }
            }
        });
    };
    return (_jsxs(Dialog, { open: openEditDialog, onOpenChange: () => setOpenEditDialog(!openEditDialog), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: _jsx("span", { children: "Edit" }) }) }), _jsxs(DialogContent, { className: "sm:max-w-[625px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit group details" }), _jsx(DialogDescription, { children: "You can edit the group details below. Click on the save button to save the changes." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4 my-5", children: [_jsx(Label, { htmlFor: "img_url", children: "Profile Image" }), _jsxs("label", { htmlFor: "dropzone-file", className: "w-32 h-32 col-span-3 rounded-full relative group cursor-pointer mx-auto", children: [_jsxs(Avatar, { className: "w-32 h-32  border-2  group-hover:border-4 border-gray-200 ", children: [_jsx(AvatarImage, { src: groupImgUrl ? groupImgUrl : group.img_url, referrerPolicy: "no-referrer", className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "absolute inset-0 group-hover:bg-black/20 rounded-full\r\n                    transition-all duration-300\r\n                  " }), _jsx("div", { className: "absolute right-0 top-0 bg-gray-200 p-2 rounded-full", children: _jsx(Pencil, { className: " w-5 h-5" }) }), _jsx("input", { id: "dropzone-file", type: "file", className: "hidden", onChange: handleUploadImage, accept: "image/png, image/jpeg" })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", children: "Title" }), _jsx(Input, { id: "username", value: groupTitle, className: "col-span-3", onChange: (e) => setGroupTitle(e.target.value) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                    setOpenEditDialog(false);
                                    setGroupImgUrl(group.img_url);
                                    setGroupTitle(group.title);
                                    setGroupImgFile(null);
                                }, children: "Cancel" }), _jsx(Button, { onClick: () => handleEditGroup(), children: "Save Changes" })] })] })] }));
};
export default DashboardGroupPage;
