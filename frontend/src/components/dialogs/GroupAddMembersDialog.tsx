import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getToken } from "@/utils/HelperFunctions";
import { Dot, LoaderCircle, Search, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const GroupAddMembersDialog = ({ group, type }: { group: any; type: string }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == "button" ? (
          <Button variant={"secondary"} className="rounded-full px-0">
            Invite users
          </Button>
        ) : (
          <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer">Invite users</p>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Invite Users</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search users..." className="pr-10 " value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" />
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-2 min-h-[400px] max-h-[400px]  overflow-auto pr-2">
          <UserContent group={group} searchQuery={searchQuery} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserContent = ({ group, searchQuery }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(0);
  const [isCanceling, setIsCanceling] = useState(0);
  const navigate = useNavigate();

  const handleFetchUsers = () => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/group/notmember/${group.id}?` + new URLSearchParams({ q: searchQuery }), {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateInvite = (userId) => {
    setIsInviting(userId);
    const reqBody = {
      user_id: userId,
    };
    fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/${group.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        handleFetchUsers();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        //delay to show inviting state
        setTimeout(() => {
          setIsInviting(0);
        }, 1000);
      });
  };

  const handleUninvite = (userId) => {
    setIsCanceling(userId);
    fetch(`${import.meta.env.VITE_SERVER_URL}/group/invite/${group.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        handleFetchUsers();
      })
      .catch((err) => console.log(err))
      .finally(() =>
        //delay to show inviting state
        // setIsCanceling(0);
        setTimeout(() => {
          setIsCanceling(0);
        }, 1000)
      );
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length < 2) return;
    handleFetchUsers();
  }, [group, searchQuery]);

  if (isLoading && users?.length == 0) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && users?.length == 0) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <SearchX className="w-10 h-10 text-gray-400" />
        <h1>No users found.</h1>
      </div>
    );
  }

  return users.map((user, index) => {
    return (
      <div key={index} className="flex w-full justify-between px-2 py-2 rounded-md border-[1px]">
        <div className="flex w-full gap-5">
          <Avatar className="hover:border-2 cursor-pointer border" onClick={() => navigate(`/user/${user.id}`)}>
            <AvatarImage src={user.pf_img_url} className="object-cover w-full h-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex gap-2 items-center">
            <div>
              <h1 className="text-md hover:underline hover:text-primary cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            {user.is_following ? (
              <div className="flex items-center text-gray-400 cursor-default">
                <Dot />
                <h1 className="text-xs font-normal cursor-default">following</h1>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {user.is_invited ? (
          <Button
            variant={"secondary"}
            className={cn("z-10 bg-primary-foreground")}
            disabled={isCanceling == user.id}
            onClick={() => handleUninvite(user.id)}
          >
            {isCanceling == user.id ? "Canceling..." : "Cancle Invite"}
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className={cn("z-10 bg-primary/10")}
            disabled={isInviting == user.id}
            onClick={() => handleCreateInvite(user.id)}
          >
            {isInviting != user.id ? "Invite" : "Inviting..."}
          </Button>
        )}
      </div>
    );
  });
};
export default GroupAddMembersDialog;
