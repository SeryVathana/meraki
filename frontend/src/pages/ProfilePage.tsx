import PostsContainer from "@/components/PostsContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { NavLink, useSearchParams } from "react-router-dom";

const ProfilePage = () => {
  const [postParams] = useSearchParams("my-posts");

  const myParam = postParams.get("post");

  return (
    <div className="">
      <div className="flex flex-col gap-2 items-center my-10">
        <Avatar className="w-32 h-32">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="text-4xl font-bold tracking-tight lg:text-3xl">Sery Vathana</h1>
        <h3 className="text-slate-500">yooseryvathana@gmail.com</h3>

        <div className="flex gap-5">
          <p>1 follower</p>

          <p>2 following</p>
        </div>

        <div className="flex gap-5 mt-5">
          <Button className="rounded-full">Group</Button>
          <Button className="rounded-full">Edit Profile</Button>
        </div>

        <div className="flex gap-10 mt-10">
          <NavLink to={"/profile?post=my-posts"} className={cn(myParam === "my-posts" ? "underline" : "")}>
            Created
          </NavLink>
          <NavLink to={"/profile?post=saved-posts"} className={cn(myParam === "saved-posts" ? "underline" : "")}>
            Saved
          </NavLink>
        </div>
      </div>
      <PostsContainer />
    </div>
  );
};

export default ProfilePage;
