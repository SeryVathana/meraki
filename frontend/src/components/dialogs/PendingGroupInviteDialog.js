import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Check, Dot, LoaderCircle, SearchX, TriangleAlert, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
const PendingGroupInviteDialog = ({ type }) => {
    const auth = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    return (_jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: type == "icon" ? (_jsx(Button, { variant: "outline", size: "icon", children: _jsx(Users, { className: "w-5 h-5" }) })) : type == "button" ? (_jsx(Button, { variant: "secondary", className: "rounded-full", children: "Pending Invites" })) : type == "drop-down-link" ? (_jsxs("div", { className: "text-sm relative w-full px-2 py-2 hover:bg-slate-100 rounded-sm cursor-pointer", children: [_jsx("p", { children: "Pending Invites" }), auth.userData.invites > 0 && (_jsx("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white", children: auth.userData.invites }))] })) : ("") }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "my-3 flex items-center", children: "Pending group invites" }) }), _jsx("div", { className: "flex flex-col gap-2 min-h-[400px] max-h-[400px]  overflow-auto pr-2", children: _jsx(GroupInvitesContent, {}) })] })] }));
};
const GroupInvitesContent = () => {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const handleFetchGroups = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/pending/invite`, { method: "GET", headers: { Authorization: `Bearer ${auth.token}` } })
            .then((res) => res.json())
            .then((data) => {
            setGroups(data.invites);
        })
            .finally(() => {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        });
    };
    const handleAcceptInvite = (inviteId) => {
        // accept invite
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/accept/${inviteId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${auth.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchGroups();
        })
            .catch((err) => {
            console.log(err);
        });
    };
    const handleDeclineInvite = (inviteId) => {
        // decline invite
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/${inviteId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${auth.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchGroups();
        })
            .catch((err) => {
            console.log(err);
        });
    };
    useEffect(() => {
        setIsLoading(true);
        handleFetchGroups();
    }, [auth]);
    if (isLoading && groups.length === 0) {
        return (_jsxs("div", { className: "flex flex-col w-full h-full items-center justify-center gap-2", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (!isLoading && groups?.length === 0) {
        return (_jsxs("div", { className: "flex w-full h-full flex-col items-center justify-center gap-2", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("p", { children: "No pending invites" })] }));
    }
    return groups.map((group, index) => {
        return (_jsx("div", { className: "border rounded-md px-2 group hover:bg-gray-50", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(DialogTrigger, { className: "flex w-fit justify-start gap-5 py-2 cursor-pointer", onClick: () => navigate(`/group/${group.group_id}`), children: [_jsxs(Avatar, { className: "border", children: [_jsx(AvatarImage, { src: group.img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { className: "flex flex-col justify-start", children: [_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("h1", { className: "text-sm line-clamp-1 font-semibold", children: group.title }), _jsxs("div", { className: "flex items-center text-gray-400", children: [_jsx(Dot, {}), _jsx("h1", { className: "text-xs font-normal", children: group.status })] })] }), _jsx("p", { className: "text-xs text-gray-500 w-fit", children: format(new Date(group.created_at), "Pp") })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "icon", variant: "ghost", className: "w-8 h-8", onClick: () => handleAcceptInvite(group.id), children: _jsx(Check, { className: "w-5 h-5 text-green-500" }) }), _jsxs(Dialog, { open: isOpenAlert, onOpenChange: () => setIsOpenAlert(!isOpenAlert), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { size: "icon", variant: "ghost", className: "w-8 h-8", children: _jsx(X, { className: "w-5 h-5 text-red-500" }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TriangleAlert, { className: "text-destructive" }), _jsx("span", { children: "Decline Invite" })] }) }) }), _jsxs("h1", { children: ["Are you sure you want to decline the invite to join ", _jsx("span", { className: "font-semibold", children: group.title }), " group?"] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => setIsOpenAlert(!isOpenAlert), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => handleDeclineInvite(group.id), children: "Confirm" })] })] })] })] })] }) }, index));
    });
};
export default PendingGroupInviteDialog;
