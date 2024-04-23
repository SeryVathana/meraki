import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dot, Pin, PinOff, Search } from "lucide-react";
import { Button } from "../ui/button";

const myFolders = [
  {
    id: "1",
    img_url: "https://github.com/shadcn.png",
    group_name: "Kab Jak",
    isPublic: true,
  },
  {
    id: "2",
    img_url: "https://github.com/shadcn.png",
    group_name: "Informationo Technology and Engineering",
    isPublic: false,
  },
  {
    id: "3",
    img_url: "https://github.com/shadcn.png",
    group_name: "Royal University of Phnom Penh",
    isPublic: true,
  },
];

const SavePostDialog = ({ postId, handleSavePost }: { postId: string; handleSavePost: Function }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"icon"}
          className={cn(
            "hidden absolute top-3 right-3 z-10 group-hover:flex bg-white text-primary bg-opacity-70 hover:bg-opacity-100 hover:border-primary"
          )}
        >
          <Pin className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">My Folder</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search groups..." className="pr-10 " />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" />
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden">
          {myFolders.map((group, index) => {
            return (
              <DialogTrigger asChild key={index}>
                <Button
                  key={group.id}
                  className="flex w-full justify-start gap-5 py-7"
                  variant={"outline"}
                  onClick={() => handleSavePost(postId.toString())}
                >
                  <Avatar className="">
                    <AvatarImage src={group.img_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex gap-2 items-center">
                    <h1 className="text-lg">{group.group_name}</h1>
                    <Dot className="text-gray-500" />
                    <p className="text-gray-500">{group.isPublic ? "public" : "private"}</p>
                  </div>
                </Button>
              </DialogTrigger>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavePostDialog;
