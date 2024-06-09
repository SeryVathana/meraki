import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
const GroupPostRequests = ({ group_id, type }) => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: type == "button" ? (_jsx(Button, { variant: "secondary", className: "rounded-full px-0", children: "Post Requests" })) : (_jsx("p", { className: "text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ", children: "Post requests" })) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "my-3 flex items-center", children: "Pending requests" }) }), _jsx("div", { className: "flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden", children: requests?.map((user, index) => {
                            return (_jsxs("div", { className: "flex w-full justify-between px-2 py-2 rounded-md border-[1px]", children: [_jsxs("div", { className: "flex w-full gap-5", children: [_jsxs(Avatar, { className: "hover:border-2 cursor-pointer", onClick: () => navigate(`/user/${user.id}`), children: [_jsx(AvatarImage, { src: user.img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "flex gap-2 items-center", children: _jsx("h1", { className: "text-md hover:underline hover:text-primary cursor-pointer", onClick: () => navigate(`/user/${user.id}`), children: user.username }) })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "ghost", className: "z-10 text-green-500", size: "icon", children: _jsx(Check, {}) }), _jsx(Button, { variant: "ghost", className: "z-10 text-red-500", size: "icon", children: _jsx(X, {}) })] })] }, index));
                        }) })] })] }));
};
export default GroupPostRequests;
