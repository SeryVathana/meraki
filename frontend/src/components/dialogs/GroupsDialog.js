import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToken } from "@/utils/HelperFunctions";
import { Dot, LoaderCircle, Search, SearchX, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
const GroupsDialog = ({ userId, type }) => {
    const auth = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("none");
    const [searchType, setSearchType] = useState("none");
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: type == "icon" ? (_jsxs("div", { className: "relative", children: [_jsx(Button, { variant: "outline", size: "icon", children: _jsx(Users, { className: "w-5 h-5" }) }), auth.userData.group_req > 0 && (_jsx("div", { className: "absolute -right-1 -top-1 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white", children: auth.userData.group_req }))] })) : type == "button" ? (_jsx(Button, { variant: "secondary", className: "rounded-full", children: "Groups" })) : type == "drop-down-link" ? (_jsxs("div", { className: "text-sm relative w-full px-2 py-2 hover:bg-slate-100 rounded-sm cursor-pointer", children: [_jsx("p", { children: "My Groups" }), auth.userData.group_req > 0 && (_jsx("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white", children: auth.userData.group_req }))] })) : ("") }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "my-3 flex items-center", children: "My Groups" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative w-full mr-auto", children: [_jsx(Input, { placeholder: "Search groups...", className: "pr-10 ", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Search, { className: "absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" })] }), _jsxs(Select, { defaultValue: "none", onValueChange: (val) => setSearchStatus(val), children: [_jsx(SelectTrigger, { className: "w-fit", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { className: "w-fit", children: [_jsx(SelectItem, { value: "none", children: "All" }), _jsx(SelectItem, { value: "public", children: "Public" }), _jsx(SelectItem, { value: "private", children: "Private" })] })] }), _jsxs(Select, { defaultValue: "none", onValueChange: (val) => setSearchType(val), children: [_jsx(SelectTrigger, { className: "w-fit", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "none", className: "", children: "All" }), _jsx(SelectItem, { value: "my-group", children: "Created" }), _jsx(SelectItem, { value: "joined-group", children: "Joined" })] })] })] })] }), _jsx("div", { className: "min-h-[400px] max-h-[400px] overflow-auto pr-2", children: _jsx(GroupDialogContent, { userId: userId, searchQuery: searchQuery, searchStatus: searchStatus, searchType: searchType }) })] })] }));
};
const GroupDialogContent = ({ userId, searchQuery, searchStatus, searchType }) => {
    const auth = useSelector((state) => state.auth);
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/group/mygroups?` + new URLSearchParams({ search: searchQuery, type: searchType, status: searchStatus }), {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
            signal,
        })
            .then((res) => res.json())
            .then((data) => setGroups(data.groups))
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
        return () => {
            abortController.abort();
            setGroups([]);
        };
    }, [userId, searchQuery, searchStatus, searchType]);
    if (isLoading && groups.length == 0) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (!isLoading && groups.length == 0) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("h1", { children: "No group found." })] }));
    }
    return (_jsx("div", { className: "flex flex-col gap-2 overflow-y-auto overflow-x-hidden", children: groups?.map((group, index) => {
            return (group && (_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "flex relative w-full justify-start gap-5 py-7", variant: "outline", onClick: () => navigate(`/group/${group.id}`), children: [_jsxs(Avatar, { className: "", children: [_jsx(AvatarImage, { src: group?.img_url, className: "w-full h-full object-cover" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("h1", { className: "text-lg", children: group.title }), _jsx(Dot, { className: "text-gray-500" }), _jsx("p", { className: "text-gray-500", children: group.status == "public" ? "public" : "private" })] }), group.req_count > 0 && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white", children: auth.userData.group_req }))] }, group.id) }, index)));
        }) }));
};
export default GroupsDialog;
