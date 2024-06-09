import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import TagDropDown from "../TagDropDown";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
const CreateGroupPostDialog = ({ group, handleFetchGroupPosts }) => {
    const [uploadFile, setUploadFile] = useState(null);
    const [tempImgURL, setTempImgURL] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTag, setSelectedTag] = useState([]);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    async function onSubmit() {
        if (!uploadFile)
            return;
        const tags = selectedTag.map((tag) => tag.id);
        const fileName = `user-uploaded/${uploadFile} - ${new Date().getTime()}`;
        const imgs = ref(storage, fileName);
        const uploadDisplay = await uploadBytes(imgs, uploadFile);
        const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
        const reqBody = {
            group_id: group.id,
            title: title,
            description: description,
            status: group.status,
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
            handleFetchGroupPosts();
        })
            .catch((err) => {
            setIsLoading(false);
            toast({
                title: "Failed to publish post.",
                variant: "destructive",
                description: "Please try again later.",
            });
        });
        setUploadFile(null);
        setTempImgURL("");
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
    if (!group) {
        return (_jsx("div", { className: "w-full h-[80vh] flex justify-center items-center", children: _jsx("h1", { children: "Loading..." }) }));
    }
    return (_jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "default", className: "", children: "Create Post" }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Create Post" }) }), _jsx("div", { className: " flex justify-center", children: tempImgURL ? (_jsxs("div", { className: "w-full h-[300px] rounded-2xl overflow-hidden relative border-[1px] bg-gray-200", children: [_jsx("img", { src: tempImgURL, alt: tempImgURL, className: "h-full object-contain mx-auto" }), _jsx(Button, { size: "icon", variant: "destructive", className: "absolute top-3 right-3 rounded-lg hover:bg-red-400 hover:border-[1px]", onClick: () => handleRemoveTempImg(), children: _jsx(X, { className: "w-5" }) })] })) : (_jsxs("div", { className: "w-full h-[300px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200", children: [_jsx("input", { type: "file", className: "absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer", onChange: (e) => handleTempFileUpload(e) }), _jsx(Upload, { className: "my-5" }), _jsx("h3", { className: "font-medium text-xl", children: _jsxs("label", { htmlFor: "file-upload", className: "relative cursor-pointer ", children: [_jsx("span", { children: "Drag and drop" }), _jsx("span", { className: "text-indigo-600", children: " or browse " }), _jsx("span", { children: "to upload" })] }) })] })) }), _jsxs("div", { className: "space-y-4 ", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Post Title" }), _jsx(Input, { placeholder: "Hi" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Post Description" }), _jsx(Textarea, { placeholder: "Description" })] }), _jsx(TagDropDown, { selectedTags: selectedTag, setSelectedTags: setSelectedTag }), _jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { className: "float-end", disabled: isLoading || !tempImgURL, onClick: () => onSubmit(), children: "Submit Post" }) })] })] })] }));
};
export default CreateGroupPostDialog;
