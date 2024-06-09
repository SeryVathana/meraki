import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PostsContainer from "@/components/PostsContainer";
import FollowerDialog from "@/components/dialogs/FollowerDialog";
import FollowingDialog from "@/components/dialogs/FollowingDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { LoaderCircle } from "lucide-react";
const UserPage = () => {
    const { userId } = useParams();
    const auth = useSelector((state) => state.auth);
    const naigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const handleFetchUserPosts = () => {
        // fetch user posts
        fetch(`${import.meta.env.VITE_SERVER_URL}/post/user/${userId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setPosts(data.posts);
        });
    };
    const handleFollow = () => {
        setIsFollowing((prev) => !prev);
        if (isFollowing) {
            fetch(`${import.meta.env.VITE_SERVER_URL}/user/unfollow/${userId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
                .then((res) => res.json())
                .then((data) => {
                if (data.status == 200) {
                    setIsFollowing(false);
                }
            });
        }
        else {
            fetch(`${import.meta.env.VITE_SERVER_URL}/user/follow/${userId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
                .then((res) => res.json())
                .then((data) => {
                if (data.status == 200) {
                    setIsFollowing(true);
                }
            });
        }
        handleFetchUserInfo();
    };
    const handleFetchUserInfo = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setUser(data.user);
        })
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        //validate user id must be number
        if (isNaN(Number(userId))) {
            console.log("User ID must be a number");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        handleFetchUserInfo();
    }, [userId]);
    useEffect(() => {
        handleFetchUserPosts();
    }, [user]);
    useEffect(() => {
        if (user) {
            setIsFollowing(user.is_following);
        }
    }, [user]);
    useEffect(() => {
        if (auth.userData.id == Number(userId)) {
            naigate("/profile");
        }
    }, [userId]);
    if (!user && isLoading) {
        return (_jsxs("div", { className: "w-full h-[80vh] flex flex-col gap-2 justify-center items-center", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("h1", { children: "Loading..." })] }));
    }
    if (!user && !isLoading) {
        return _jsx(NotFoundPage, {});
    }
    return (_jsxs("div", { className: "", children: [_jsxs("div", { className: "flex flex-col gap-2 items-center my-10", children: [_jsxs(Avatar, { className: "w-32 h-32 border", children: [_jsx(AvatarImage, { src: user.pf_img_url, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("h1", { className: "text-4xl font-bold tracking-tight lg:text-3xl", children: capitalizeFirstLetter(user.first_name) + " " + capitalizeFirstLetter(user.last_name) }), _jsx("h3", { className: "text-slate-500", children: user.email }), _jsxs("div", { className: "flex gap-5", children: [_jsx(FollowerDialog, { user: user }), _jsx(FollowingDialog, { user: user })] }), _jsx("div", { className: "flex gap-5", children: _jsx(Button, { className: "rounded-full", variant: !isFollowing ? "default" : "secondary", onClick: () => handleFollow(), children: isFollowing ? "Followed" : "Follow" }) })] }), _jsx(PostsContainer, { posts: posts })] }));
};
export default UserPage;
