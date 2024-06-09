import PostsContainer from "@/components/PostsContainer";
import FollowerDialog from "@/components/dialogs/FollowerDialog";
import FollowingDialog from "@/components/dialogs/FollowingDialog";

import GroupsDialog from "@/components/dialogs/GroupsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { LoaderCircle } from "lucide-react";
import { set } from "date-fns";

const UserPage = () => {
  const { userId } = useParams();

  const auth = useSelector((state: RootState) => state.auth);
  const naigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
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
    } else {
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
    return (
      <div className="w-full h-[80vh] flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!user && !isLoading) {
    return <NotFoundPage />;
  }

  return (
    <div className="">
      <div className="flex flex-col gap-2 items-center my-10">
        <Avatar className="w-32 h-32 border">
          <AvatarImage src={user.pf_img_url} className="object-cover w-full h-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="text-4xl font-bold tracking-tight lg:text-3xl">
          {capitalizeFirstLetter(user.first_name) + " " + capitalizeFirstLetter(user.last_name)}
        </h1>
        <h3 className="text-slate-500">{user.email}</h3>

        <div className="flex gap-5">
          <FollowerDialog user={user} />
          <FollowingDialog user={user} />
        </div>

        <div className="flex gap-5">
          {/* <GroupsDialog user_id={idParam} type="button" /> */}
          <Button className="rounded-full" variant={!isFollowing ? "default" : "secondary"} onClick={() => handleFollow()}>
            {isFollowing ? "Followed" : "Follow"}
          </Button>
        </div>
      </div>
      <PostsContainer posts={posts} />
    </div>
  );
};

export default UserPage;
