import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, LoaderCircle, Lock, Search, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { User } from "@/redux/slices/authSlice";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";

const FollowingDialog = ({ user }: { user: User }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} className="rounded-full px-0">
          {user.followings} followings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="mb-3 flex items-center">{capitalizeFirstLetter(user.first_name)}'s followings </DialogTitle>
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
        <div className="min-h-[400px] max-h-[400px]  overflow-auto pr-2">
          <FollowingContent user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FollowingContent = ({ user }) => {
  const navigate = useNavigate();
  const [followings, setFollowings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchFollowings = () => {
    setIsLoading(true);
    // fetch user followings
    fetch(`http://localhost:8000/api/user/following/${user.id}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowings(data.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    handleFetchFollowings();
  }, []);

  if (followings.length == 0 && !isLoading) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <SearchX className="w-10 h-10 text-gray-400" />
        <h1>No folling found.</h1>
      </div>
    );
  }

  if (followings.length == 0 && isLoading) {
    return (
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    followings && (
      <div className="space-y-1">
        {followings.map((user, index) => {
          return (
            <DialogTrigger asChild key={index}>
              <Button key={user.id} className="flex w-full justify-start gap-5 py-7" variant={"outline"} onClick={() => navigate(`/user/${user.id}`)}>
                <Avatar className="">
                  <AvatarImage src={user.pf_img_url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex gap-2 items-center">
                  <h1 className="text-lg">{user.first_name + " " + user.last_name}</h1>
                  {user.is_following ? (
                    <div className="flex items-center text-gray-400">
                      <Dot />
                      <h1 className="text-xs font-normal">followed</h1>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Button>
            </DialogTrigger>
          );
        })}
      </div>
    )
  );
};

export default FollowingDialog;
