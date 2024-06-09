import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getToken } from "@/utils/HelperFunctions";
import { Dot, Ellipsis, LoaderCircle, Search, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { DialogDescription } from "@radix-ui/react-dialog";
const GroupMembersDialog = ({ group, type }) => {
    const [searchQuery, setSearchQuery] = useState("");
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: type == "link" ? (_jsxs(Button, { variant: "link", className: "rounded-full px-0", disabled: group?.status == "private" && !group.is_member, children: [group?.members, " members"] })) : (_jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ", children: "Members" })) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "my-3 flex items-center", children: "Members" }), _jsx("div", { className: "flex gap-2", children: _jsxs("div", { className: "relative w-full mr-auto", children: [_jsx(Input, { placeholder: "Search groups...", className: "pr-10 ", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Search, { className: "absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" })] }) })] }), _jsx("div", { className: "min-h-[400px] max-h-[400px]  overflow-auto pr-2", children: _jsx(GroupMemberContent, { group: group, searchQuery: searchQuery }) })] })] }));
};
const GroupMemberContent = ({ group, searchQuery }) => {
    const auth = useSelector((state) => state.auth);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleFetchGroupMembers = () => {
        setIsLoading(true);
        // fetch group members
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/member/${group.id}?` + new URLSearchParams({ q: searchQuery }), {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            setMembers(data.members);
        })
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        if (searchQuery && searchQuery.length < 2)
            return;
        handleFetchGroupMembers();
        return () => {
            setMembers([]);
        };
    }, [group, searchQuery]);
    useEffect(() => {
        // Store the interval id in a const, so you can cleanup later
        const intervalId = setInterval(() => {
            handleFetchGroupMembers();
        }, 5000);
        return () => {
            // Since useEffect dependency array is empty, this will be called only on unmount
            clearInterval(intervalId);
        };
    }, []);
    if (members.length == 0 && !isLoading) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("h1", { children: "No member found." })] }));
    }
    if (members.length == 0 && isLoading) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    return (_jsx("div", { className: "flex flex-col gap-2 overflow-y-auto overflow-x-hidden", children: members.map((user, index) => {
            return (_jsxs("div", { className: "flex w-full justify-between px-2 py-2 rounded-md border-[1px]", children: [_jsxs("div", { className: "flex w-full gap-5", children: [_jsxs(Avatar, { className: "hover:border-2 cursor-pointer", onClick: () => navigate(`/user/${user.user_id}`), children: [_jsx(AvatarImage, { src: user.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs("h1", { className: "text-md hover:underline hover:text-primary cursor-pointer", onClick: () => navigate(`/user/${user.user_id}`), children: [user.first_name, " ", user.last_name] }), _jsxs("div", { className: "flex items-center text-gray-400 cursor-default", children: [_jsx(Dot, {}), user.group_role == "admin" ? (_jsx("h1", { className: "text-xs font-normal cursor-default", children: "group admin" })) : (_jsx("h1", { className: "text-xs font-normal cursor-default", children: "group member" }))] })] })] }), 
                    // check if user is group admin
                    group.owner_id != user.user_id && (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "z-10", size: "icon", children: _jsx(Ellipsis, { className: "w-4 text-gray-700" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [group.is_member && group.is_admin && user.group_role != "admin" && (_jsx(DropdownMenuItem, { asChild: true, children: _jsx(PromotionDialog, { user: user, handleFetchGroupMembers: handleFetchGroupMembers }) })), user.user_id != auth.userData.id && group.owner_id != user.user_id && (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(_Fragment, { children: _jsx(RemoveUserDialog, { group: group, user: user, handleFetchGroupMembers: handleFetchGroupMembers }) }) })] }))] })] }))] }, index));
        }) }));
};
const PromotionDialog = ({ user, handleFetchGroupMembers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handlePromoteUser = (id) => {
        // promote user to group admin
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/promote/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
            setIsOpen(false);
            handleFetchGroupMembers();
        })
            .catch((err) => console.log(err));
    };
    return (_jsxs(Dialog, { open: isOpen, onOpenChange: () => {
            setIsOpen(!isOpen);
        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("p", { className: "text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer", children: "Promote to admin" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-lg", children: "Group Promotion" }), _jsx(DialogDescription, { children: _jsx("h1", { children: "Are you sure you want to promote user to group admin?" }) })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Avatar, { className: "border", children: [_jsx(AvatarImage, { src: user.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { children: [_jsxs("h1", { className: "text-lg font-semibold", children: [user.first_name, " ", user.last_name] }), _jsx("h1", { className: "text-sm text-gray-500", children: user.email })] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                    setIsOpen(false);
                                }, children: "Cancel" }), _jsx(Button, { variant: "default", onClick: () => handlePromoteUser(user.id), children: "Confirm" })] })] })] }));
};
const RemoveUserDialog = ({ user, group, handleFetchGroupMembers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleRemoveUser = () => {
        // remove user from group
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/member/${group.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.user_id }),
        })
            .then((res) => res.json())
            .then((data) => {
            setIsOpen(false);
            handleFetchGroupMembers();
        })
            .catch((err) => console.log(err));
    };
    return (_jsxs(Dialog, { open: isOpen, onOpenChange: () => {
            setIsOpen(!isOpen);
        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("p", { className: "text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer", children: "Remove User" }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "", children: "Remove User" }) }), _jsx("h1", { children: "Are you sure you want to remove user from group?" }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Avatar, { className: "border", children: [_jsx(AvatarImage, { src: user.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { children: [_jsxs("h1", { className: "text-lg font-semibold", children: [user.first_name, " ", user.last_name] }), _jsx("h1", { className: "text-sm text-gray-500", children: user.email })] })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                    setIsOpen(false);
                                }, children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => handleRemoveUser(), children: "Confirm" })] })] })] }));
};
export default GroupMembersDialog;
