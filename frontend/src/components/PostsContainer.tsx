import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dot, Heart, Pin, PinOff, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mockData from "../db/mock-post.json";

import { useEffect, useState } from "react";

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

const PostsContainer = () => {
  const navigate = useNavigate();

  const [data, setData]: any[] = useState<any[]>(mockData);

  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const handleSavePost = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts((prev) => {
        const indexToRemove = prev.indexOf(postId);
        if (indexToRemove !== -1) {
          // Create a new array without the item to remove
          const updatedPosts = [
            ...prev.slice(0, indexToRemove),
            ...prev.slice(indexToRemove + 1),
          ];
          return updatedPosts;
        }
        // If the item is not found, return the original array
        return prev;
      });
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  const handleLikePost = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts((prev) => {
        const indexToRemove = prev.indexOf(id);
        if (indexToRemove !== -1) {
          // Create a new array without the item to remove
          const updatedPosts = [
            ...prev.slice(0, indexToRemove),
            ...prev.slice(indexToRemove + 1),
          ];
          return updatedPosts;
        }
        // If the item is not found, return the original array
        return prev;
      });
    } else {
      setLikedPosts([...savedPosts, id]);
    }
  };

  useEffect(() => {
    console.log(savedPosts);
    console.log(savedPosts.includes("13"));
  }, [savedPosts]);

  if (!data) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-5 xl:px-10 2xl:px-0 gap-5 space-y-5 mt-3">
      {data.map((post: any, index: number) => {
        return (
          <div
            className="group relative border-[1px] rounded-2xl overflow-hidden cursor-pointer"
            key={index}
          >
            {savedPosts.includes(post.id) ? (
              <Button
                variant={"secondary"}
                size={"icon"}
                className={cn(
                  "hidden absolute top-3 right-3 z-10 group-hover:flex hover:border-primary bg-primary text-secondary bg-opacity-70 hover:bg-opacity-100 hover:bg-primary"
                )}
                onClick={() => handleSavePost(post.id)}
              >
                <Pin className="w-5 h-5" />
              </Button>
            ) : (
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
                    <DialogTitle className="my-3 flex items-center">
                      My Folder
                    </DialogTitle>
                    <div className="flex gap-2">
                      <div className="relative w-full mr-auto">
                        <Input
                          placeholder="Search groups..."
                          className="pr-10 "
                        />
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
                            onClick={() => handleSavePost(post.id)}
                          >
                            <Avatar className="">
                              <AvatarImage src={group.img_url} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="flex gap-2 items-center">
                              <h1 className="text-lg">{group.group_name}</h1>
                              <Dot className="text-gray-500" />
                              <p className="text-gray-500">
                                {group.isPublic ? "public" : "private"}
                              </p>
                            </div>
                          </Button>
                        </DialogTrigger>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button
              variant={"secondary"}
              size={"icon"}
              className={cn(
                "hidden absolute bottom-3 right-3 z-10 group-hover:flex bg-white text-primary bg-opacity-70 hover:bg-opacity-100 hover:border-primary",
                likedPosts.includes(String(post.id))
                  ? "bg-primary text-secondary bg-opacity-70 hover:bg-opacity-100 hover:bg-primary"
                  : ""
              )}
              onClick={() => handleLikePost(String(post.id))}
            >
              <Heart className="w-5 h-5" />
            </Button>

            <div
              className="hidden group-hover:flex absolute bottom-3 left-3 z-10 gap-2 items-center"
              onClick={() => navigate(`/user?id=${1}`)}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-white ">
                <h1 className="font-medium text-sm">Sery Vathana</h1>
              </div>
            </div>

            <div key={index} onClick={() => navigate(`/post?id=${post.id}`)}>
              <img className="w-full bg-gray-300" src={post.img_url} alt="" />
              <div className="hidden group-hover:flex">
                <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gray-900" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsContainer;
