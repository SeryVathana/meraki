import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SavePostDialog from "./dialogs/SavePostDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { AlertTriangle, Ellipsis, Pen, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { getToken } from "@/utils/HelperFunctions";
const PostsContainer = ({ posts }) => {
    const [data, setData] = useState(posts);
    const handleRemovePosts = (postId) => {
        const updatedPosts = data.filter((post) => post.id !== postId);
        setData(updatedPosts);
    };
    useEffect(() => {
        setData(posts);
    }, [posts]);
    if (!data) {
        return _jsx("h1", { children: "Loading" });
    }
    return (_jsx("div", { className: "columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 xl:space-y-5 mt-3", children: data?.map((post, index) => {
            return _jsx(PostCard, { post: post, handleRemovePosts: handleRemovePosts }, index);
        }) }));
};
const PostCard = ({ post, handleRemovePosts }) => {
    const auth = useSelector((state) => state.auth);
    const [report, setReport] = useState("");
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const handleSubmitReport = () => {
        if (report.trim().length == 0) {
            toast({
                title: "Report cannot be empty.",
                description: "Please provide a reason for reporting this post.",
                variant: "destructive",
            });
            return;
        }
        // handle report
        const reqBody = {
            user_id: auth.userData.id,
            post_id: post.id,
            reason: report,
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                setIsReportOpen(false);
                setReport("");
                toast({
                    title: "Reported successfully.",
                    description: "Your report has been submitted. Post will be reviewed by our team.",
                    variant: "success",
                });
            }
            else {
                toast({
                    title: "Failed to report.",
                    description: "Please try again later.",
                    variant: "destructive",
                });
            }
        });
        // close dialog
    };
    const handleDeletePost = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/${post.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                handleRemovePosts(post.id);
                toast({
                    title: "Post deleted successfully.",
                    variant: "success",
                });
                setIsDeleteOpen(false);
            }
            else {
                toast({
                    title: "Failed to delete post.",
                    variant: "destructive",
                });
            }
        });
    };
    return (_jsxs("div", { className: "group relative border-[1px] rounded-2xl overflow-hidden cursor-pointer", children: [_jsx(SavePostDialog, { postId: post.id, isSaved: post.is_saved, type: "icon" }), _jsxs("div", { className: "hidden group-hover:flex absolute bottom-3 left-3 z-10 gap-2 items-center", onClick: () => navigate(`/user/${post.user_id}`), children: [_jsxs(Avatar, { className: "w-6 h-6", children: [_jsx(AvatarImage, { src: post.user_pf_img_url, alt: "@shadcn", className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "flex flex-col text-white", children: _jsx("h1", { className: "font-medium text-xs line-clamp-1 truncate", children: post.first_name + " " + post.last_name }) })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "absolute w-8 h-5 bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 group-hover:bg-white", children: _jsx(Ellipsis, { className: "w-5 h-5" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [auth.userData.id == post.user_id ||
                                (auth.userData.role == "admin" && (_jsxs(_Fragment, { children: [_jsx(DropdownMenuItem, { asChild: true, children: _jsx(Link, { to: `/post/edit/${post.id}`, className: "w-full py-0 text-left cursor-pointer", children: _jsxs("div", { className: "flex gap-2 justify-start items-center py-1", children: [_jsx(Pen, { className: "w-4 h-4" }), _jsx("span", { children: "Edit" })] }) }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsxs(Dialog, { open: isDeleteOpen, onOpenChange: () => setIsDeleteOpen(!isDeleteOpen), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: [_jsx(Trash, { className: "w-4 h-4" }), _jsx("span", { children: "Delete" })] }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Delete Post" }), _jsx(DialogDescription, { children: "Are you sure you want to delete this post? This action cannot be undone." }), _jsxs("div", { className: "flex gap-5 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => setIsDeleteOpen(!isDeleteOpen), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => handleDeletePost(), children: "Delete" })] })] })] }) })] }))), _jsx(DropdownMenuItem, { asChild: true, children: _jsxs(Dialog, { open: isReportOpen, onOpenChange: () => setIsReportOpen(!isReportOpen), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), _jsx("span", { children: "Report" })] }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Report Post" }), _jsx(DialogDescription, { children: "If you believe this post violates our community guidelines, please report it." }), _jsxs("div", { className: "flex flex-col gap-5", children: [_jsx(Textarea, { placeholder: "Add reason here.", className: "border-2 min-h-[150px]", value: report, onChange: (e) => setReport(e.target.value) }), _jsx(Button, { variant: "default", className: "w-full font-semibold", onClick: () => handleSubmitReport(), children: "Report" })] })] })] }) })] })] }), _jsxs("div", { onClick: () => navigate(`/post/${post.id}`), children: [_jsx("img", { className: "w-full bg-gray-300", src: post.img_url, alt: "" }), _jsx("div", { className: "hidden group-hover:flex", children: _jsx("div", { className: "absolute top-0 left-0 w-full h-full opacity-80 bg-gradient-to-t from-black to-[#80808050]" }) })] })] }, post));
};
export default PostsContainer;
