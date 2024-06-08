import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import TagDropDown from "../TagDropDown";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

const CreateGroupPostDialog = ({ group, handleFetchGroupPosts }: { group: any; handleFetchGroupPosts: Function }) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function onSubmit() {
    if (!uploadFile) return;

    const tags = selectedTag.map((tag) => tag.id);

    const fileName = `user-uploaded/${uploadFile} - ${new Date().getTime()}`;
    const imgs = ref(storage, fileName);
    const uploadDisplay = await uploadBytes(imgs, uploadFile);
    const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);
    const reqBody = {
      group_id: group.id,
      title: title,
      description: description,
      status: group.status,
      tag: JSON.stringify(tags),
      img_url: imgDownloadURL,
    };

    setIsLoading(true);

    await fetch("http://127.0.0.1:8000/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        toast({
          title: "Successfully published post.",
          variant: "success",
          description: "Your post is now live.",
        });
        handleFetchGroupPosts();
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "Failed to publish post.",
          variant: "destructive",
          description: "Please try again later.",
        });
      });

    setUploadFile(null);
    setTempImgURL("");
  }

  function handleTempFileUpload(e: any) {
    setUploadFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setTempImgURL(url);
  }

  function handleRemoveTempImg() {
    setUploadFile(null);
    setTempImgURL("");
  }

  if (!group) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className=" flex justify-center">
          {tempImgURL ? (
            <div className="w-full h-[300px] rounded-2xl overflow-hidden relative border-[1px] bg-gray-200">
              <img src={tempImgURL} alt={tempImgURL} className="h-full object-contain mx-auto" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-3 right-3 rounded-lg hover:bg-red-400 hover:border-[1px]"
                onClick={() => handleRemoveTempImg()}
              >
                <X className="w-5" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-[300px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer" onChange={(e) => handleTempFileUpload(e)} />
              <Upload className="my-5" />
              <h3 className="font-medium text-xl">
                <label htmlFor="file-upload" className="relative cursor-pointer ">
                  <span>Drag and drop</span>
                  <span className="text-indigo-600"> or browse </span>
                  <span>to upload</span>
                </label>
              </h3>
            </div>
          )}
        </div>

        <div className="space-y-4 ">
          <div className="space-y-2">
            <Label>Post Title</Label>
            <Input placeholder="Hi" />
          </div>
          <div className="space-y-2">
            <Label>Post Description</Label>
            <Textarea placeholder="Description" />
          </div>

          <TagDropDown selectedTags={selectedTag} setSelectedTags={setSelectedTag} />

          <DialogTrigger asChild>
            <Button className="float-end" disabled={isLoading || !tempImgURL} onClick={() => onSubmit()}>
              Submit Post
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupPostDialog;
