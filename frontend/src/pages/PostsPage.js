import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PostsContainer from "@/components/PostsContainer";
import { getToken } from "@/utils/HelperFunctions";
import { LoaderCircle, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tag = useParams().tag;
    const handleFetchPosts = () => {
        setIsLoading(true);
        // Fetch posts
        fetch(`${import.meta.env.VITE_SERVER_URL}/post?tag=${tag}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setPosts(data.posts);
        })
            .catch((err) => {
            console.log(err);
        })
            .finally(() => setIsLoading(false));
    };
    useEffect(() => {
        if (window.location.href.includes(tag)) {
            setPosts([]);
            handleFetchPosts();
        }
    }, [tag]);
    if (isLoading) {
        return (_jsxs("div", { className: "w-full h-[80vh] flex flex-col justify-center items-center gap-2", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (!isLoading && posts.length === 0) {
        return (_jsxs("div", { className: "w-full h-[80vh] flex flex-col justify-center items-center gap-2", children: [_jsx(SearchX, { className: "w-10 h-10 text-gray-400" }), _jsx("h1", { children: "No posts found." })] }));
    }
    return (_jsx("div", { className: "min-h-[100vh]", children: _jsx(PostsContainer, { posts: posts }) }));
};
export default PostsPage;
