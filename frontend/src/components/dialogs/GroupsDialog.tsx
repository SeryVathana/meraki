import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToken } from "@/utils/HelperFunctions";
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, LoaderCircle, Lock, Search, SearchX, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

const GroupsDialog = ({ userId, type }: { userId: number; type: string }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("none");
  const [searchType, setSearchType] = useState<string>("none");

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
          <p className="text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer">My Groups</p>
        ) : (
          ""
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">My Groups</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search groups..." className="pr-10 " value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.trim())} />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" />
            </div>
            <Select defaultValue="none" onValueChange={(val) => setSearchStatus(val)}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-fit">
                <SelectItem value="none">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="none" onValueChange={(val) => setSearchType(val)}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="">
                  All
                </SelectItem>
                <SelectItem value="my-group">Created</SelectItem>
                <SelectItem value="joined-group">Joined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <div className="min-h-[400px] max-h-[400px] overflow-auto pr-2">
          <GroupDialogContent userId={userId} searchQuery={searchQuery} searchStatus={searchStatus} searchType={searchType} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GroupDialogContent = ({ userId, searchQuery, searchStatus, searchType }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8000/api/group/mygroups?` + new URLSearchParams({ search: searchQuery, type: searchType, status: searchStatus }), {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => setGroups(data.groups))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [userId, searchQuery, searchStatus, searchType]);

  if (isLoading && groups.length == 0) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && groups.length == 0) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <SearchX className="w-10 h-10 text-gray-400" />
        <h1>No group found.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
      {groups?.map((group, index) => {
        return (
          group && (
            <DialogTrigger asChild key={index}>
              <Button
                key={group.id}
                className="flex w-full justify-start gap-5 py-7"
                variant={"outline"}
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <Avatar className="">
                  <AvatarImage src={group?.img_url} className="w-full h-full object-cover" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex gap-2 items-center">
                  <h1 className="text-lg">{group.title}</h1>
                  <Dot className="text-gray-500" />
                  <p className="text-gray-500">{group.status == "public" ? "public" : "private"}</p>
                </div>
              </Button>
            </DialogTrigger>
          )
        );
      })}
    </div>
  );
};

export default GroupsDialog;
