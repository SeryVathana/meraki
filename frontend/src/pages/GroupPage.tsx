import PostsContainer from "@/components/PostsContainer";
import CreateGroupPostDialog from "@/components/dialogs/CreateGroupPostDialog";
import EditGroupDialog from "@/components/dialogs/EditGroupDialog";
import GroupAddMembersDialog from "@/components/dialogs/GroupAddMembersDialog";
import GroupJoinRequestsDailog from "@/components/dialogs/GroupJoinRequestsDailog";
import GroupMembersDialog from "@/components/dialogs/GroupMembersDialog";
import GroupPostRequests from "@/components/dialogs/GroupPostRequests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RootState } from "@/redux/store";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { Dialog } from "@radix-ui/react-dialog";
import { set } from "date-fns";
import { Dot, Ellipsis, LoaderCircle, Pen, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

const GroupPage = () => {
  const [isPublicGroup, setIsPublicGroup] = useState<boolean>(true);
  const [group, setGroup] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const auth = useSelector((state: RootState) => state.auth);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  const { groupId } = useParams();

  const handleFetchGroupInfo = () => {
    fetch(`http://localhost:8000/api/group/${groupId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setGroup(data.group);
      })
      .finally(() => setIsLoading(false));
  };

  const handleFetchGroupPosts = () => {
    setIsLoading(true);
    fetch(`http://localhost:8000/api/post/group/${groupId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
      .finally(() => setIsLoading(false));
  };

  const handleJoinPublicGroup = () => {
    fetch(`http://localhost:8000/api/group/public/join/${groupId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setIsMember(true);
        handleFetchGroupInfo();
      });
  };

  const handleRequestJoinPrivateGroup = () => {
    setIsRequesting((prev) => !prev);
    fetch(`http://localhost:8000/api/group/request/${groupId}`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          handleFetchGroupInfo();
        } else {
          setIsRequesting((prev) => !prev);
        }
      })
      .catch((err) => {
        setIsRequesting((prev) => !prev);
      });
  };

  const handleLeaveGroup = () => {
    fetch(`http://localhost:8000/api/group/leave/${groupId}`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setIsMember(false);
        handleFetchGroupInfo();
      })
      .finally(() => {
        setOpenAlert(false);
      });
  };

  const handleAcceptInvite = () => {
    fetch(`http://localhost:8000/api/group/invite/accept/${group.invite_id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        handleFetchGroupInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // fetch group data
    setIsLoading(true);
    handleFetchGroupInfo();
  }, [groupId]);

  useEffect(() => {
    if (group) {
      if (group?.status === "private") {
        setIsPublicGroup(false);
      }
    }
  }, [group]);

  useEffect(() => {
    if (!group || (group.status == "private" && group.is_member === false)) {
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

      if (group.is_requesting) {
        setIsRequesting(true);
      }

      if (group.status === "public") {
        setIsPublicGroup(true);
      } else {
        setIsPublicGroup(false);
      }
    }
  }, [group, auth]);

  if (!group && isLoading) {
    return (
      <div className="w-full h-[80vh] flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!group && !isLoading) {
    return <NotFoundPage />;
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
            <AvatarImage src={group?.img_url} className="w-full h-full object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 relative w-full mt-5">
        <h1 className="text-4xl font-bold tracking-tight lg:text-3xl  mt-12">{group?.title}</h1>

        <div className="flex items-center gap-5">
          <p>{capitalizeFirstLetter(group?.status)} group</p>
          <Dot className="" />
          <GroupMembersDialog group={group} type="link" />
        </div>

        <div className="w-full flex justify-center gap-5">
          {group.is_inviting ? (
            <Button variant="default" className="rounded-full" onClick={() => handleAcceptInvite()}>
              Accept Invite
            </Button>
          ) : isMember ? (
            <CreateGroupPostDialog group={group} handleFetchGroupPosts={handleFetchGroupPosts} />
          ) : group?.status === "public" ? (
            <Button className="rounded-full" onClick={() => handleJoinPublicGroup()}>
              Join Group
            </Button>
          ) : group.is_requesting ? (
            <Button className="rounded-full" variant="secondary" onClick={() => handleRequestJoinPrivateGroup()}>
              Cancel Request
            </Button>
          ) : (
            <Button className="rounded-full" onClick={() => handleRequestJoinPrivateGroup()}>
              Request Join
            </Button>
          )}

          {isMember && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <Button className="" size={"icon"} variant={"secondary"}>
                    <Ellipsis className="w-5" />
                  </Button>
                  {auth.userData.group_req > 0 && (
                    <div className="absolute -right-1 -top-1 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white">
                      {auth.userData.group_req}
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <>
                    <GroupMembersDialog group={group} type="dropdown" />
                  </>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <>
                    <GroupJoinRequestsDailog group={group} type="dropdown" />
                  </>
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    {isPublicGroup ?? (
                      <DropdownMenuItem asChild>
                        <>
                          <GroupJoinRequestsDailog group={group} type="dropdown" />
                        </>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <>
                        <GroupAddMembersDialog group={group} type="dropdown" />
                      </>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <>
                        <EditGroupDialog group={group} handleFetchGroupInfo={handleFetchGroupInfo} type="dropdown" />
                      </>
                    </DropdownMenuItem>
                    {/* <DropdownMenuSeparator /> */}
                  </>
                )}

                {isOwner ? null : (
                  <>
                    <DropdownMenuItem asChild>
                      <Dialog open={openAlert} onOpenChange={() => setOpenAlert(!openAlert)}>
                        <DialogTrigger asChild>
                          <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ">Leave Group</p>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave Group</DialogTitle>
                          </DialogHeader>
                          <h1>Are you sure you want to leave the group?</h1>
                          <div className="flex gap-2 justify-end">
                            <Button variant={"destructive"} onClick={() => handleLeaveGroup()}>
                              Yes
                            </Button>
                            <Button variant={"default"} onClick={() => setOpenAlert(false)}>
                              No
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="my-10">
        {isPublicGroup || isMember ? (
          posts?.length > 0 ? (
            <div className="mt-10">
              <PostsContainer posts={posts} />
            </div>
          ) : isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <h1>No post yet.</h1>
          )
        ) : (
          <h1>Join group to view posts.</h1>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
