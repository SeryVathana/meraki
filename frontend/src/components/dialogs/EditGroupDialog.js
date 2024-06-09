import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, LoaderCircle, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
const EditGroupDialog = ({ group, handleFetchGroupInfo, type }) => {
    const [open, setOpen] = useState(false);
    if (!group)
        return null;
    return (_jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: type == "button" ? (_jsx(Button, { variant: "secondary", className: "rounded-full px-0", children: "Edit Group" })) : (_jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ", children: "Edit Group" })) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm max-h-[80vh] overflow-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "my-3 flex items-center", children: "Edit Group" }) }), _jsx(EditGroupContent, { group: group, setOpenDialog: setOpen, handleFetchGroupInfo: handleFetchGroupInfo })] })] }));
};
const EditGroupContent = ({ group, setOpenDialog, handleFetchGroupInfo }) => {
    const formSchema = z.object({
        title: z.string({ required_error: "Name is required" }).min(3, "Group name must 3 characters long.").max(50),
    });
    const [uploadProfileFile, setUploadProfileFile] = useState(null);
    const [tempProfileImgURL, setTempProfileImgURL] = useState(group.img_url);
    const [status, setStatus] = useState(group.status);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: group.title,
        },
    });
    async function onSubmit(values) {
        let imgDownloadURL = "";
        setIsLoading(true);
        if (uploadProfileFile) {
            const fileName = `user-uploaded/${uploadProfileFile} - ${new Date().getTime()}`;
            const imgs = ref(storage, fileName);
            const uploadDisplay = await uploadBytes(imgs, uploadProfileFile);
            imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
        }
        const reqBody = {
            title: values.title,
            status: status,
            img_url: imgDownloadURL != "" ? imgDownloadURL : null,
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/${group.id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => { })
            .finally(() => {
            setIsLoading(false);
            setOpenDialog(false);
            handleFetchGroupInfo();
        });
    }
    function handleTempProfileFileUpload(e) {
        setUploadProfileFile(e.target.files[0]);
        const url = URL.createObjectURL(e.target.files[0]);
        setTempProfileImgURL(url);
    }
    function handleRemoveTempProfileImg() {
        setUploadProfileFile(null);
        setTempProfileImgURL("");
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "", children: _jsxs("div", { className: "", children: [_jsxs("div", { className: "grid grid-cols-3 my-10 items-center", children: [_jsx(Label, { className: "", children: "Group Image" }), tempProfileImgURL ? (_jsx("div", { className: "flex justify-center w-full col-span-2", children: _jsxs("div", { className: "w-40 h-40 relative", children: [_jsx("div", { className: "rounded-full overflow-hidden w-full h-full border-4", children: _jsx("img", { src: tempProfileImgURL, alt: tempProfileImgURL, className: "w-full h-full object-cover" }) }), _jsx(Button, { size: "icon", variant: "destructive", className: "absolute top-1 right-1 rounded-full", onClick: () => handleRemoveTempProfileImg(), children: _jsx(X, { className: "w-5" }) })] }) })) : (_jsx("div", { className: "flex justify-center w-full col-span-2", children: _jsxs("div", { className: "w-40 h-40 relative   bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200", children: [_jsx("input", { type: "file", className: "absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer", onChange: (e) => handleTempProfileFileUpload(e) }), _jsx(Upload, { className: "my-5" })] }) }))] }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 ", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { className: "grid grid-cols-3 items-center", children: [_jsx(FormLabel, { className: "col-span-1", children: "Group Name" }), _jsx(FormControl, { className: "col-span-2", children: _jsx(Input, { placeholder: "Add title", type: "text", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "grid grid-cols-3 items-center", children: [_jsx(FormLabel, { className: "col-span-1", children: "Group privacy" }), _jsx("div", { className: "flex gap-5 col-span-2", children: _jsxs(Select, { value: status, onValueChange: (value) => setStatus(value), children: [_jsx(SelectTrigger, { className: "", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "public", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Globe, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Public" })] }) }), _jsx(SelectItem, { value: "private", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Lock, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Private" })] }) })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-5", children: [_jsx("div", {}), _jsx(Button, { type: "submit", variant: "outline", className: "w-full", onClick: () => setOpenDialog(false), children: "Cancel" }), isLoading ? (_jsx(Button, { className: "w-full", disabled: true, children: "Saving" })) : (_jsx(Button, { type: "submit", className: "w-full", children: "Save changes" }))] })] }) })] }) }), _jsx(DeleteGroupContent, { group: group })] }));
};
const DeleteGroupContent = ({ group }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const { toast } = useToast();
    function handleDeleteGroup() {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/${group.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            setIsLoading(false);
            if (data.status == 200) {
                navigate("/tag/all");
                toast({ title: "Success.", description: "Group deleted successfully.", variant: "success" });
            }
            else {
                setOpenDialog(false);
                toast({ title: "Something went wrong.", description: "Failed to delete group. Please try again.", variant: "destructive" });
            }
        })
            .catch((err) => {
            toast({ title: "Something went wrong.", description: "Failed to delete group. Please try again.", variant: "destructive" });
        });
    }
    return (_jsx("div", { children: _jsx("div", { className: "", children: _jsxs("div", { className: "", children: [_jsxs(DialogHeader, { className: "mb-5 mt-16", children: [_jsx(DialogTitle, { children: "Delete group" }), _jsx(DialogDescription, { children: "Are you sure you want to delete this group? This action cannot be undone." })] }), _jsx("div", { className: "grid grid-cols-3 gap-5", children: isLoading ? (_jsx(Button, { className: "w-full", disabled: true, variant: "destructive", children: _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx(LoaderCircle, { className: "animate-spin" }), _jsx("span", { children: "Deleting" })] }) })) : (_jsxs(Dialog, { open: openDialog, onOpenChange: () => setOpenDialog(!openDialog), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", className: "w-full", children: "Delete Group" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "my-3 flex items-center", children: "Delete Group" }), _jsx(DialogDescription, { children: "Not twice but thrice now." })] }), _jsxs("div", { className: "grid grid-cols-3 gap-5", children: [_jsx(Button, { variant: "outline", className: "w-full", onClick: () => setOpenDialog(false), children: "Cancel" }), _jsx(Button, { className: "w-full", variant: "destructive", onClick: () => handleDeleteGroup(), children: "Delete Group" })] })] })] })) })] }) }) }));
};
export default EditGroupDialog;
