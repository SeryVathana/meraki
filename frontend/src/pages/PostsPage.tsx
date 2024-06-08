import PostsContainer from "@/components/PostsContainer";
import { RootState } from "@/redux/store";
import { getToken } from "@/utils/HelperFunctions";
import { LoaderCircle, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useSelector } from "react-redux";
import { redirect, useNavigate, useParams } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tag = useParams().tag;

  const handleFetchPosts = () => {
    setIsLoading(true);
    // Fetch posts
    fetch(`http://127.0.0.1:8000/api/post?tag=${tag}`, {
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
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-2">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-2">
        <SearchX className="w-10 h-10 text-gray-400" />
        <h1>No posts found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh]">
      <PostsContainer posts={posts} />
    </div>
  );
};

export default PostsPage;
