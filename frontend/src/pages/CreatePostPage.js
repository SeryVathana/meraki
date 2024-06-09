import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import TagDropDown from "@/components/TagDropDown";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
});
const CreatePostPage = () => {
    const [uploadFile, setUploadFile] = useState(null);
    const [tempImgURL, setTempImgURL] = useState("");
    const [status, setStatus] = useState("public");
    const [selectedTag, setSelectedTag] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });
    async function onSubmit(values) {
        if (!uploadFile)
            return;
        const tags = selectedTag.map((tag) => tag.id);
        const fileName = `user-uploaded/${uploadFile} - ${new Date().getTime()}`;
        const imgs = ref(storage, fileName);
        const uploadDisplay = await uploadBytes(imgs, uploadFile);
        const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
        const reqBody = {
            group_id: null,
            title: values.title,
            description: values.description,
            status: status,
            tag: JSON.stringify(tags),
            img_url: imgDownloadURL,
        };
        setIsLoading(true);
        await fetch(`${import.meta.env.VITE_SERVER_URL}/post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            setIsLoading(false);
            toast({
                title: "Successfully published post.",
                variant: "success",
                description: "Your post is now live.",
            });
            setUploadFile(null);
            setTempImgURL("");
            setSelectedTag([]);
            form.clearErrors();
            form.reset();
        })
            .catch((err) => {
            console.log(err);
            setIsLoading(false);
            toast({
                title: "Failed to publish post.",
                variant: "destructive",
                description: "Please try again later.",
            });
        });
    }
    function handleTempFileUpload(e) {
        setUploadFile(e.target.files[0]);
        const url = URL.createObjectURL(e.target.files[0]);
        setTempImgURL(url);
    }
    function handleRemoveTempImg() {
        setUploadFile(null);
        setTempImgURL("");
    }
    return (_jsxs("div", { className: "w-full h-auto", children: [_jsx("div", { className: "w-full flex justify-center my-10", children: _jsx("h1", { className: "font-semibold text-3xl", children: "Create Post" }) }), _jsxs("div", { className: "max-w-screen-xl min-h-[500px] mx-auto flex gap-20 justify-center", children: [_jsx("div", { className: "w-1/2 max-w-[500px] h-full flex justify-center", children: tempImgURL ? (_jsxs("div", { className: "h-[500px] rounded-2xl overflow-hidden relative border", children: [_jsx("img", { src: tempImgURL, alt: tempImgURL, className: "w-full h-full object-contain" }), _jsx(Button, { size: "icon", variant: "outline", className: "absolute top-5 right-5", onClick: () => handleRemoveTempImg(), children: _jsx(X, { className: "w-5" }) })] })) : (_jsxs("div", { className: "w-full h-[500px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border border-dashed border-gray-200", children: [_jsx("input", { type: "file", className: "absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer", onChange: (e) => handleTempFileUpload(e) }), _jsx(Upload, { className: "my-5" }), _jsx("h3", { className: "font-medium text-xl", children: _jsxs("label", { htmlFor: "file-upload", className: "relative cursor-pointer ", children: [_jsx("span", { children: "Drag and drop" }), _jsx("span", { className: "text-indigo-600", children: " or browse " }), _jsx("span", { children: "to upload" })] }) })] })) }), _jsx("div", { className: "w-1/2 max-w-[500px] h-full ", children: _jsx("div", { className: "", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 ", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Add title", type: "text", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "description", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Description" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Add description", className: "max-h-[200px]", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(FormLabel, { children: "Post privacy" }), _jsx("div", { className: "flex gap-5", children: _jsxs(Select, { value: status, onValueChange: (value) => setStatus(value), children: [_jsx(SelectTrigger, { className: "w-fit", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "public", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Globe, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Public" })] }) }), _jsx(SelectItem, { value: "private", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Lock, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Private" })] }) })] })] }) })] }), _jsx(TagDropDown, { selectedTags: selectedTag, setSelectedTags: setSelectedTag }), _jsx("div", { className: "w-full flex justify-end", children: _jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Loading" : "Publish" }) })] }) }) }) })] })] }));
};
export default CreatePostPage;
