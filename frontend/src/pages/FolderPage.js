import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import EditFolderDialog from "@/components/dialogs/EditFolderDialog";
import DeleteFolderDialog from "@/components/dialogs/DeleteFolderDialog";
const FolderPage = () => {
    const [folder, setFolder] = useState(null);
    const [savedPosts, setSavedPosts] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const idParam = useParams().id;
    const navigate = useNavigate();
    const handleFetchFolderInfo = () => {
        // fetch folder info
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/folder/${idParam}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setFolder(data.folder);
        })
            .catch((err) => {
            console.log(err);
        })
            .finally(() => {
            setIsLoading(false);
        });
    };
    const handleFetchSavedPosts = () => {
        if (!folder) {
            return;
        }
        // fetch saved posts
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/savedPosts/${folder.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setSavedPosts(data.posts);
        })
            .catch((err) => {
            console.log(err);
        });
    };
    const handleSavePost = (postId) => {
        // remove this post from saved posts state
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/savepost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                post_id: postId,
                folder_id: [folder.id],
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status === 200) {
                setSavedPosts(savedPosts.filter((post) => post.id !== postId));
            }
        })
            .catch((err) => {
            console.log(err);
        });
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        handleFetchFolderInfo();
    }, []);
    useEffect(() => {
        handleFetchSavedPosts();
    }, [folder]);
    if (isLoading) {
        return _jsx("h1", { children: "Loading..." });
    }
    if (!isLoading && !folder) {
        return _jsx(Navigate, { to: "/404" });
    }
    return (_jsxs("div", { className: "mb-10 mt-5", children: [_jsxs("div", { className: "mb-10 space-y-5", children: [_jsxs("div", { className: "flex gap-5 justify-center items-center", children: [_jsx("h1", { className: "text-center text-xl font-semibold", children: folder.title }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "secondary", size: "icon", children: _jsx(MoreHorizontalIcon, { className: "w-5 h-5" }) }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { asChild: true, children: _jsx(EditFolderDialog, { folder: folder, handleFetchFolderInfo: handleFetchFolderInfo }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(DeleteFolderDialog, { folder: folder }) })] })] })] }), _jsx("p", { className: "text-center max-w-[600px] mx-auto text-muted-foreground", children: folder.description })] }), savedPosts && savedPosts.length > 0 ? (_jsx("div", { className: "columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-5 xl:px-10 2xl:px-0 gap-5 space-y-5 mt-3", children: savedPosts?.map((post, index) => {
                    return (_jsxs("div", { className: "group relative border-[1px] rounded-2xl overflow-hidden cursor-pointer", children: [_jsx(Button, { variant: "destructive", size: "sm", className: cn("hidden absolute top-3 right-3 z-10 group-hover:flex hover:border-primary text-white rounded-full"), onClick: () => handleSavePost(post.id), children: _jsx("h1", { className: "font-semibold", children: "Unsave" }) }), _jsxs("div", { className: "hidden group-hover:flex absolute bottom-3 left-3 z-10 gap-2 items-center", onClick: () => navigate(`/user/${1}`), children: [_jsxs(Avatar, { className: "w-6 h-6", children: [_jsx(AvatarImage, { src: post.user_pf_img_url, alt: "@shadcn" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "flex flex-col text-white ", children: _jsx("h1", { className: "font-medium text-sm", children: capitalizeFirstLetter(post.user_name) }) })] }), _jsxs("div", { onClick: () => navigate(`/post/${post.id}`), children: [_jsx("img", { className: "w-full bg-gray-300", src: post.img_url, alt: "" }), _jsx("div", { className: "hidden group-hover:flex", children: _jsx("div", { className: "absolute top-0 left-0 w-full h-full opacity-80 bg-gradient-to-t from-black to-[#80808050]" }) })] }, index)] }, index));
                }) })) : (_jsx("h1", { className: "text-center", children: "No posts saved in this folder" }))] }));
};
export default FolderPage;
