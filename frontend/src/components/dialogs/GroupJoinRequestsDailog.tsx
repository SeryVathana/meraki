import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getToken } from "@/utils/HelperFunctions";
import { Check, LoaderCircle, SearchX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

const GroupJoinRequestsDialog = ({ group, type }: { group: any; type: string }) => {
  const auth = useSelector((state: RootState) => state.auth);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == "button" ? (
          <Button variant={"secondary"} className="rounded-full px-0">
            Join Requests
          </Button>
        ) : (
          <div
            className={cn(
              "text-sm relative w-full px-2 py-2 hover:bg-slate-100 rounded-sm cursor-pointer",
              auth.userData.group_req > 0 && "min-w-[150px]"
            )}
          >
            <p>Join Requests</p>
            {auth.userData.group_req > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white">
                {auth.userData.group_req}
              </div>
            )}
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Pending requests</DialogTitle>
        </DialogHeader>
        <div className="min-h-[400px] max-h-[400px]  overflow-auto pr-2">
          <GroupJoinRequestsContent groupId={group.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupJoinRequestsDialog;

const GroupJoinRequestsContent = ({ groupId }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFetchRequests = () => {
    setIsLoading(true);
    // fetch requests
    fetch(`${import.meta.env.VITE_SERVER_URL}/group/request/pending/${groupId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAcceptRequest = (reqId) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/group/request/accept/${reqId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        handleFetchRequests();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFetchRequests();
  }, [groupId]);

  if (isLoading && requests?.length == 0) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && requests?.length == 0) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <SearchX className="w-10 h-10 text-gray-400" />
        <h1>No request found.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
      {requests.map((req, index) => {
        return (
          <div key={index} className="flex w-full justify-between px-2 py-2 rounded-md border-[1px]">
            <div className="flex w-full gap-5">
              <Avatar className="hover:border-2 cursor-pointer" onClick={() => navigate(`/user/${req.user_id}`)}>
                <AvatarImage src={req.pf_img_url} className="object-cover w-full h-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex gap-2 items-center">
                <h1 className="text-md hover:underline hover:text-primary cursor-pointer" onClick={() => navigate(`/user/${req.user_id}`)}>
                  {req.first_name} {req.last_name}
                </h1>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant={"ghost"} className="z-10 text-green-500" size={"icon"} onClick={() => handleAcceptRequest(req.id)}>
                <Check />
              </Button>
              <Button variant={"ghost"} className="z-10 text-red-500" size={"icon"}>
                <X />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
