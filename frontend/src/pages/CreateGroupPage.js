import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, LoaderCircle, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const formSchema = z.object({
    title: z.string({ required_error: "Name is required" }).trim().min(3, "Group name must 3 characters long.").max(50),
});
const CreateGroupPage = () => {
    const navigate = useNavigate();
    const [uploadProfileFile, setUploadProfileFile] = useState(null);
    const [tempProfileImgURL, setTempProfileImgURL] = useState("");
    const [status, setStatus] = useState("public");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    async function onSubmit(values) {
        if (isLoading)
            return;
        setIsLoading(true);
        const fileName = `user-uploaded/${uploadProfileFile} - ${new Date().getTime()}`;
        const imgs = ref(storage, fileName);
        const uploadDisplay = await uploadBytes(imgs, uploadProfileFile);
        const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
        const reqBody = {
            title: values.title,
            status: status,
            img_url: imgDownloadURL,
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/group`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                toast({
                    title: "Successfully created group.",
                    variant: "success",
                    description: "Your group is now live.",
                });
                setUploadProfileFile(null);
                setTempProfileImgURL("");
                setStatus("public");
                form.clearErrors();
                form.reset();
                setTimeout(() => {
                    navigate(`/group/${data.id}`);
                }, 1000);
            }
            else {
                toast({
                    title: "Failed to created group.",
                    variant: "destructive",
                    description: "Please try again.",
                });
            }
        })
            .finally(() => {
            setIsLoading(false);
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
    return (_jsxs("div", { className: "w-full h-auto mb-10", children: [_jsx("div", { className: "w-full flex justify-center my-10", children: _jsx("h1", { className: "font-semibold text-3xl", children: "Create New Group" }) }), _jsxs("div", { className: "flex flex-col justify-center items-center max-w-screen-md mx-auto space-y-8", children: [_jsx("div", { children: tempProfileImgURL ? (_jsxs("div", { className: "w-40 h-40 relative", children: [_jsx("div", { className: "rounded-full overflow-hidden w-full h-full border-4", children: _jsx("img", { src: tempProfileImgURL, alt: tempProfileImgURL, className: "w-full h-full object-cover" }) }), _jsx(Button, { size: "icon", variant: "destructive", className: "absolute top-1 right-1 rounded-full", onClick: () => handleRemoveTempProfileImg(), children: _jsx(X, { className: "w-5" }) })] })) : (_jsxs("div", { className: "w-40 h-40 relative bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200", children: [_jsx("input", { type: "file", className: "absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer", onChange: (e) => handleTempProfileFileUpload(e) }), _jsx(Upload, { className: "my-5" })] })) }), _jsx("div", { className: "w-3/4 h-full", children: _jsx("div", { className: "", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 ", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Group Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Add title", type: "text", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex flex-col gap-3 w-full", children: [_jsx(FormLabel, { children: "Group privacy" }), _jsx("div", { className: "flex gap-5", children: _jsxs(Select, { value: status, onValueChange: (value) => setStatus(value), children: [_jsx(SelectTrigger, { className: "w-1/2", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "public", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Globe, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Public" })] }) }), _jsx(SelectItem, { value: "private", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Lock, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Private" })] }) })] })] }) })] }), _jsx("div", { className: "flex", children: _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx(LoaderCircle, { className: "animate-spin" }), _jsx("span", { children: "Creating..." })] })) : ("Create group") }) })] }) }) }) })] })] }));
};
export default CreateGroupPage;
