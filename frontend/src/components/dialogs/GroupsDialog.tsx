import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToken } from "@/utils/HelperFunctions";
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, LoaderCircle, Lock, Search, SearchX, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const GroupsDialog = ({ userId, type }: { userId: number; type: string }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("none");
  const [searchType, setSearchType] = useState<string>("none");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == "icon" ? (
          <div className="relative">
            <Button variant={"outline"} size={"icon"}>
              <Users className="w-5 h-5" />
            </Button>
            {auth.userData.group_req > 0 && (
              <div className="absolute -right-1 -top-1 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white">
                {auth.userData.group_req}
              </div>
            )}
          </div>
        ) : type == "button" ? (
          <Button variant={"secondary"} className="rounded-full">
            Groups
          </Button>
        ) : type == "drop-down-link" ? (
          <div className="text-sm relative w-full px-2 py-2 hover:bg-slate-100 rounded-sm cursor-pointer">
            <p>My Groups</p>
            {auth.userData.group_req > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white">
                {auth.userData.group_req}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">My Groups</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search groups..." className="pr-10 " value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
  const auth = useSelector((state: RootState) => state.auth);
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setIsLoading(true);
    fetch(`http://localhost:8000/api/group/mygroups?` + new URLSearchParams({ search: searchQuery, type: searchType, status: searchStatus }), {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
      signal,
    })
      .then((res) => res.json())
      .then((data) => setGroups(data.groups))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));

    return () => {
      abortController.abort();
      setGroups([]);
    };
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
                className="flex relative w-full justify-start gap-5 py-7"
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
                {group.req_count > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-[5px] py-[0px] text-xs rounded-full bg-destructive text-white">
                    {auth.userData.group_req}
                  </div>
                )}
              </Button>
            </DialogTrigger>
          )
        );
      })}
    </div>
  );
};

export default GroupsDialog;
