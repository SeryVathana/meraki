import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getToken } from "@/utils/HelperFunctions";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { format, formatDistance } from "date-fns";
import { AlertTriangle, ChevronRight, Ellipsis, Heart, LoaderCircle, MessageCircle, Pen, SendHorizonal, Trash, Users, } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import SavePostDialog from "@/components/dialogs/SavePostDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import PostsContainer from "@/components/PostsContainer";
const PostDetailPage = () => {
    const auth = useSelector((state) => state.auth);
    const { postId } = useParams();
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [inputComment, setInputComment] = useState("");
    const [inputReply, setInputReply] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [replyToId, setReplyToId] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [report, setReport] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const [posts, setPosts] = useState([]);
    const { toast } = useToast();
    const navigate = useNavigate();
    const handleMakeReply = (cmtId) => {
        if (replyToId != cmtId) {
            setIsReplying(true);
            setReplyToId(cmtId);
            return;
        }
        if (isReplying) {
            setIsReplying(false);
            setReplyToId("");
        }
        else {
            setIsReplying(true);
            setReplyToId(cmtId);
        }
    };
    const handlePostComment = (postId, comment) => {
        if (comment) {
            fetch(`${import.meta.env.VITE_SERVER_URL}/comment`, {
                method: "POST",
                body: JSON.stringify({ post_id: postId, comment }),
                headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                if (data.status == 200) {
                    handleFetchComments();
                }
            });
            setInputComment("");
        }
    };
    const handlePostReply = (cmtId, comment) => {
        if (comment.trim()) {
            fetch(`${import.meta.env.VITE_SERVER_URL}/comment/${cmtId}/reply`, {
                method: "POST",
                body: JSON.stringify({ comment }),
                headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                if (data.status == 200) {
                    handleFetchComments();
                }
            });
            setIsReplying(false);
            setInputReply("");
        }
    };
    const handleToggleLikePost = (postId) => {
        setIsLiking(true);
        if (!isLiked) {
            setIsLiked(true);
            fetch(`${import.meta.env.VITE_SERVER_URL}/post/like/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                if (data.status == 200) {
                    handleFetchPost();
                }
            })
                .finally(() => setIsLiking(false));
        }
        else {
            setIsLiked(false);
            fetch(`${import.meta.env.VITE_SERVER_URL}/post/like/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                if (data.status == 200) {
                    handleFetchPost();
                }
            })
                .finally(() => setIsLiking(false));
        }
    };
    const handleFetchComments = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/comment/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setComments(data.comments);
        })
            .finally(() => setIsLoadingComments(false));
    };
    const handleFetchPost = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => setPost(data.post))
            .finally(() => setIsLoading(false));
    };
    const handleFetchRelatedPosts = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/related/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => setPosts(data.relatedPosts));
    };
    const handleSubmitReport = () => {
        if (isReporting)
            return;
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
                navigate("/profile");
                toast({
                    title: "Post deleted successfully.",
                    variant: "success",
                });
            }
            else {
                toast({
                    title: "Failed to delete post.",
                    variant: "destructive",
                });
            }
        });
    };
    useEffect(() => {
        setIsLoading(true);
        handleFetchPost();
        handleFetchRelatedPosts();
        window.scrollTo(0, 0);
    }, [postId]);
    useEffect(() => {
        if (isLoadingComments)
            return;
        setIsLoadingComments(true);
        handleFetchComments();
    }, [postId]);
    useEffect(() => {
        setIsLiked(post?.is_liked);
    }, [post]);
    useEffect(() => {
        // calculate total comment length with replies
        let totalComments = 0;
        comments.forEach((comment) => {
            totalComments += comment.replies.length + 1;
        });
        setTotalComments(totalComments);
    }, [comments]);
    if (isLoading && !post) {
        return (_jsxs("div", { className: "w-full h-[80vh] flex flex-col justify-center items-center gap-2", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (!isLoading && !post) {
        return _jsx(NotFoundPage, {});
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: cn(" h-[80vh] relative mb-10 max-w-screen-lg mx-auto grid grid-cols-2 gap-10 border-[1px] rounded-2xl"), children: [_jsx("div", { className: cn("w-full h-[80vh] bg-slate-100 border-r-[1px] border-b-[1px] rounded-l-2xl overflow-hidden"), children: _jsx("img", { src: post?.img_url, alt: "Image", className: cn("object-contain h-full mx-auto") }) }), _jsxs("div", { className: cn("relative flex flex-col pt-5 max-h-[80vh]"), children: [_jsxs("div", { className: cn("flex flex-col pr-5  overflow-auto"), children: [_jsxs("div", { className: "flex gap-4 items-center", children: [_jsxs(Avatar, { className: "cursor-pointer border rounded-full overflow-hidden", onClick: () => navigate(`/user/${1}`), children: [_jsx(AvatarImage, { src: post.user_pf_img_url, alt: "@shadcn", className: "w-12 h-12 object-cover" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx(Link, { to: `/user/${post.user_id}`, className: "px-0 py-0 text-xl font-semibold text-primary hover:underline", children: post.user_name }), post?.group_id && (_jsxs(_Fragment, { children: [_jsx(ChevronRight, { className: "h-6" }), _jsx(Link, { to: `/group/${post.group_id}`, className: "px-0 py-0 text-xl font-semibold text-primary hover:underline", children: post.group_title })] }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("p", { className: "text-xs", children: format(new Date(post?.created_at), "PPpp") }), _jsx(Users, { className: "h-4 text-slate-500" })] })] })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "absolute top-3 right-3", children: _jsx(Ellipsis, { className: "w-5 h-5" }) }) }), _jsx(DropdownMenuContent, { align: "end", children: auth.userData.id == post.user_id || auth.userData.role == "admin" ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(Link, { to: `/post/edit/${post.id}`, className: "w-full py-0 text-left cursor-pointer", children: _jsxs("div", { className: "flex gap-2 justify-start items-center py-1", children: [_jsx(Pen, { className: "w-4 h-4" }), _jsx("span", { children: "Edit" })] }) }) }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsxs(Dialog, { open: isReportOpen, onOpenChange: () => setIsReportOpen(!isReportOpen), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: [_jsx(Trash, { className: "w-4 h-4" }), _jsx("span", { children: "Delete" })] }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Delete Post" }), _jsx(DialogDescription, { children: "Are you sure you want to delete this post? This action cannot be undone." }), _jsxs("div", { className: "flex gap-5 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => setIsReportOpen(!isReportOpen), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => handleDeletePost(), children: "Delete" })] })] })] }) }) })] })) : (_jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsxs(Dialog, { open: isReportOpen, onOpenChange: () => setIsReportOpen(!isReportOpen), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), _jsx("span", { children: "Report" })] }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Report Post" }), _jsx(DialogDescription, { children: "If you believe this post violates our community guidelines, please report it." }), _jsxs("div", { className: "flex flex-col gap-5", children: [_jsx(Textarea, { placeholder: "Add reason here.", className: "border-2 min-h-[150px]", value: report, onChange: (e) => setReport(e.target.value) }), _jsx(Button, { variant: "default", className: "w-full font-semibold", onClick: () => handleSubmitReport(), children: "Report" })] })] })] }) }) })) })] }), _jsx("div", { className: "mt-5", children: _jsx("p", { className: "text-2xl font-semibold", children: post?.title }) }), _jsx("div", { className: "my-3", children: _jsx("p", { className: cn("text-md  text-muted-foreground"), children: post.description }) }), _jsx("div", { className: "flex gap-2", children: post.tags.map((tag) => {
                                            return (_jsxs(Link, { to: `/tag/${String(tag.name).toLowerCase()}`, className: "text-blue-600 text-sm", children: ["#", tag.name] }, tag.id));
                                        }) }), _jsxs("div", { className: "flex gap-5 items-center my-2", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Heart, { className: "w-4 text-red-500 mt-[2px]" }), _jsx("p", { className: "text-md", children: post.like_count })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MessageCircle, { className: "w-4 text-gray-500 mt-[2px]" }), _jsx("p", { className: "text-md", children: totalComments })] })] }), _jsxs("div", { className: "flex border rounded-sm", children: [_jsx("button", { disabled: isLiking, className: cn("w-1/2 border-r flex items-center justify-center py-3 group hover:bg-gray-50 text-gray-500", isLiked && "text-red-500 bg-red-50 hover:bg-red-100"), onClick: () => handleToggleLikePost(post.id), children: isLiking ? _jsx(LoaderCircle, { className: "w-5 h-5 text-gray-400 animate-spin" }) : _jsx(Heart, { className: "h-5" }) }), _jsx(SavePostDialog, { postId: post.id, isSaved: post.is_saved, type: "button" })] }), isLoadingComments && comments.length == 0 ? (_jsx("h1", { className: "my-2", children: "Loading..." })) : (_jsxs("div", { className: "flex flex-col flex-grow my-5", children: [comments.length == 0 && _jsx("p", { className: "text-lg text-muted-foreground", children: "No comments yet." }), _jsx("div", { className: "flex flex-col h-full gap-3 overflow-hidden", children: comments.map((comment) => {
                                                    return (_jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex gap-3 items-start", children: [_jsxs(Avatar, { className: "w-8 h-8 min-w-8 min-h-8 rounded-full border overflow-hidden", onClick: () => navigate(`/user/${1}`), children: [_jsx(AvatarImage, { src: comment.user_pf_img_url, alt: "@shadcn", className: "w-8 h-8 object-cover" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm max-w-full ", children: [_jsx("span", { className: "font-semibold mr-2 cursor-pointer hover:underline", onClick: () => navigate(`/user/${1}`), children: comment.user_name }), " ", _jsx("span", { className: "break-words break-all", children: comment.comment })] }), _jsxs("div", { className: "flex items-center gap-4 mb-3 mt-1 text-sm text-muted-foreground", children: [_jsx("h1", { children: comment.created_at != undefined && formatDistance(new Date(comment?.created_at), new Date()) }), _jsx("button", { className: "float-end text-sm hover:text-gray-400", onClick: () => handleMakeReply(comment.id), children: "Reply" })] })] })] }), isReplying && replyToId == comment.id ? (_jsxs("div", { className: "flex w-full gap-2 bg-white pl-10 mb-5", children: [_jsx(Textarea, { placeholder: "Add reply here.", className: "border-2 max-h-[100px]", value: inputReply, onChange: (e) => setInputReply(e.target.value) }), _jsx("div", { className: "h-full flex items-end", children: _jsx(Button, { type: "submit", className: "min-h-[60px] border-2", onClick: () => handlePostReply(comment.id, inputReply), children: _jsx(SendHorizonal, {}) }) })] })) : null] }), _jsxs("div", { className: "ml-10 relative", children: [_jsx("div", { className: "w-[1.5px] h-[calc(100%-30px)] bg-gray-300 absolute -left-7 top-0" }), comment.replies
                                                                        ? comment.replies.map((reply) => {
                                                                            return (_jsxs("div", { children: [_jsxs("div", { className: "flex gap-3 items-start", children: [_jsxs(Avatar, { className: "w-8 h-8 min-w-8 min-h-8 rounded-full border overflow-hidden", onClick: () => navigate(`/user/${1}`), children: [_jsx(AvatarImage, { src: reply.user_pf_img_url, alt: "@shadcn", className: "w-8 h-8 object-cover" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { children: [_jsxs("p", { className: "line-clamp-2 text-sm", children: [_jsx("span", { className: "font-semibold mr-2 cursor-pointer hover:underline", onClick: () => navigate(`/user/${1}`), children: reply.user_name }), " ", reply.comment] }), _jsxs("div", { className: "flex items-center gap-4 mb-3 mt-1 text-xs", children: [_jsx("h1", { className: "text-muted-foreground", children: reply.created_at != undefined && formatDistance(new Date(reply.created_at), new Date()) }), _jsx("button", { className: "float-end hover:text-gray-400", onClick: () => handleMakeReply(reply.id), children: "Reply" })] })] })] }), isReplying && replyToId == reply.id ? (_jsxs("div", { className: "flex w-full gap-2 bg-white pl-10 mb-5", children: [_jsx(Textarea, { placeholder: "Add reply here.", className: "border-2  max-h-[100px]", value: inputReply, onChange: (e) => setInputReply(e.target.value) }), _jsx("div", { className: "h-full flex items-end", children: _jsx(Button, { type: "submit", className: "min-h-[60px] border-2", onClick: () => handlePostReply(comment.id, inputReply), children: _jsx(SendHorizonal, {}) }) })] })) : null] }, reply.id));
                                                                        })
                                                                        : null] })] }, comment.id));
                                                }) })] }))] }), _jsxs("div", { className: "sticky bottom-0 flex w-full gap-2  pt-5 pb-5 pr-3 mt-auto border-t-[1px]", children: [_jsx(Textarea, { placeholder: "Add comment here.", className: "border-2  max-h-[60px]", value: inputComment, onChange: (e) => setInputComment(e.target.value) }), _jsx("div", { className: "h-full flex items-end", children: _jsx(Button, { type: "submit", className: "min-h-[60px] border-2", onClick: () => handlePostComment(post.id, inputComment), children: _jsx(SendHorizonal, {}) }) })] })] })] }), _jsxs("div", { className: "my-20", children: [_jsx("h1", { className: "text-lg font-semibold mt-3", children: "Related Posts" }), _jsx(PostsContainer, { posts: posts })] })] }));
};
export default PostDetailPage;
