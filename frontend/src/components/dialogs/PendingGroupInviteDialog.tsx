import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RootState } from "@/redux/store";
import { format } from "date-fns";
import { Check, Dot, LoaderCircle, SearchX, TriangleAlert, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const PendingGroupInviteDialog = ({ type }: { type: string }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        {type == "icon" ? (
          <Button variant={"outline"} size={"icon"}>
            <Users className="w-5 h-5" />
          </Button>
        ) : type == "button" ? (
          <Button variant={"secondary"} className="rounded-full">
            Pending Invites
          </Button>
        ) : type == "drop-down-link" ? (
          <div className="text-sm relative w-full px-2 py-2 hover:bg-slate-100 rounded-sm cursor-pointer">
            <p>Pending Invites</p>
            {auth.userData.invites > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white">
                {auth.userData.invites}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Pending group invites</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 min-h-[400px] max-h-[400px]  overflow-auto pr-2">
          <GroupInvitesContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GroupInvitesContent = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const handleFetchGroups = () => {
    fetch(`http://localhost:8000/api/group/pending/invite`, { method: "GET", headers: { Authorization: `Bearer ${auth.token}` } })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.invites);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };

  const handleAcceptInvite = (inviteId) => {
    // accept invite

    fetch(`http://localhost:8000/api/group/invite/accept/${inviteId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        handleFetchGroups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeclineInvite = (inviteId) => {
    // decline invite
    fetch(`http://localhost:8000/api/group/invite/${inviteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        handleFetchGroups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    handleFetchGroups();
  }, [auth]);

  if (isLoading && groups.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-2">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && groups?.length === 0) {
    return (
      <div className="flex w-full h-full flex-col items-center justify-center gap-2">
        <SearchX className="w-10 h-10 text-gray-400" />
        <p>No pending invites</p>
      </div>
    );
  }

  return groups.map((group, index) => {
    return (
      <div key={index} className="border rounded-md px-2 group hover:bg-gray-50">
        <div className="flex justify-between items-center">
          <DialogTrigger className="flex w-fit justify-start gap-5 py-2 cursor-pointer" onClick={() => navigate(`/group/${group.group_id}`)}>
            <Avatar className="border">
              <AvatarImage src={group.img_url} className="object-cover w-full h-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-start">
              <div className="flex gap-2 items-center">
                <h1 className="text-sm line-clamp-1 font-semibold">{group.title}</h1>
                <div className="flex items-center text-gray-400">
                  <Dot />
                  <h1 className="text-xs font-normal">{group.status}</h1>
                </div>
              </div>
              <p className="text-xs text-gray-500 w-fit">{format(new Date(group.created_at), "Pp")}</p>
            </div>
          </DialogTrigger>
          <div className="flex gap-2">
            <Button size={"icon"} variant={"ghost"} className="w-8 h-8" onClick={() => handleAcceptInvite(group.id)}>
              <Check className="w-5 h-5 text-green-500" />
            </Button>

            <Dialog open={isOpenAlert} onOpenChange={() => setIsOpenAlert(!isOpenAlert)}>
              <DialogTrigger asChild>
                <Button size={"icon"} variant={"ghost"} className="w-8 h-8">
                  <X className="w-5 h-5 text-red-500" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex items-center gap-2">
                      <TriangleAlert className="text-destructive" />
                      <span>Decline Invite</span>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <h1>
                  Are you sure you want to decline the invite to join <span className="font-semibold">{group.title}</span> group?
                </h1>
                <div className="flex gap-2 justify-end">
                  <Button variant={"outline"} onClick={() => setIsOpenAlert(!isOpenAlert)}>
                    Cancel
                  </Button>
                  <Button variant={"destructive"} onClick={() => handleDeclineInvite(group.id)}>
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  });
};

export default PendingGroupInviteDialog;
