import TagDropDown from "@/components/TagDropDown";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { set } from "date-fns";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, LoaderCircle, Lock, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditPostPage = () => {
  const [uploadFile, setUploadFile] = useState<Blob | null>(null);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [status, setStatus] = useState<string>("public");
  const [selectedTag, setSelectedTag] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { postId } = useParams();

  const handleFetchPostDetail = () => {
    setIsFetching(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const post = data.post;

        setTitle(post.title);
        setDescription(post.description);
        setStatus(post.status);
        setTempImgURL(post.img_url);
        setSelectedTag(post.tags);
      })
      .finally(() => setIsFetching(false));
  };

  async function handleSave() {
    setIsLoading(true);
    const tags = selectedTag.map((tag) => tag.id);

    let imgURL = tempImgURL;

    if (uploadFile) {
      const fileName = `user-uploaded/${uploadFile} - ${new Date().getTime()}`;
      const imgs = ref(storage, fileName);
      const uploadDisplay = await uploadBytes(imgs, uploadFile);
      imgURL = await getDownloadURL(uploadDisplay.ref);
    }

    const reqBody = {
      group_id: null,
      title: title,
      description: description,
      status: status,
      tags: JSON.stringify(tags),
      img_url: imgURL,
    };

    await fetch(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, {
      method: "PUT",
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
          title: "Successfully update post.",
          variant: "success",
          description: "Your post is now updated.",
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast({
          title: "Failed to update post.",
          variant: "destructive",
          description: "Please try again later.",
        });
      });

    setUploadFile(null);
    setTempImgURL("");
    setSelectedTag([]);

    handleFetchPostDetail();
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

  useEffect(() => {
    handleFetchPostDetail();
  }, []);

  if (isFetching) {
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-2">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-center my-10">
        <h1 className="font-semibold text-3xl">Edit Post</h1>
      </div>
      <div className="max-w-screen-xl min-h-[500px] mx-auto flex gap-20 justify-center">
        <div className="w-1/2 max-w-[500px] h-full flex justify-center">
          {tempImgURL ? (
            <div className="h-[500px] rounded-2xl overflow-hidden relative border">
              <img src={tempImgURL} alt={tempImgURL} className="w-full h-full object-contain" />
              <Button size="icon" variant="outline" className="absolute top-5 right-5" onClick={() => handleRemoveTempImg()}>
                <X className="w-5" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-[500px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border border-dashed border-gray-200">
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
        <div className="w-1/2 max-w-[500px] h-full ">
          <div className="">
            <form className="space-y-8 ">
              <div className="flex flex-col gap-3">
                <Label>Title</Label>
                <Input placeholder="Add title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="flex flex-col gap-3">
                <Label>Description</Label>
                <Textarea
                  placeholder="Add description"
                  className="max-h-[200px]"
                  value={description || ""}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label>Post privacy</Label>
                <div className="flex gap-5">
                  <Select value={status} onValueChange={(value) => setStatus(value)}>
                    <SelectTrigger className="w-fit">
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
              <TagDropDown selectedTags={selectedTag} setSelectedTags={setSelectedTag} />
              <div className="w-full flex justify-end">
                <Button type="submit" disabled={isLoading} onClick={() => handleSave()}>
                  {isLoading ? "Loading" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
