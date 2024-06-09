import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
const EditFolderDialog = ({ folder, handleFetchFolderInfo }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const formSchema = z.object({
        title: z.string({ required_error: "Name is required" }).min(3, "Group name must 3 characters long.").max(50),
        description: z.string().optional().or(z.literal("")),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: folder.title,
            description: folder.description || "",
        },
    });
    async function onSubmit(values) {
        const reqBody = {
            title: values.title,
            description: values.description,
            status: "private",
        };
        setIsLoading(true);
        await fetch(`${import.meta.env.VITE_SERVER_URL}/folder/${folder.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            setIsLoading(false);
            handleFetchFolderInfo();
            setOpen(false);
        })
            .catch((err) => console.log(err));
    }
    return (_jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer", children: "Edit Folder" }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm max-h-[80vh] overflow-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "my-3 flex items-center", children: "Edit Folder" }) }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 ", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { className: "grid grid-cols-3 items-center", children: [_jsx(FormLabel, { className: "col-span-1", children: "Folder Name" }), _jsx(FormControl, { className: "col-span-2", children: _jsx(Input, { placeholder: "Edit title", type: "text", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (_jsxs(FormItem, { className: "grid grid-cols-3 items-center", children: [_jsx(FormLabel, { className: "col-span-1", children: "Folder Description" }), _jsx(FormControl, { className: "col-span-2", children: _jsx(Textarea, { placeholder: "Edit description", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "grid grid-cols-3 gap-5", children: [_jsx("div", {}), _jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: () => setOpen(false), children: "Cancel" }), isLoading ? (_jsx(Button, { className: "w-full", disabled: true, children: "Saving" })) : (_jsx(Button, { type: "submit", className: "w-full", children: "Save changes" }))] })] }) })] })] }));
};
export default EditFolderDialog;
