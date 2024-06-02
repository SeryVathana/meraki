import PostsContainer from "@/components/PostsContainer";
import CreateFolderDialog from "@/components/dialogs/CreateFolderDialog";
import FollowerDialog from "@/components/dialogs/FollowerDialog";
import FollowingDialog from "@/components/dialogs/FollowingDialog";
import GroupsDialog from "@/components/dialogs/GroupsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import data from "@/db/mock-post.json";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { set } from "date-fns";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

const ProfilePage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [params] = useSearchParams("my-posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const user = auth?.userData;

  const postParam = params.get("post");

  const getFullName = () => {
    if (auth?.userData.first_name && auth?.userData.last_name) {
      return `${capitalizeFirstLetter(auth?.userData.first_name)} ${capitalizeFirstLetter(auth?.userData.last_name)}`;
    } else {
      return auth?.userData.email;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:8000/api/post/mypost", { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
      .finally(() => setIsLoading(false));
  }, [auth.token]);

  const handleFetchFolders = () => {
    fetch("http://localhost:8000/api/folder", { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setFolders(data.folders);
      });
  };
  useEffect(() => {
    // fetch my folders
    if (postParam === "saved-posts") {
      handleFetchFolders();
    }
  }, [postParam]);

  return (
    <div className="min-h-[100vh]">
      <div className="flex flex-col items-center my-10 space-y-2">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="w-32 h-32 rounded-full relative group">
            <Avatar className="w-32 h-32 border group-hover:border-4 border-gray-200">
              <AvatarImage src={user.pf_img_url ? user.pf_img_url : ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>

        <div className="max-w-10px">
          <h1 className="text-4xl font-bold tracking-tight lg:text-3xl break-words text-wrap">{getFullName()}</h1>
        </div>
        <h3 className="text-slate-500">@{user?.username}</h3>
        <h3 className="text-slate-500">{user?.email}</h3>

        <div className="flex gap-5">
          <FollowerDialog user={user} />
          <FollowingDialog user={user} />
        </div>

        <div className="flex gap-5">
          <GroupsDialog userId={user.id} type="button" />
          <Button className="rounded-full" onClick={() => navigate("/profile/setting")}>
            Edit Profile
          </Button>
        </div>

        <div className="flex gap-10 pt-10">
          <NavLink to={"/profile?post=my-posts"} className={cn(postParam === "my-posts" || !postParam ? "underline text-primary" : "")}>
            Created
          </NavLink>
          <NavLink to={"/profile?post=saved-posts"} className={cn(postParam === "saved-posts" ? "underline  text-primary" : "")}>
            Saved
          </NavLink>
        </div>
      </div>

      {postParam === "my-posts" || !postParam ? (
        posts && posts.length > 0 ? (
          <PostsContainer posts={posts} />
        ) : (
          <div className="flex py-10 w-full justify-center">
            {isLoading ? (
              <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-5 xl:px-10 2xl:px-0 gap-5">
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
                <Skeleton className="min-w-[100px] min-h-[150px] rounded-xl" />
              </div>
            ) : (
              <h1>No post found.</h1>
            )}
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          <div className="min-h-[300px]">
            <CreateFolderDialog handleFetchFolders={handleFetchFolders} />
          </div>
          {folders.map((folder, index) => {
            return (
              <div
                key={index}
                onClick={() => navigate(`/folder/${folder.id}`)}
                className="group border-[1px] min-h-[250px] xl:min-h-[300px] max-h-[300px] relative group cursor-pointer flex flex-col rounded-xl overflow-hidden"
              >
                <div className="hidden group-hover:flex group-hover:border justify-center items-center absolute w-full h-full bg-slate-100 bg-opacity-80 transition-opacity hover:opacity-100 opacity-0 duration-200">
                  <h1 className="max-w-[100px] max-h-[100px] truncate text-wrap text-center font-semibold">{folder.title}</h1>
                </div>
                <div className="w-full h-1/2 border-r-[1px]">
                  <img src={folder.saved_posts[0]?.img_url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-full h-1/2 flex border-t-[1px]">
                  <div className="w-1/2 h-full border-r-[1px]">
                    <img src={folder?.saved_posts[1]?.img_url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-1/2 h-full ">
                    <img src={folder?.saved_posts[2]?.img_url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
