import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, Lock, Search, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import { getToken } from "@/utils/HelperFunctions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const GroupsDialog = ({ userId, type }: { userId: number; type: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == "icon" ? (
          <Button variant={"outline"} size={"icon"}>
            <Users className="w-5 h-5" />
          </Button>
        ) : type == "button" ? (
          <Button variant={"secondary"} className="rounded-full">
            Groups
          </Button>
        ) : type == "drop-down-link" ? (
          <p className="text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm">My Groups</p>
        ) : (
          ""
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">My Groups</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search groups..." className="pr-10 " />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" />
            </div>
            <Select defaultValue="none">
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-fit">
                <SelectItem value="none">
                  <Ban className="h-4 text-gray-600" />
                </SelectItem>
                <SelectItem value="global">
                  <Globe className="h-4 text-gray-600" />
                </SelectItem>
                <SelectItem value="private">
                  <Lock className="h-4 text-gray-600" />
                </SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="none">
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <FilterX className="h-4 text-gray-600" />
                </SelectItem>
                <SelectItem value="private">
                  <ArrowUpAZ className="h-4 text-gray-600" />
                </SelectItem>
                <SelectItem value="global">
                  <ArrowDownAZ className="h-4 text-gray-600" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <GroupDialogContent userId={userId} />
      </DialogContent>
    </Dialog>
  );
};

const GroupDialogContent = ({ userId }: { userId: number }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/group/user/${userId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setGroups(data.group))
      .catch((err) => console.log(err));
  }, [userId]);

  if (groups.length == 0) {
    return (
      <div className="h-[20vh] w-full flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-h-[400px] max-h-[400px] overflow-y-auto overflow-x-hidden">
      {groups.map((group, index) => {
        return (
          <DialogTrigger asChild key={index}>
            <Button
              key={group.id}
              className="flex w-full justify-start gap-5 py-7"
              variant={"outline"}
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <Avatar className="">
                <AvatarImage src={group.img_url} className="w-full h-full object-cover" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex gap-2 items-center">
                <h1 className="text-lg">{group.title}</h1>
                <Dot className="text-gray-500" />
                <p className="text-gray-500">{group.status == "public" ? "public" : "private"}</p>
              </div>
            </Button>
          </DialogTrigger>
        );
      })}
    </div>
  );
};

export default GroupsDialog;
