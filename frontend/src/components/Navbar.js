import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import GroupsDialog from "./dialogs/GroupsDialog";
import PendingGroupInviteDialog from "./dialogs/PendingGroupInviteDialog";
import SearchDialog from "./dialogs/SearchDialog";
import { Button } from "./ui/button";
import { signOut } from "@/redux/slices/authThunk";
import { useAppDispatch } from "@/redux/hook";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export function Navbar() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [tags, setTags] = React.useState([]);
    const [openDropDown, setOpenDropDown] = React.useState(false);
    const auth = useSelector((state) => state.auth);
    const user = auth?.userData.email;
    const [selectedTag, setSelectedTag] = React.useState("all");
    const handleUserLogout = async () => {
        dispatch(signOut());
        navigate("/login");
    };
    const tag = useParams().tag;
    const getFullName = () => {
        if (auth?.userData.first_name && auth?.userData.last_name) {
            return `${capitalizeFirstLetter(auth?.userData.first_name)} ${capitalizeFirstLetter(auth?.userData.last_name)}`;
        }
        else {
            return auth?.userData.email;
        }
    };
    React.useEffect(() => {
        if (window.location.href.includes("tag") || window.location.href == "/") {
            navigate(`/tag/${selectedTag}`);
        }
    }, [selectedTag]);
    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/tag`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setTags(data.tags);
        });
    }, []);
    React.useEffect(() => {
        if (tag) {
            setSelectedTag(tag);
        }
    }, [tag]);
    return (_jsxs("div", { className: "w-full flex items-center gap-10", children: [_jsx(NavLink, { to: "/", children: _jsx("h1", { className: "scroll-m-20 text-lg text-primary font-bold tracking-tight lg:text-2xl ", children: "\u039C\u03A3R\u039B\u039A\u0399" }) }), _jsxs(NavigationMenu, { className: "flex gap-2", children: [(window.location.href.includes("tag") || window.location.href == "/") && (_jsx(NavigationMenuList, { children: _jsxs(Select, { value: selectedTag, onValueChange: (val) => {
                                setSelectedTag(val);
                            }, children: [_jsx(SelectTrigger, { className: "w-[150px]", children: _jsx(SelectValue, { placeholder: "Tags" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All" }), tags.map((tag, i) => (_jsx(SelectItem, { value: String(tag.name).toLowerCase(), children: tag.name }, tag.id)))] })] }) })), _jsx(NavigationMenuList, { children: user && (_jsx(NavigationMenuItem, { asChild: true, children: _jsx(Link, { to: "/create-post", children: _jsx(Button, { children: "Create Post" }) }) })) })] }), user ? (_jsxs("div", { className: "flex gap-5 ml-auto", children: [_jsx(SearchDialog, {}), _jsx(GroupsDialog, { userId: auth.userData.id, type: "icon" }), _jsxs(DropdownMenu, { open: openDropDown, onOpenChange: () => setOpenDropDown(!openDropDown), children: [_jsx(DropdownMenuTrigger, { asChild: true, className: " cursor-pointer", children: _jsxs("div", { className: "relative", children: [_jsxs(Avatar, { className: "border rounded-full", children: [_jsx(AvatarImage, { src: auth.userData.pf_img_url, referrerPolicy: "no-referrer", alt: "@shadcn", className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), auth.userData.total_noti > 0 && (_jsx("div", { className: "absolute -right-1 -top-1 px-[5px] py-[0px] text-xs border rounded-full bg-destructive text-white", children: auth.userData.total_noti }))] }) }), _jsxs(DropdownMenuContent, { className: "w-56 mr-10", children: [_jsx(DropdownMenuLabel, { children: getFullName() }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuGroup, { children: [auth.userData.role == "admin" && (_jsx(DropdownMenuItem, { asChild: true, children: _jsx(NavLink, { to: "/dashboard", className: "cursor-pointer", children: "Admin Dashboard" }) })), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(NavLink, { to: "/profile", className: "cursor-pointer", children: "Profile" }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(NavLink, { to: "/profile/setting", className: "cursor-pointer", children: "Setting" }) })] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuItem, { asChild: true, children: _jsx(NavLink, { to: "/profile?post=my-posts", className: "cursor-pointer", children: "My Posts" }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(NavLink, { to: "/profile?post=my-posts", className: "cursor-pointer", children: "Created Posts" }) }), _jsx(DropdownMenuItem, { asChild: true, children: _jsx(NavLink, { to: "/profile?post=saved-posts", className: "cursor-pointer", children: "Saved Posts" }) })] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuItem, { asChild: true, onClick: () => setOpenDropDown(false), children: _jsx(_Fragment, { children: _jsx(GroupsDialog, { userId: auth.userData.id, type: "drop-down-link" }) }) }), _jsx(DropdownMenuItem, { onClick: () => navigate("/create-group"), className: "cursor-pointer", children: "Create Groups" }), _jsx(DropdownMenuItem, { asChild: true, onClick: () => setOpenDropDown(false), children: _jsx(_Fragment, { children: _jsx(PendingGroupInviteDialog, { type: "drop-down-link" }) }) })] }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { onClick: () => handleUserLogout(), className: "cursor-pointer", children: "Log out" })] })] })] })) : (_jsxs("div", { className: "flex gap-5 ml-auto", children: [_jsx(Button, { variant: "secondary", asChild: true, children: _jsx(Link, { to: "/login", children: "Log in" }) }), _jsx(Button, { variant: "default", asChild: true, children: _jsx(Link, { to: "/signup", children: "Sign up" }) })] }))] }));
}
const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
    return (_jsx("li", { children: _jsx(NavigationMenuLink, { asChild: true, children: _jsxs("a", { ref: ref, className: cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className), ...props, children: [_jsx("div", { className: "text-sm font-medium leading-none", children: title }), _jsx("p", { className: "line-clamp-2 text-sm leading-snug text-muted-foreground", children: children })] }) }) }));
});
ListItem.displayName = "ListItem";
