import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import TagDropDown from "@/components/TagDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, LoaderCircle, Lock, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const EditPostPage = () => {
    const [uploadFile, setUploadFile] = useState(null);
    const [tempImgURL, setTempImgURL] = useState("");
    const [status, setStatus] = useState("public");
    const [selectedTag, setSelectedTag] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isFetching, setIsFetching] = useState(true);
    const { postId } = useParams();
    const handleFetchPostDetail = () => {
        setIsFetching(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            const post = data.post;
            setTitle(post.title);
            setDescription(post.description);
            setStatus(post.status);
            setTempImgURL(post.img_url);
            setSelectedTag(post.tags);
        })
            .finally(() => setIsFetching(false));
    };
    async function handleSave() {
        setIsLoading(true);
        const tags = selectedTag.map((tag) => tag.id);
        let imgURL = tempImgURL;
        if (uploadFile) {
            const fileName = `user-uploaded/${uploadFile} - ${new Date().getTime()}`;
            const imgs = ref(storage, fileName);
            const uploadDisplay = await uploadBytes(imgs, uploadFile);
            imgURL = await getDownloadURL(uploadDisplay.ref);
        }
        const reqBody = {
            group_id: null,
            title: title,
            description: description,
            status: status,
            tags: JSON.stringify(tags),
            img_url: imgURL,
        };
        await fetch(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, {
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
            toast({
                title: "Successfully update post.",
                variant: "success",
                description: "Your post is now updated.",
            });
        })
            .catch((err) => {
            console.log(err);
            setIsLoading(false);
            toast({
                title: "Failed to update post.",
                variant: "destructive",
                description: "Please try again later.",
            });
        });
        setUploadFile(null);
        setTempImgURL("");
        setSelectedTag([]);
        handleFetchPostDetail();
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
    useEffect(() => {
        handleFetchPostDetail();
    }, []);
    if (isFetching) {
        return (_jsxs("div", { className: "w-full h-[80vh] flex flex-col justify-center items-center gap-2", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    return (_jsxs("div", { className: "w-full h-auto", children: [_jsx("div", { className: "w-full flex justify-center my-10", children: _jsx("h1", { className: "font-semibold text-3xl", children: "Edit Post" }) }), _jsxs("div", { className: "max-w-screen-xl min-h-[500px] mx-auto flex gap-20 justify-center", children: [_jsx("div", { className: "w-1/2 max-w-[500px] h-full flex justify-center", children: tempImgURL ? (_jsxs("div", { className: "h-[500px] rounded-2xl overflow-hidden relative border", children: [_jsx("img", { src: tempImgURL, alt: tempImgURL, className: "w-full h-full object-contain" }), _jsx(Button, { size: "icon", variant: "outline", className: "absolute top-5 right-5", onClick: () => handleRemoveTempImg(), children: _jsx(X, { className: "w-5" }) })] })) : (_jsxs("div", { className: "w-full h-[500px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border border-dashed border-gray-200", children: [_jsx("input", { type: "file", className: "absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer", onChange: (e) => handleTempFileUpload(e) }), _jsx(Upload, { className: "my-5" }), _jsx("h3", { className: "font-medium text-xl", children: _jsxs("label", { htmlFor: "file-upload", className: "relative cursor-pointer ", children: [_jsx("span", { children: "Drag and drop" }), _jsx("span", { className: "text-indigo-600", children: " or browse " }), _jsx("span", { children: "to upload" })] }) })] })) }), _jsx("div", { className: "w-1/2 max-w-[500px] h-full ", children: _jsx("div", { className: "", children: _jsxs("form", { className: "space-y-8 ", children: [_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Label, { children: "Title" }), _jsx(Input, { placeholder: "Add title", type: "text", value: title, onChange: (e) => setTitle(e.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Label, { children: "Description" }), _jsx(Textarea, { placeholder: "Add description", className: "max-h-[200px]", value: description || "", onChange: (e) => setDescription(e.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Label, { children: "Post privacy" }), _jsx("div", { className: "flex gap-5", children: _jsxs(Select, { value: status, onValueChange: (value) => setStatus(value), children: [_jsx(SelectTrigger, { className: "w-fit", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "public", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Globe, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Public" })] }) }), _jsx(SelectItem, { value: "private", children: _jsxs("div", { className: "flex items-center gap-2 mr-3", children: [_jsx(Lock, { className: "h-4 text-gray-600" }), _jsx("p", { children: "Private" })] }) })] })] }) })] }), _jsx(TagDropDown, { selectedTags: selectedTag, setSelectedTags: setSelectedTag }), _jsx("div", { className: "w-full flex justify-end", children: _jsx(Button, { type: "submit", disabled: isLoading, onClick: () => handleSave(), children: isLoading ? "Loading" : "Save Changes" }) })] }) }) })] })] }));
};
export default EditPostPage;
