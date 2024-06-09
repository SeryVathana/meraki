import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getToken } from "@/utils/HelperFunctions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const DeleteFolderDialog = ({ folder }: { folder: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleDeletFolder = () => {
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_SERVER_URL}/folder/${folder.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setOpen(false);
        navigate("/profile?post=saved-posts");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer">Delete Folder</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] lg:max-w-screen-sm max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Delete Folder</DialogTitle>
        </DialogHeader>
        <div className="">
          <p className="text-sm text-gray-500">Are you sure you want to delete this folder?</p>
        </div>
        <div className="grid grid-cols-2 gap-5 w-ful">
          <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {isLoading ? (
            <Button className="w-full" disabled variant="destructive">
              Deleting
            </Button>
          ) : (
            <Button className="w-full" variant="destructive" onClick={() => handleDeletFolder()}>
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFolderDialog;
