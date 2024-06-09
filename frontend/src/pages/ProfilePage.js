import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PostsContainer from "@/components/PostsContainer";
import CreateFolderDialog from "@/components/dialogs/CreateFolderDialog";
import FollowerDialog from "@/components/dialogs/FollowerDialog";
import FollowingDialog from "@/components/dialogs/FollowingDialog";
import GroupsDialog from "@/components/dialogs/GroupsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hook";
import { fetchUserData } from "@/redux/slices/authThunk";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
const ProfilePage = () => {
    const auth = useSelector((state) => state.auth);
    const [params] = useSearchParams("my-posts");
    const [posts, setPosts] = useState([]);
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [pfImgFile, setPfImgFile] = useState(null);
    const [pfImgUrl, setPfImgUrl] = useState("");
    const dispatch = useAppDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const user = auth?.userData;
    const postParam = params.get("post");
    const getFullName = () => {
        if (auth?.userData.first_name && auth?.userData.last_name) {
            return `${capitalizeFirstLetter(auth?.userData.first_name)} ${capitalizeFirstLetter(auth?.userData.last_name)}`;
        }
        else {
            return auth?.userData.email;
        }
    };
    const handleUploadImage = (e) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file) {
            setPfImgFile(file);
            setPfImgUrl(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/mypost`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => setPosts(data.posts))
            .finally(() => setIsLoading(false));
    }, [auth.token]);
    const handleFetchFolders = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/folder`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setFolders(data.folders);
        });
    };
    const handleChangeUserPfImg = async () => {
        if (!pfImgFile || isUploading)
            return;
        setIsUploading(true);
        const fileName = `user-uploaded/${pfImgFile} - ${new Date().getTime()}`;
        const imgs = ref(storage, fileName);
        const uploadDisplay = await uploadBytes(imgs, pfImgFile);
        const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
        fetch(`${import.meta.env.VITE_SERVER_URL}/user/updatepf`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ pf_img_url: imgDownloadURL }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                dispatch(fetchUserData());
                setOpen(false);
            }
        })
            .finally(() => setIsUploading(false));
    };
    useEffect(() => {
        // fetch my folders
        if (postParam === "saved-posts") {
            handleFetchFolders();
        }
    }, [postParam]);
    return (_jsxs("div", { className: "min-h-[100vh]", children: [_jsxs("div", { className: "flex flex-col items-center my-10 space-y-2", children: [_jsx("div", { className: "flex items-center justify-center w-full", children: _jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Avatar, { className: "w-32 h-32 border cursor-pointer hover:border-4 border-gray-200", children: [_jsx(AvatarImage, { src: user.pf_img_url ? user.pf_img_url : "", className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Change Profile Picture" }), _jsx("div", { className: "flex justify-center gap-5 p-5", children: _jsxs("label", { htmlFor: "dropzone-file", className: "w-32 h-32 rounded-full relative group cursor-pointer", children: [_jsxs(Avatar, { className: "w-32 h-32 border group-hover:border-4 border-gray-200", children: [_jsx(AvatarImage, { src: pfImgUrl ? pfImgUrl : user.pf_img_url, referrerPolicy: "no-referrer", className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "absolute inset-0 group-hover:bg-black/20 rounded-full\r\n                    transition-all duration-300\r\n                  " }), _jsx("div", { className: "absolute right-0 top-0 bg-gray-200 p-2 rounded-full", children: _jsx(Pencil, { className: " w-5 h-5" }) }), _jsx("input", { id: "dropzone-file", type: "file", className: "hidden", onChange: handleUploadImage, accept: "image/png, image/jpeg" })] }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "secondary", onClick: () => setOpen(false), children: "Cancel" }), isUploading ? (_jsx(Button, { variant: "default", className: "cursor-not-allowed", disabled: true, children: "Uploading..." })) : (_jsx(Button, { onClick: () => handleChangeUserPfImg(), children: "Save Change" }))] })] })] }) }), _jsx("div", { className: "max-w-10px", children: _jsx("h1", { className: "text-4xl font-bold tracking-tight lg:text-3xl break-words text-wrap", children: getFullName() }) }), _jsx("h3", { className: "text-slate-500", children: user?.email }), _jsxs("div", { className: "flex gap-5", children: [_jsx(FollowerDialog, { user: user }), _jsx(FollowingDialog, { user: user })] }), _jsxs("div", { className: "flex gap-5", children: [_jsx(GroupsDialog, { userId: user.id, type: "button" }), _jsx(Button, { className: "rounded-full", onClick: () => navigate("/profile/setting"), children: "Edit Profile" })] }), _jsxs("div", { className: "flex gap-10 pt-10", children: [_jsx(NavLink, { to: "/profile?post=my-posts", className: cn(postParam === "my-posts" || !postParam ? "underline text-primary" : ""), children: "Created" }), _jsx(NavLink, { to: "/profile?post=saved-posts", className: cn(postParam === "saved-posts" ? "underline  text-primary" : ""), children: "Saved" })] })] }), postParam === "my-posts" || !postParam ? (posts && posts.length > 0 ? (_jsx(PostsContainer, { posts: posts })) : (_jsx("div", { className: "flex py-10 w-full justify-center", children: isLoading ? (_jsx("div", { className: "my-5 w-full columns-2  md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 xl:space-y-5 mt-3", children: Array.from({ length: 10 }, (_, index) => {
                        return _jsx(Skeleton, { className: cn("min-h-[200px] rounded-xl") }, index);
                    }) })) : (_jsx("h1", { children: "No post found." })) }))) : (_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5", children: [_jsx("div", { className: "min-h-[300px]", children: _jsx(CreateFolderDialog, { handleFetchFolders: handleFetchFolders }) }), folders.map((folder, index) => {
                        return (_jsxs("div", { onClick: () => navigate(`/folder/${folder.id}`), className: "group border-[1px] min-h-[250px] xl:min-h-[300px] max-h-[300px] relative group cursor-pointer flex flex-col rounded-xl overflow-hidden", children: [_jsx("div", { className: "hidden group-hover:flex group-hover:border justify-center items-center absolute w-full h-full bg-slate-100 bg-opacity-80 transition-opacity hover:opacity-100 opacity-0 duration-200", children: _jsx("h1", { className: "max-w-[100px] max-h-[100px] truncate text-wrap text-center font-semibold", children: folder.title }) }), _jsx("div", { className: "w-full h-1/2 border-r-[1px]", children: _jsx("img", { src: folder.saved_posts[0]?.img_url || "/placeholder.svg", alt: "", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "w-full h-1/2 flex border-t-[1px]", children: [_jsx("div", { className: "w-1/2 h-full border-r-[1px]", children: _jsx("img", { src: folder?.saved_posts[1]?.img_url || "/placeholder.svg", alt: "", className: "w-full h-full object-cover" }) }), _jsx("div", { className: "w-1/2 h-full ", children: _jsx("img", { src: folder?.saved_posts[2]?.img_url || "/placeholder.svg", alt: "", className: "w-full h-full object-cover" }) })] })] }, index));
                    })] }))] }));
};
export default ProfilePage;
