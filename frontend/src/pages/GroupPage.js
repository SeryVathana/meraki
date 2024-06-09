import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PostsContainer from "@/components/PostsContainer";
import CreateGroupPostDialog from "@/components/dialogs/CreateGroupPostDialog";
import EditGroupDialog from "@/components/dialogs/EditGroupDialog";
import GroupAddMembersDialog from "@/components/dialogs/GroupAddMembersDialog";
import GroupJoinRequestsDailog from "@/components/dialogs/GroupJoinRequestsDailog";
import GroupMembersDialog from "@/components/dialogs/GroupMembersDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { Dialog } from "@radix-ui/react-dialog";
import { Dot, Ellipsis, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
const GroupPage = () => {
    const [isPublicGroup, setIsPublicGroup] = useState(true);
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const auth = useSelector((state) => state.auth);
    const [openAlert, setOpenAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const { groupId } = useParams();
    const handleFetchGroupInfo = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/${groupId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setGroup(data.group);
        })
            .finally(() => setIsLoading(false));
    };
    const handleFetchGroupPosts = () => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/group/${groupId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => setPosts(data.posts))
            .finally(() => setIsLoading(false));
    };
    const handleJoinPublicGroup = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/public/join/${groupId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setIsMember(true);
            handleFetchGroupInfo();
        });
    };
    const handleRequestJoinPrivateGroup = () => {
        setIsRequesting((prev) => !prev);
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/request/${groupId}`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                handleFetchGroupInfo();
            }
            else {
                setIsRequesting((prev) => !prev);
            }
        })
            .catch((err) => {
            setIsRequesting((prev) => !prev);
        });
    };
    const handleLeaveGroup = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/leave/${groupId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setIsMember(false);
            handleFetchGroupInfo();
        })
            .finally(() => {
            setOpenAlert(false);
        });
    };
    const handleAcceptInvite = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/accept/${group.invite_id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${auth.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchGroupInfo();
        })
            .catch((err) => {
            console.log(err);
        });
    };
    useEffect(() => {
        // fetch group data
        setIsLoading(true);
        handleFetchGroupInfo();
    }, [groupId]);
    useEffect(() => {
        if (group) {
            if (group?.status === "private") {
                setIsPublicGroup(false);
            }
        }
    }, [group]);
    useEffect(() => {
        if (!group || (group.status == "private" && group.is_member === false)) {
            return;
        }
        //fetch group posts
        handleFetchGroupPosts();
    }, [group]);
    useEffect(() => {
        if (group) {
            if (group.owner_id === auth.userData.id) {
                setIsOwner(true);
            }
            if (group.is_member) {
                setIsMember(true);
            }
            if (group.is_requesting) {
                setIsRequesting(true);
            }
            if (group.status === "public") {
                setIsPublicGroup(true);
            }
            else {
                setIsPublicGroup(false);
            }
        }
    }, [group, auth]);
    if (!group && isLoading) {
        return (_jsxs("div", { className: "w-full h-[80vh] flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("h1", { children: "Loading..." })] }));
    }
    if (!group && !isLoading) {
        return _jsx(NotFoundPage, {});
    }
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative w-full h-[35vh] bg-gray-400 rounded-2xl", children: [_jsx("img", { src: "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Image", className: "w-full h-full object-cover rounded-xl" }), _jsx("div", { className: "z-40  group absolute rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 border-4 border-white", children: _jsxs(Avatar, { className: " w-40 h-40 border-gray-200", children: [_jsx(AvatarImage, { src: group?.img_url, className: "w-full h-full object-cover" }), _jsx(AvatarFallback, { children: "CN" })] }) })] }), _jsxs("div", { className: "flex flex-col items-center gap-5 relative w-full mt-5", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight lg:text-3xl  mt-12", children: group?.title }), _jsxs("div", { className: "flex items-center gap-5", children: [_jsxs("p", { children: [capitalizeFirstLetter(group?.status), " group"] }), _jsx(Dot, { className: "" }), _jsx(_Fragment, { children: _jsx(GroupMembersDialog, { group: group, type: "link" }) })] }), _jsxs("div", { className: "w-full flex justify-center gap-5", children: [group.is_inviting ? (_jsx(Button, { variant: "default", className: "rounded-full", onClick: () => handleAcceptInvite(), children: "Accept Invite" })) : isMember ? (_jsx(CreateGroupPostDialog, { group: group, handleFetchGroupPosts: handleFetchGroupPosts })) : group?.status === "public" ? (_jsx(Button, { className: "rounded-full", onClick: () => handleJoinPublicGroup(), children: "Join Group" })) : group.is_requesting ? (_jsx(Button, { className: "rounded-full", variant: "secondary", onClick: () => handleRequestJoinPrivateGroup(), children: "Cancel Request" })) : (_jsx(Button, { className: "rounded-full", onClick: () => handleRequestJoinPrivateGroup(), children: "Request Join" })), isMember && (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("div", { className: "relative", children: [_jsx(Button, { className: "", size: "icon", variant: "secondary", children: _jsx(Ellipsis, { className: "w-5" }) }), auth.userData.group_req > 0 && (_jsx("div", { className: "absolute -right-1 -top-1 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white", children: auth.userData.group_req }))] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(GroupMembersDialog, { group: group, type: "dropdown" }) }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(GroupJoinRequestsDailog, { group: group, type: "dropdown" }) }) }), isOwner && (_jsxs(_Fragment, { children: [isPublicGroup ?? (_jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(GroupJoinRequestsDailog, { group: group, type: "dropdown" }) }) })), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(GroupAddMembersDialog, { group: group, type: "dropdown" }) }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(EditGroupDialog, { group: group, handleFetchGroupInfo: handleFetchGroupInfo, type: "dropdown" }) }) })] })), isOwner ? null : (_jsx(_Fragment, { children: _jsx(DropdownMenuItem, { asChild: true, children: _jsxs(Dialog, { open: openAlert, onOpenChange: () => setOpenAlert(!openAlert), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ", children: "Leave Group" }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Leave Group" }) }), _jsx("h1", { children: "Are you sure you want to leave the group?" }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx(Button, { variant: "destructive", onClick: () => handleLeaveGroup(), children: "Yes" }), _jsx(Button, { variant: "default", onClick: () => setOpenAlert(false), children: "No" })] })] })] }) }) }))] })] }))] })] }), _jsx("div", { className: "my-10", children: isPublicGroup || isMember ? (posts?.length > 0 ? (_jsx("div", { className: "mt-10", children: _jsx(PostsContainer, { posts: posts }) })) : isLoading ? (_jsx("h1", { children: "Loading..." })) : (_jsx("h1", { children: "No post yet." }))) : (_jsx("h1", { children: "Join group to view posts." })) })] }));
};
export default GroupPage;
