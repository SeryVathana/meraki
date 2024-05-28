import PostsContainer from "@/components/PostsContainer";
import CreateGroupPostDialog from "@/components/dialogs/CreateGroupPostDialog";
import EditGroupDialog from "@/components/dialogs/EditGroupDialog";
import GroupAddMembersDialog from "@/components/dialogs/GroupAddMembersDialog";
import GroupJoinRequests from "@/components/dialogs/GroupJoinRequests";
import GroupMembersDialog from "@/components/dialogs/GroupMembersDialog";
import GroupPostRequests from "@/components/dialogs/GroupPostRequests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { Dot, Ellipsis, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";

const GroupPage = () => {
  const [isPublicGroup, setIsPublicGroup] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const [group, setGroup] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const { groupId } = useParams();

  const handleFetchGroupInfo = () => {
    fetch(`http://localhost:8000/api/group/${groupId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 404) {
          navigate("/groups");
          return;
        }
        console.log(data);
        setGroup(data.group);
      })
      .catch((err) => {
        navigate("/groups");
      });
  };

  useEffect(() => {
    // fetch group data
    handleFetchGroupInfo();
  }, [groupId]);

  useEffect(() => {
    if (group) {
      if (group.status === "private") {
        setIsPublicGroup(false);
      }
    }
  }, [group]);

  const handleFetchGroupPosts = () => {
    fetch(`http://localhost:8000/api/post/group/${groupId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  };

  useEffect(() => {
    if (!group) {
      return;
    }
    //fetch group posts
    handleFetchGroupPosts();
  }, [group]);

  useEffect(() => {
    if (group) {
      if (group.owner_id === auth.userData.id) {
        setIsOwner(true);
      }

      if (group.is_member) {
        setIsMember(true);
      }
    }
  }, [group, auth]);

  if (!group) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-[35vh] bg-gray-400 rounded-2xl">
        <img
          src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Image"
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="z-40  group absolute rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 border-4 border-white">
          <Avatar className=" w-40 h-40 border-gray-200">
            <AvatarImage src={group.img_url} className="w-full h-full object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 relative w-full mt-5">
        <h1 className="text-4xl font-bold tracking-tight lg:text-3xl  mt-12">{group.title}</h1>

        <div className="flex items-center gap-5">
          <p>{capitalizeFirstLetter(group.status)} group</p>
          <Dot className="" />
          <GroupMembersDialog group={group} type="link" />
        </div>

        <div className="w-full flex justify-center gap-5">
          {isMember ? (
            <CreateGroupPostDialog group={group} handleFetchGroupPosts={handleFetchGroupPosts} />
          ) : (
            <Button className="rounded-full">Request Join</Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="" size={"icon"} variant={"secondary"}>
                <Ellipsis className="w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <GroupMembersDialog group={group} type="dropdown" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <GroupJoinRequests group_id="1" type="dropdown" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <GroupPostRequests group_id="1" type="dropdown" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <GroupAddMembersDialog group_id="1" type="dropdown" />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <EditGroupDialog group={group} handleFetchGroupInfo={handleFetchGroupInfo} type="dropdown" />
              </DropdownMenuItem>

              {isOwner ? null : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Leave group</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="my-10">
        {isPublicGroup || setIsMember ? (
          posts.length > 0 ? (
            <div className="mt-10">
              <PostsContainer posts={posts} />
            </div>
          ) : (
            <h1>No post yet.</h1>
          )
        ) : (
          <h1>Private group</h1>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
