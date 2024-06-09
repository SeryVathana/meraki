import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Import your Dialog components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MoreHorizontalIcon, Pencil, PlusCircleIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
const DashboardAdminPage = () => {
    const [openAddAlert, setOpenAddAlert] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [admins, setAdmins] = useState([]);
    const [adminFirstName, setAdminFirstName] = useState("");
    const [adminLastName, setAdminLastName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const handleFetchAdmins = async () => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/admins?` + new URLSearchParams({ q: searchQuery }), {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        });
        const data = await response.json();
        setAdmins(data.data);
    };
    const handleAddAdmin = async () => {
        if (!adminFirstName.trim() || !adminLastName.trim() || !adminEmail.trim()) {
            return;
        }
        setIsAdding(true);
        const payload = {
            first_name: adminFirstName,
            last_name: adminLastName,
            email: adminEmail,
        };
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/createAdmin`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.status === 200) {
            handleFetchAdmins();
            setOpenAddAlert(false);
        }
        else {
            console.error("Failed to add admin:", data.message);
        }
        setIsAdding(false);
    };
    useEffect(() => {
        const abortController = new AbortController();
        if (searchQuery.length >= 1) {
            return;
        }
        handleFetchAdmins();
        return () => {
            // Cancel the request when the component unmounts
            abortController.abort();
        };
    }, [searchQuery]);
    return (_jsxs("main", { className: "grid flex-1 items-start gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "w-auto flex gap-3 items-center", children: [_jsx(Input, { type: "text", placeholder: "Search by name or email", className: "w-[500px]", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsxs(Button, { type: "button", variant: "secondary", onClick: handleFetchAdmins, children: [_jsx(Search, { className: "w-4 mr-2" }), "Search"] })] }), _jsxs(Dialog, { open: openAddAlert, onOpenChange: setOpenAddAlert, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { className: "gap-1", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(PlusCircleIcon, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Add Admin" })] }) }) }), _jsxs(DialogContent, { className: "sm:max-w-[625px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Add New Admin" }), _jsx(DialogDescription, { children: "Enter new admin information" })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "img_url", children: "First Name" }), _jsx(Input, { id: "img_url", placeholder: "first name", className: "col-span-3", value: adminFirstName, onChange: (e) => setAdminFirstName(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", children: "Last Name" }), _jsx(Input, { id: "username", placeholder: "last name", className: "col-span-3", value: adminLastName, onChange: (e) => setAdminLastName(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", placeholder: "example@gmail.com", className: "col-span-3", value: adminEmail, onChange: (e) => setAdminEmail(e.target.value) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "secondary", onClick: () => setOpenAddAlert(false), children: "Cancel" }), _jsx(Button, { onClick: () => handleAddAdmin(), disabled: isAdding, children: isAdding ? "Loading..." : "Add" })] })] })] })] }), _jsxs(Card, { "x-chunk": "dashboard-06-chunk-0", children: [_jsx(CardHeader, { className: "py-4", children: _jsx(CardTitle, { children: "Admins" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "hidden w-[100px] sm:table-cell", children: _jsx("span", { className: "sr-only", children: "Image" }) }), _jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Created at" }), _jsx(TableHead, { children: _jsx("span", { className: "sr-only", children: "Actions" }) })] }) }), _jsx(TableBody, { children: admins?.map((admin, index) => (_jsx(UserItem, { user: admin, handleFetchAdmins: handleFetchAdmins }, index))) })] }) }), _jsx(CardFooter, { children: _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Showing", _jsx("strong", { children: "1-10" }), " of ", _jsx("strong", { children: "32" }), "products"] }) })] })] }));
};
const UserItem = ({ user, handleFetchAdmins }) => {
    const [openRemoveAlert, setOpenRemoveAlert] = useState(false);
    const handleRemoveAdmin = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/admin/removeAdmin/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((response) => {
            if (response.status === 200) {
                handleFetchAdmins();
                setOpenRemoveAlert(false);
            }
            else {
                console.error("Failed to delete user:", response.statusText);
            }
        })
            .catch((error) => {
            console.error("Fetch error:", error);
        });
    };
    return (_jsxs(TableRow, { className: "", children: [_jsx(TableCell, { className: "hidden sm:table-cell", children: _jsx("img", { alt: "Product image", className: "aspect-square rounded-full object-cover", height: "48", src: user.pf_img_url, width: "48" }) }), _jsx(TableCell, { className: "font-medium", children: user.first_name + " " + user.last_name }), _jsx(TableCell, { className: "font-medium", children: user.email }), _jsx(TableCell, { className: "hidden md:table-cell", children: format(new Date(user.created_at), "Pp") }), _jsx(TableCell, { children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { "aria-haspopup": "true", size: "icon", variant: "ghost", children: [_jsx(MoreHorizontalIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Toggle menu" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(EditAdminDialog, { user: user, handleFetchAdmins: handleFetchAdmins }), _jsxs(Dialog, { open: openRemoveAlert, onOpenChange: setOpenRemoveAlert, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: _jsx("span", { children: "Delete" }) }) }), _jsxs(DialogContent, { className: "sm:max-w-[525px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirm" }), _jsx(DialogDescription, { children: "Are you sure you want to delete this user?" })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "submit", variant: "secondary", onClick: () => setOpenRemoveAlert(false), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => handleRemoveAdmin(), children: "Confirm" })] })] })] })] })] }) })] }));
};
const EditAdminDialog = ({ user, handleFetchAdmins }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [pfImgFile, setPfImgFile] = useState(null);
    const [pfImgUrl, setPfImgUrl] = useState("");
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [isFirstNameError, setIsFirstNameError] = useState(false);
    const [isLastNameError, setIsLastNameError] = useState(false);
    const [firstNameMsg, setFirstNameErrMsg] = useState("");
    const [lastNameMsg, setLastNameErrMsg] = useState("");
    const handleUploadImage = (e) => {
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
            }
            catch (error) {
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
                handleFetchAdmins();
                setOpenEditDialog(false);
            }
            else {
                console.error("Failed to update user:", data.message);
            }
        }
        catch (error) {
            console.error("Fetch error:", error);
        }
    };
    return (_jsxs(Dialog, { open: openEditDialog, onOpenChange: () => setOpenEditDialog(!openEditDialog), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: _jsx("span", { children: "Edit" }) }) }), _jsxs(DialogContent, { className: "sm:max-w-[625px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit user details" }), _jsx(DialogDescription, { children: "You can edit the user details below. Click on the save button to save the changes." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4 my-5", children: [_jsx(Label, { htmlFor: "img_url", children: "Profile Image" }), _jsxs("label", { htmlFor: "dropzone-file", className: "w-32 h-32 col-span-3 rounded-full relative group cursor-pointer mx-auto", children: [_jsxs(Avatar, { className: "w-32 h-32  border-2  group-hover:border-4 border-gray-200 ", children: [_jsx(AvatarImage, { src: pfImgUrl ? pfImgUrl : user.pf_img_url, referrerPolicy: "no-referrer", className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "absolute inset-0 group-hover:bg-black/20 rounded-full transition-all duration-300" }), _jsx("div", { className: "absolute right-0 top-0 bg-gray-200 p-2 rounded-full", children: _jsx(Pencil, { className: " w-5 h-5" }) }), _jsx("input", { id: "dropzone-file", type: "file", className: "hidden", onChange: handleUploadImage, accept: "image/png, image/jpeg" })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", children: "First Name" }), _jsxs("div", { className: "relative col-span-3", children: [_jsx(Input, { id: "username", value: firstName, onChange: (e) => setFirstName(e.target.value) }), isFirstNameError && _jsx("p", { className: "text-xs text-destructive absolute", children: firstNameMsg })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", children: "Last Name" }), _jsxs("div", { className: "relative col-span-3", children: [_jsx(Input, { id: "username", value: lastName, onChange: (e) => setLastName(e.target.value) }), isLastNameError && _jsx("p", { className: "text-xs text-destructive absolute", children: lastNameMsg })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                    setOpenEditDialog(false);
                                    setPfImgFile(null);
                                    setPfImgUrl("");
                                    setFirstName(user.first_name);
                                    setLastName(user.last_name);
                                }, children: "Cancel" }), _jsx(Button, { onClick: () => handleEditUser(), children: "Save Changes" })] })] })] }));
};
export default DashboardAdminPage;