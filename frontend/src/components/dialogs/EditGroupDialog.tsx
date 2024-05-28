import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage } from "@/lib/firebase";
import { User } from "@/redux/slices/authSlice";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { set } from "date-fns";
import { DialogDescription } from "@radix-ui/react-dialog";

const EditGroupDialog = ({ group, handleFetchGroupInfo, type }: { group: any; handleFetchGroupInfo: any; type: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        {type == "button" ? (
          <Button variant={"secondary"} className="rounded-full px-0">
            Edit Group
          </Button>
        ) : (
          <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm">Edit Group</p>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Edit Group</DialogTitle>
        </DialogHeader>
        <EditGroupContent group={group} setOpenDialog={setOpen} handleFetchGroupInfo={handleFetchGroupInfo} />
      </DialogContent>
    </Dialog>
  );
};

const EditGroupContent = ({ group, setOpenDialog, handleFetchGroupInfo }: { group: any; setOpenDialog: any; handleFetchGroupInfo: any }) => {
  const formSchema = z.object({
    title: z.string({ required_error: "Name is required" }).min(3, "Group name must 3 characters long.").max(50),
  });

  const [uploadProfileFile, setUploadProfileFile] = useState<File | null>(null);
  const [tempProfileImgURL, setTempProfileImgURL] = useState<string>(group.img_url);
  const [status, setStatus] = useState<string>(group.status);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: group.title,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let imgDownloadURL = "";

    setIsLoading(true);

    if (uploadProfileFile) {
      const fileName = `user-uploaded/${uploadProfileFile} - ${new Date().getTime()}`;
      const imgs = ref(storage, fileName);
      const uploadDisplay = await uploadBytes(imgs, uploadProfileFile);
      imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
    }

    const reqBody = {
      title: values.title,
      status: status,
      img_url: imgDownloadURL != "" ? imgDownloadURL : null,
    };

    fetch(`http://localhost:8000/api/group/${group.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {})
      .finally(() => {
        setIsLoading(false);
        setOpenDialog(false);
        handleFetchGroupInfo();
      });
  }

  function handleTempProfileFileUpload(e: any) {
    setUploadProfileFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setTempProfileImgURL(url);
  }

  function handleRemoveTempProfileImg() {
    setUploadProfileFile(null);
    setTempProfileImgURL("");
  }

  return (
    <div>
      <div className="">
        <div className="">
          <div className="grid grid-cols-3 my-10 items-center">
            <Label className="">Group Image</Label>
            {tempProfileImgURL ? (
              <div className="flex justify-center w-full col-span-2">
                <div className="w-40 h-40 relative">
                  <div className="rounded-full overflow-hidden w-full h-full border-4">
                    <img src={tempProfileImgURL} alt={tempProfileImgURL} className="w-full h-full object-cover" />
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 rounded-full"
                    onClick={() => handleRemoveTempProfileImg()}
                  >
                    <X className="w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full col-span-2">
                <div className="w-40 h-40 relative   bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                    onChange={(e) => handleTempProfileFileUpload(e)}
                  />
                  <Upload className="my-5" />
                </div>
              </div>
            )}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center">
                    <FormLabel className="col-span-1">Group Name</FormLabel>
                    <FormControl className="col-span-2">
                      <Input placeholder="Add title" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 items-center">
                <FormLabel className="col-span-1">Group privacy</FormLabel>
                <div className="flex gap-5 col-span-2">
                  <Select value={status} onValueChange={(value) => setStatus(value)}>
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2 mr-3">
                          <Globe className="h-4 text-gray-600" />
                          <p>Public</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2 mr-3">
                          <Lock className="h-4 text-gray-600" />
                          <p>Private</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div>{}</div>
                <Button type="submit" variant="outline" className="w-full" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                {isLoading ? (
                  <Button className="w-full" disabled>
                    Saving
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    Save changes
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      <DeleteGroupContent group={group} />
    </div>
  );
};

const DeleteGroupContent = ({ group }: { group: any }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  function handleDeleteGroup() {
    setIsLoading(true);
    fetch(`http://localhost:8000/api/group/${group.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);

        navigate("/");
      });
  }

  return (
    <div>
      <div className="">
        <div className="">
          <DialogHeader className="mb-5 mt-16">
            <DialogTitle>Delete group</DialogTitle>
            <DialogDescription>Think twice bro, there's no way back fr fr.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-5">
            {isLoading ? (
              <Button className="w-full" disabled>
                Deleting
              </Button>
            ) : (
              <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="my-3 flex items-center">Delete Group</DialogTitle>
                    <DialogDescription>Not twice but thrice now.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-5">
                    <Button variant="outline" className="w-full" onClick={() => setOpenDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="w-full" variant="destructive" onClick={() => handleDeleteGroup()}>
                      Delete Group
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroupDialog;
