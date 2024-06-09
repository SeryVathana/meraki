import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getToken } from "@/utils/HelperFunctions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
const DeleteFolderDialog = ({ folder }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const handleDeletFolder = () => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/folder/${folder.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setIsLoading(false);
            setOpen(false);
            navigate("/profile?post=saved-posts");
        })
            .catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer", children: "Delete Folder" }) }), _jsxs(DialogContent, { className: "sm:max-w-[400px] lg:max-w-screen-sm max-h-[80vh] overflow-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "my-3 flex items-center", children: "Delete Folder" }) }), _jsx("div", { className: "", children: _jsx("p", { className: "text-sm text-gray-500", children: "Are you sure you want to delete this folder?" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-5 w-ful", children: [_jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: () => setOpen(false), children: "Cancel" }), isLoading ? (_jsx(Button, { className: "w-full", disabled: true, variant: "destructive", children: "Deleting" })) : (_jsx(Button, { className: "w-full", variant: "destructive", onClick: () => handleDeletFolder(), children: "Delete" }))] })] })] }));
};
export default DeleteFolderDialog;
