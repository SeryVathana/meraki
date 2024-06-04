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

const UserPage = () => {
  const { userId } = useParams();

  const auth = useSelector((state: RootState) => state.auth);
  const naigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const handleFetchUserPosts = () => {
    // fetch user posts
    fetch(`http://localhost:8000/api/post/user/${userId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      });
  };

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    if (isFollowing) {
      fetch(`http://localhost:8000/api/user/unfollow/${userId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => res.json())
        .then((data) => {});
    } else {
      fetch(`http://localhost:8000/api/user/follow/${userId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => res.json())
        .then((data) => {});
    }

    handleFetchUserInfo();
  };

  const handleFetchUserInfo = () => {
    fetch(`http://localhost:8000/api/user/${userId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  };

  useEffect(() => {
    //validate user id must be number
    if (isNaN(Number(userId))) {
      console.log("User ID must be a number");
      return;
    }

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
    console.log(auth.userData.id, userId);
    if (auth.userData.id == Number(userId)) {
      naigate("/profile");
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
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
        <h3 className="text-slate-500">@{user.username}</h3>
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
