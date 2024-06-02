import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-dropdown-menu";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Globe, LoaderCircle, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import errorMap from "zod/locales/en.js";

const formSchema = z.object({
  title: z.string({ required_error: "Name is required" }).trim().min(3, "Group name must 3 characters long.").max(50),
});

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [uploadProfileFile, setUploadProfileFile] = useState<File | null>(null);
  const [tempProfileImgURL, setTempProfileImgURL] = useState<string>("");
  const [status, setStatus] = useState<string>("public");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return;

    setIsLoading(true);
    const fileName = `user-uploaded/${uploadProfileFile} - ${new Date().getTime()}`;
    const imgs = ref(storage, fileName);
    const uploadDisplay = await uploadBytes(imgs, uploadProfileFile);
    const imgDownloadURL = await getDownloadURL(uploadDisplay.ref);

    const reqBody = {
      title: values.title,
      status: status,
      img_url: imgDownloadURL,
    };

    console.log(reqBody);

    fetch("http://localhost:8000/api/group", {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          toast({
            title: "Successfully created group.",
            variant: "success",
            description: "Your group is now live.",
          });

          setTimeout(() => {
            navigate(`/group/${data.id}`);
          }, 1000);
        } else {
          toast({
            title: "Failed to created group.",
            variant: "destructive",
            description: "Please try again.",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    setUploadProfileFile(null);
    setTempProfileImgURL("");
    setStatus("public");

    form.clearErrors();
    form.reset();
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
    <div className="w-full h-auto mb-10">
      <div className="w-full flex justify-center my-10">
        <h1 className="font-semibold text-3xl">Create New Group</h1>
      </div>
      <div className="flex flex-col justify-center items-center max-w-screen-md mx-auto space-y-8">
        <div>
          {tempProfileImgURL ? (
            <div className="w-40 h-40 relative">
              <div className="rounded-full overflow-hidden w-full h-full border-4">
                <img src={tempProfileImgURL} alt={tempProfileImgURL} className="w-full h-full object-cover" />
              </div>
              <Button size="icon" variant="destructive" className="absolute top-1 right-1 rounded-full" onClick={() => handleRemoveTempProfileImg()}>
                <X className="w-5" />
              </Button>
            </div>
          ) : (
            <div className="w-40 h-40 relative bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                onChange={(e) => handleTempProfileFileUpload(e)}
              />
              <Upload className="my-5" />
            </div>
          )}
        </div>
        <div className="w-3/4 h-full">
          <div className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Add title" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 w-full">
                  <FormLabel>Group privacy</FormLabel>
                  <div className="flex gap-5">
                    <Select value={status} onValueChange={(value) => setStatus(value)}>
                      <SelectTrigger className="w-1/2">
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
                <div className="flex">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex gap-2 items-center">
                        <LoaderCircle className="animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create group"
                    )}
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

export default CreateGroupPage;
