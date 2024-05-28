import PostsContainer from "@/components/PostsContainer";
import { RootState } from "@/redux/store";
import { getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useSelector } from "react-redux";

const HomePage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<any[]>([]);

  const handleFetchPosts = () => {
    console.log("Fetching posts...");
    // Fetch posts
    fetch("http://127.0.0.1:8000/api/post", {
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
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleFetchPosts();
  }, []);

  // if (!auth.token) {
  //   return <div>Loading...</div>;
  // } else {
  //   return (
  //     <div className="min-h-[100vh]">
  //       <PostsContainer posts={posts} />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-[100vh]">
      <PostsContainer posts={posts} />
    </div>
  );
};

export default HomePage;
