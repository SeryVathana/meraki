import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getToken } from "@/utils/HelperFunctions";
import { Check, LoaderCircle, SearchX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
const GroupJoinRequestsDialog = ({ group, type }) => {
    const auth = useSelector((state) => state.auth);
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: type == "button" ? (_jsx(Button, { variant: "secondary", className: "rounded-full px-0", children: "Join Requests" })) : (_jsxs("div", { className: cn("text-sm relative w-full px-2 py-2 hover:bg-slate-100 rounded-sm cursor-pointer", auth.userData.group_req > 0 && "min-w-[150px]"), children: [_jsx("p", { children: "Join Requests" }), auth.userData.group_req > 0 && (_jsx("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white", children: auth.userData.group_req }))] })) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "my-3 flex items-center", children: "Pending requests" }) }), _jsx("div", { className: "min-h-[400px] max-h-[400px]  overflow-auto pr-2", children: _jsx(GroupJoinRequestsContent, { groupId: group.id }) })] })] }));
};
export default GroupJoinRequestsDialog;
const GroupJoinRequestsContent = ({ groupId }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleFetchRequests = () => {
        setIsLoading(true);
        // fetch requests
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/request/pending/${groupId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            setRequests(data.data);
        })
            .catch((err) => {
            console.log(err);
        })
            .finally(() => setIsLoading(false));
    };
    const handleAcceptRequest = (reqId) => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/request/accept/${reqId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            handleFetchRequests();
        })
            .catch((err) => {
            console.log(err);
        });
    };
    useEffect(() => {
        handleFetchRequests();
    }, [groupId]);
    if (isLoading && requests.length == 0) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (!isLoading && requests.length == 0) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("h1", { children: "No request found." })] }));
    }
    return (_jsx("div", { className: "flex flex-col gap-2 overflow-y-auto overflow-x-hidden", children: requests.map((req, index) => {
            return (_jsxs("div", { className: "flex w-full justify-between px-2 py-2 rounded-md border-[1px]", children: [_jsxs("div", { className: "flex w-full gap-5", children: [_jsxs(Avatar, { className: "hover:border-2 cursor-pointer", onClick: () => navigate(`/user/${req.user_id}`), children: [_jsx(AvatarImage, { src: req.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("div", { className: "flex gap-2 items-center", children: _jsxs("h1", { className: "text-md hover:underline hover:text-primary cursor-pointer", onClick: () => navigate(`/user/${req.user_id}`), children: [req.first_name, " ", req.last_name] }) })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "ghost", className: "z-10 text-green-500", size: "icon", onClick: () => handleAcceptRequest(req.id), children: _jsx(Check, {}) }), _jsx(Button, { variant: "ghost", className: "z-10 text-red-500", size: "icon", children: _jsx(X, {}) })] })] }, index));
        }) }));
};
