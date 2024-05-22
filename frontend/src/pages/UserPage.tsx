import PostsContainer from "@/components/PostsContainer";
import FollowDialog from "@/components/dialogs/FollowDialog";
import GroupsDialog from "@/components/dialogs/GroupsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const UserPage = () => {
  const [postParams] = useSearchParams("");
  const idParam = postParams.get("id") || "";

  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleFollow = (id: string) => {
    if (followedUsers.includes(id)) {
      setFollowedUsers((prev) => {
        const indexToRemove = prev.indexOf(id);
        if (indexToRemove !== -1) {
          // Create a new array without the item to remove
          const updatedPosts = [...prev.slice(0, indexToRemove), ...prev.slice(indexToRemove + 1)];
          return updatedPosts;
        }
        // If the item is not found, return the original array
        return prev;
      });
    } else {
      setFollowedUsers([...followedUsers, id]);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-2 items-center my-10">
        <Avatar className="w-32 h-32">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="text-4xl font-bold tracking-tight lg:text-3xl">Sery Vathana</h1>
        <h3 className="text-slate-500">@znaazmz</h3>
        <h3 className="text-slate-500">yooseryvathana@gmail.com</h3>

        <div className="flex gap-5">
          <FollowDialog type="followers" user_id={idParam} />
          <FollowDialog type="followings" user_id={idParam} />
        </div>

        <div className="flex gap-5">
          <GroupsDialog user_id={idParam} type="button" />
          <Button className="rounded-full" variant={followedUsers.includes(idParam) ? "default" : "secondary"} onClick={() => handleFollow(idParam)}>
            {followedUsers.includes(idParam) ? "Follow" : "Followed"}
          </Button>
        </div>
      </div>
      <PostsContainer />
    </div>
  );
};

export default UserPage;
