import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getToken } from "@/utils/HelperFunctions";
import { Check, Pin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
const SavePostDialog = ({ postId, isSaved, type }) => {
    const [isSavedPost, setIsSavedPost] = useState(isSaved);
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: type == "icon" ? (isSavedPost ? (_jsx(Button, { variant: "default", size: "sm", className: cn("hidden absolute top-3 right-3 z-10 group-hover:flex hover:border-primary bg-primary text-white rounded-full"), children: _jsx("h1", { className: "font-semibold", children: "Saved" }) })) : (_jsx(Button, { variant: "secondary", size: "sm", className: cn("hidden absolute top-3 right-3 z-10 rounded-full group-hover:flex"), children: _jsx("h1", { className: "font-semibold", children: "Save" }) }))) : (_jsx("button", { className: cn("w-1/2 border-r flex items-center justify-center py-3 group hover:bg-gray-50 text-gray-500", isSavedPost && "text-red-500 bg-red-50 hover:bg-red-100"), children: _jsx(Pin, { className: "w-5 h-5" }) })) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "my-3 flex items-center", children: "My Folder" }), _jsx("div", { className: "flex gap-2", children: _jsxs("div", { className: "relative w-full mr-auto", children: [_jsx(Input, { placeholder: "Search folders...", className: "pr-10 " }), _jsx(Search, { className: "absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" })] }) })] }), _jsx("div", { className: "min-h-[400px] max-h-[400px]  overflow-auto pr-2", children: _jsx(FolderContent, { postId: postId, setIsSavedPost: setIsSavedPost }) })] })] }));
};
const FolderContent = ({ postId, setIsSavedPost }) => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleSave = (folder) => {
        const reqBody = {
            post_id: postId,
            folder_id: [folder.id],
        };
        // update is_saved value of this folder in folder state
        setFolders((prev) => {
            return prev.map((f) => {
                if (f.id == folder.id) {
                    return { ...f, is_saved: !f.is_saved };
                }
                return f;
            });
        });
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/savepost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                // change is saved value of this folder in folder state
                handleFetchFolders();
            }
        });
    };
    const handleFetchFolders = () => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/folder/post/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setFolders(data.folders);
        })
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        handleFetchFolders();
    }, [postId]);
    useEffect(() => {
        const isAllFoldersNotSaved = folders.every((f) => f.is_saved == false);
        if (isAllFoldersNotSaved) {
            setIsSavedPost(false);
        }
        else {
            setIsSavedPost(true);
        }
    }, [folders]);
    if (folders.length == 0 && !isLoading) {
        return (_jsx("div", { className: "w-full h-full flex justify-center items-center", children: _jsx("h1", { children: "No Follower Found" }) }));
    }
    if (folders.length == 0 && isLoading) {
        return (_jsx("div", { className: "w-full h-full flex justify-center items-center", children: _jsx("h1", { children: "Loading..." }) }));
    }
    return (_jsx("div", { className: "flex flex-col gap-1 overflow-y-auto overflow-x-hidden", children: folders.map((folder, index) => {
            return (_jsxs("div", { className: "w-full border grid grid-cols-12 items-center rounded-lg gap-3 p-3 hover:bg-slate-100 cursor-pointer", onClick: () => handleSave(folder), children: [_jsx("div", { className: "col-span-1 text-primary flex justify-center items-center bg-slate-50 border w-7 h-7 rounded", children: folder.is_saved && _jsx(Check, {}) }), _jsx("h1", { className: "text-lg col-span-11", children: folder.title })] }, index));
        }) }));
};
export default SavePostDialog;
