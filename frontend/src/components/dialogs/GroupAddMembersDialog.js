import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getToken } from "@/utils/HelperFunctions";
import { Dot, LoaderCircle, Search, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
const GroupAddMembersDialog = ({ group, type }) => {
    const [searchQuery, setSearchQuery] = useState("");
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: type == "button" ? (_jsx(Button, { variant: "secondary", className: "rounded-full px-0", children: "Invite users" })) : (_jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer", children: "Invite users" })) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "my-3 flex items-center", children: "Invite Users" }), _jsx("div", { className: "flex gap-2", children: _jsxs("div", { className: "relative w-full mr-auto", children: [_jsx(Input, { placeholder: "Search users...", className: "pr-10 ", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Search, { className: "absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" })] }) })] }), _jsx("div", { className: "flex flex-col gap-2 min-h-[400px] max-h-[400px]  overflow-auto pr-2", children: _jsx(UserContent, { group: group, searchQuery: searchQuery }) })] })] }));
};
const UserContent = ({ group, searchQuery }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInviting, setIsInviting] = useState(0);
    const [isCanceling, setIsCanceling] = useState(0);
    const navigate = useNavigate();
    const handleFetchUsers = () => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/notmember/${group.id}?` + new URLSearchParams({ q: searchQuery }), {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            setUsers(data.users);
        })
            .finally(() => {
            setIsLoading(false);
        });
    };
    const handleCreateInvite = (userId) => {
        setIsInviting(userId);
        const reqBody = {
            user_id: userId,
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/${group.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchUsers();
        })
            .catch((err) => console.log(err))
            .finally(() => {
            //delay to show inviting state
            setTimeout(() => {
                setIsInviting(0);
            }, 1000);
        });
    };
    const handleUninvite = (userId) => {
        setIsCanceling(userId);
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/${group.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ user_id: userId }),
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchUsers();
        })
            .catch((err) => console.log(err))
            .finally(() => 
        //delay to show inviting state
        // setIsCanceling(0);
        setTimeout(() => {
            setIsCanceling(0);
        }, 1000));
    };
    useEffect(() => {
        if (searchQuery && searchQuery.length < 2)
            return;
        handleFetchUsers();
    }, [group, searchQuery]);
    if (isLoading && users.length == 0) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (!isLoading && users.length == 0) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("h1", { children: "No users found." })] }));
    }
    return users.map((user, index) => {
        return (_jsxs("div", { className: "flex w-full justify-between px-2 py-2 rounded-md border-[1px]", children: [_jsxs("div", { className: "flex w-full gap-5", children: [_jsxs(Avatar, { className: "hover:border-2 cursor-pointer border", onClick: () => navigate(`/user/${user.id}`), children: [_jsx(AvatarImage, { src: user.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-md hover:underline hover:text-primary cursor-pointer", onClick: () => navigate(`/user/${user.id}`), children: [user.first_name, " ", user.last_name] }), _jsx("p", { className: "text-sm text-gray-500", children: user.email })] }), user.is_following ? (_jsxs("div", { className: "flex items-center text-gray-400 cursor-default", children: [_jsx(Dot, {}), _jsx("h1", { className: "text-xs font-normal cursor-default", children: "following" })] })) : ("")] })] }), user.is_invited ? (_jsx(Button, { variant: "secondary", className: cn("z-10 bg-primary-foreground"), disabled: isCanceling == user.id, onClick: () => handleUninvite(user.id), children: isCanceling == user.id ? "Canceling..." : "Cancle Invite" })) : (_jsx(Button, { variant: "outline", className: cn("z-10 bg-primary/10"), disabled: isInviting == user.id, onClick: () => handleCreateInvite(user.id), children: isInviting != user.id ? "Invite" : "Inviting..." }))] }, index));
    });
};
export default GroupAddMembersDialog;
