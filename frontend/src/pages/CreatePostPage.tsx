import TagDropDown, { Tag } from "@/components/TagDropDown";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

type ImageResType = {
  storageFileName: string;
  downloadURL: string;
  message: string;
  name: string;
  type: string;
};

const CreatePostPage = () => {
  const [uploadFile, setUploadFile] = useState<Blob | null>(null);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [status, setStatus] = useState<string>("public");
  const [selectedTag, setSelectedTag] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!uploadFile) return;

    const tags = selectedTag.map((tag) => tag.id);

    const fileName = `user-uploaded/${uploadFile} - ${new Date().getTime()}`;
    const imgs = ref(storage, fileName);
    const uploadDisplay = await uploadBytes(imgs, uploadFile);
    const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);

    const reqBody = {
      group_id: null,
      title: values.title,
      description: values.description,
      status: status,
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

        setUploadFile(null);
        setTempImgURL("");
        setSelectedTag([]);

        form.clearErrors();
        form.reset();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast({
          title: "Failed to publish post.",
          variant: "destructive",
          description: "Please try again later.",
        });
      });
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

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-center my-10">
        <h1 className="font-semibold text-3xl">Create Post</h1>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Add title" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add description" className="max-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <FormLabel>Post privacy</FormLabel>
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading" : "Publish"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
