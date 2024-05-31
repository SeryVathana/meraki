import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Dot, Pin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { posix } from "path";
import { getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { set } from "date-fns";

const SavePostDialog = ({ postId, isSaved }: { postId: number; isSaved: boolean }) => {
  const [folders, setFolders] = useState<any[]>([]);
  const [isSavedPost, setIsSavedPost] = useState<boolean>(isSaved);
  const handleSave = (folder) => {
    const reqBody = {
      post_id: postId,
      folder_id: [folder.id],
    };

    // update is_saved value of this folder in folder state
    setFolders((prev) => {
      return prev.map((f) => {
        if (f.id == folder.id) {
          return { ...f, is_saved: !f.is_saved };
        }
        return f;
      });
    });

    fetch(`http://localhost:8000/api/post/savepost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          // change is saved value of this folder in folder state

          handleFetchFolders();
        }
      });
  };
  const handleFetchFolders = () => {
    fetch(`http://localhost:8000/api/folder/post/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setFolders(data.folders);
      });
  };

  useEffect(() => {
    handleFetchFolders();
  }, [postId]);

  useEffect(() => {
    const isAllFoldersNotSaved = folders.every((f) => f.is_saved == false);
    if (isAllFoldersNotSaved) {
      setIsSavedPost(false);
    } else {
      setIsSavedPost(true);
    }
  }, [folders]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isSavedPost ? (
          <Button
            variant={"default"}
            size={"sm"}
            className={cn("hidden absolute top-3 right-3 z-10 group-hover:flex hover:border-primary bg-primary text-white rounded-full")}
          >
            <h1 className="font-semibold">Saved</h1>
          </Button>
        ) : (
          <Button variant={"secondary"} size={"sm"} className={cn("hidden absolute top-3 right-3 z-10 rounded-full group-hover:flex")}>
            <h1 className="font-semibold">Save</h1>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">My Folder</DialogTitle>
          <div className="flex gap-2">
            <div className="relative w-full mr-auto">
              <Input placeholder="Search folders..." className="pr-10 " />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5" />
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col max-h-[500px] gap-1 overflow-y-auto overflow-x-hidden">
          {folders.map((folder, index) => {
            return (
              <div
                key={index}
                className="w-full border grid grid-cols-12 items-center rounded-lg gap-3 p-3 hover:bg-slate-100 cursor-pointer"
                onClick={() => handleSave(folder)}
              >
                <div className="col-span-1 text-primary flex justify-center items-center bg-slate-50 border w-7 h-7 rounded">
                  {folder.is_saved && <Check />}
                </div>

                <h1 className="text-lg col-span-11">{folder.title}</h1>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavePostDialog;
