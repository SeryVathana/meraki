import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getToken } from "@/utils/HelperFunctions";
import { Dot, Ellipsis, LoaderCircle, Search, SearchX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DialogDescription } from "@radix-ui/react-dialog";

const GroupMembersDialog = ({ group, type }: { group: any; type: string }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == "link" ? (
          <Button variant={"link"} className="rounded-full px-0" disabled={group?.status == "private" && !group.is_member}>
            {group?.members} members
          </Button>
        ) : (
          <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ">Members</p>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Members</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search groups..." className="pr-10 " value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.trim())} />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" />
            </div>
          </div>
        </DialogHeader>
        <div className="min-h-[400px] max-h-[400px]  overflow-auto pr-2">
          <GroupMemberContent group={group} searchQuery={searchQuery} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GroupMemberContent = ({ group, searchQuery }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFetchGroupMembers = () => {
    setIsLoading(true);
    // fetch group members
    fetch(`http://127.0.0.1:8000/api/group/member/${group.id}?` + new URLSearchParams({ q: searchQuery }), {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length < 2) return;
    handleFetchGroupMembers();
  }, [group, searchQuery]);

  useEffect(() => {
    // Store the interval id in a const, so you can cleanup later
    const intervalId = setInterval(() => {
      handleFetchGroupMembers();
    }, 5000);

    return () => {
      // Since useEffect dependency array is empty, this will be called only on unmount
      clearInterval(intervalId);
    };
  }, []);

  if (members.length == 0 && !isLoading) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <SearchX className="w-10 h-10 text-gray-400" />
        <h1>No member found.</h1>
      </div>
    );
  }

  if (members.length == 0 && isLoading) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
      {members.map((user, index) => {
        return (
          <div key={index} className="flex w-full justify-between px-2 py-2 rounded-md border-[1px]">
            <div className="flex w-full gap-5">
              <Avatar className="hover:border-2 cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                <AvatarImage src={user.pf_img_url} className="object-cover w-full h-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex gap-2 items-center">
                <h1 className="text-md hover:underline hover:text-primary cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex items-center text-gray-400 cursor-default">
                  <Dot />
                  {user.group_role == "admin" ? (
                    <h1 className="text-xs font-normal cursor-default">group admin</h1>
                  ) : (
                    <h1 className="text-xs font-normal cursor-default">group member</h1>
                  )}
                </div>
              </div>
            </div>
            {
              // check if user is group admin
              group.owner_id != user.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="z-10" size={"icon"}>
                      <Ellipsis className="w-4 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {group.is_member && group.is_admin && user.group_role != "admin" && (
                      <DropdownMenuItem asChild>
                        <PromotionDialog user={user} handleFetchGroupMembers={handleFetchGroupMembers} />
                      </DropdownMenuItem>
                    )}
                    {user.user_id != auth.userData.id && group.owner_id != user.user_id && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <RemoveUserDialog group={group} user={user} handleFetchGroupMembers={handleFetchGroupMembers} />
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
            {/* )} */}
          </div>
        );
      })}
    </div>
  );
};

const PromotionDialog = ({ user, handleFetchGroupMembers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePromoteUser = (id) => {
    // promote user to group admin
    fetch(`http://localhost:8000/api/group/promote/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpen(false);
        handleFetchGroupMembers();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <p className="text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer">Promote to admin</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Group Promotion</DialogTitle>
          <DialogDescription>
            <h1>Are you sure you want to promote user to group admin?</h1>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Avatar className="border">
            <AvatarImage src={user.pf_img_url} className="object-cover w-full h-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">
              {user.first_name} {user.last_name}
            </h1>
            <h1 className="text-sm text-gray-500">{user.email}</h1>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant={"default"} onClick={() => handlePromoteUser(user.id)}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RemoveUserDialog = ({ user, group, handleFetchGroupMembers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveUser = () => {
    // remove user from group
    fetch(`http://localhost:8000/api/group/member/${group.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpen(false);
        handleFetchGroupMembers();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <p className="text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer">Remove User</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="">Remove User</DialogTitle>
        </DialogHeader>
        <h1>Are you sure you want to remove user from group?</h1>
        <div className="flex gap-2 items-center">
          <Avatar className="border">
            <AvatarImage src={user.pf_img_url} className="object-cover w-full h-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">
              {user.first_name} {user.last_name}
            </h1>
            <h1 className="text-sm text-gray-500">{user.email}</h1>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"outline"}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant={"destructive"} onClick={() => handleRemoveUser()}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupMembersDialog;
