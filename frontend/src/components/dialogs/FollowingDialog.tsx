import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, Lock, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { User } from "@/redux/slices/authSlice";
import { capitalizeFirstLetter } from "@/utils/HelperFunctions";

const userFollowers = [
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

const userFollowings = [
  {
    id: "4",
    img_url: "https://github.com/shadcn.png",
    username: "Kimmy",
  },
  {
    id: "5",
    img_url: "https://github.com/shadcn.png",
    username: "Vathy",
  },
  {
    id: "6",
    img_url: "https://github.com/shadcn.png",
    username: "Nymoly",
  },
];

const myFollowing = ["1", "3", "5"];

const FollowingDialog = ({ user }: { user: User }) => {
  const [followings, setFollowings] = useState(userFollowings);
  const [myFollowings, setMyFollowings] = useState(myFollowing);

  const navigate = useNavigate();
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
        {followings.map((user, index) => {
          return (
            <DialogTrigger asChild key={index}>
              <Button
                key={user.id}
                className="flex w-full justify-start gap-5 py-7"
                variant={"outline"}
                onClick={() => navigate(`/group?id=${user.id}`)}
              >
                <Avatar className="">
                  <AvatarImage src={user.img_url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex gap-2 items-center">
                  <h1 className="text-lg">{user.username}</h1>
                  {myFollowings.includes(user.id) ? (
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
      </DialogContent>
    </Dialog>
  );
};

export default FollowingDialog;
