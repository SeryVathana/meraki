import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
    title: z.string().min(1, "Title is required. Please input any title.").max(24, "Title must be equal or less than 24 characters."),
    description: z.string().max(500, "Description must be equal or less than 24 characters.").optional(),
});
const CreateFolderDialog = ({ handleFetchFolders }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });
    function onSubmit(values) {
        const reqBody = {
            title: values.title,
            description: values.description,
            status: "private",
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/folder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchFolders();
        })
            .catch((err) => console.log(err));
        setOpenDialog(false);
    }
    return (_jsxs(Dialog, { open: openDialog, onOpenChange: () => setOpenDialog(!openDialog), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "border-[1px] h-full relative group cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-xl overflow-hidden flex justify-center items-center", children: _jsx(Plus, { className: "w-10 h-10 text-slate-500" }) }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Create New Folder" }) }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 ", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { className: "", children: [_jsx(FormLabel, { children: "Title (required)" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Add title here", type: "text", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Description (optional)" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Add description here", className: "max-h-[200px]", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", className: "float-end", children: "Create" })] }) })] })] }));
};
export default CreateFolderDialog;
