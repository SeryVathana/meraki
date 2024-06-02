import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const pendingRequests = [
  {
    id: "1",
    img_url: "https://github.com/shadcn.png",
    username: "Kim",
  },
  {
    id: "2",
    img_url: "https://github.com/shadcn.png",
    username: "Vath",
  },
  {
    id: "3",
    img_url: "https://github.com/shadcn.png",
    username: "Nymol",
  },
];

const GroupPostRequests = ({ group_id, type }: { group_id: string; type: string }) => {
  const [requests, setRequests] = useState(pendingRequests);

  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == "button" ? (
          <Button variant={"secondary"} className="rounded-full px-0">
            Post Requests
          </Button>
        ) : (
          <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer ">Post requests</p>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Pending requests</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden">
          {requests.map((user, index) => {
            return (
              <div key={index} className="flex w-full justify-between px-2 py-2 rounded-md border-[1px]">
                <div className="flex w-full gap-5">
                  <Avatar className="hover:border-2 cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                    <AvatarImage src={user.img_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex gap-2 items-center">
                    <h1 className="text-md hover:underline hover:text-primary cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                      {user.username}
                    </h1>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant={"ghost"} className="z-10 text-green-500" size={"icon"}>
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
      </DialogContent>
    </Dialog>
  );
};

export default GroupPostRequests;
