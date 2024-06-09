import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { Dot, LoaderCircle, Search, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
const FollowingDialog = ({ user }) => {
    const [searchQuery, setSearchQuery] = useState("");
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "link", className: "rounded-full px-0", children: [user.followings, " followings"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "mb-3 flex items-center", children: [capitalizeFirstLetter(user.first_name), "'s followings "] }), _jsxs("div", { className: "relative w-full mr-auto", children: [_jsx(Input, { placeholder: "Search groups...", className: "pr-10 ", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Search, { className: "absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" })] })] }), _jsx("div", { className: "min-h-[400px] max-h-[400px]  overflow-auto pr-2", children: _jsx(FollowingContent, { user: user, searchQuery: searchQuery }) })] })] }));
};
const FollowingContent = ({ user, searchQuery }) => {
    const navigate = useNavigate();
    const [followings, setFollowings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleFetchFollowings = () => {
        // fetch user followings
        fetch(`${import.meta.env.VITE_SERVER_URL}/user/following/${user.id}?` + new URLSearchParams({ q: searchQuery }), {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            setFollowings(data.data);
        })
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        if (searchQuery && searchQuery.length < 2) {
            return;
        }
        setIsLoading(true);
        handleFetchFollowings();
        return () => {
            setFollowings([]);
        };
    }, [searchQuery]);
    if (followings.length == 0 && !isLoading) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("h1", { children: "No folling found." })] }));
    }
    if (followings.length == 0 && isLoading) {
        return (_jsxs("div", { className: "h-full w-full flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    return (followings && (_jsx("div", { className: "space-y-1", children: followings.map((user, index) => {
            return (_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "flex w-full justify-start gap-5 py-7", variant: "outline", onClick: () => navigate(`/user/${user.id}`), children: [_jsxs(Avatar, { className: "", children: [_jsx(AvatarImage, { src: user.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("h1", { className: "text-lg", children: user.first_name + " " + user.last_name }), user.is_following ? (_jsxs("div", { className: "flex items-center text-gray-400", children: [_jsx(Dot, {}), _jsx("h1", { className: "text-xs font-normal", children: "followed" })] })) : ("")] })] }, user.id) }, index));
        }) })));
};
export default FollowingDialog;
