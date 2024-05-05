import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Globe, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const CreateGroupPage = () => {
  const [uploadProfileFile, setUploadProfileFile] = useState<File | null>(null);
  const [uploadCoverFile, setUploadCoverFile] = useState<File | null>(null);
  const [tempProfileImgURL, setTempProfileImgURL] = useState<string>("");
  const [tempCoverImgURL, setTempCoverImgURL] = useState<string>("");
  const [isGlobal, setIsGlobal] = useState<boolean>(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const reqBody = {
      title: values.title,
      description: values.description,
      is_global: isGlobal,
      img_profile_url: tempProfileImgURL,
      img_cover_url: tempCoverImgURL,
    };

    console.log(reqBody);

    setUploadProfileFile(null);
    setUploadCoverFile(null);
    setTempProfileImgURL("");
    setTempCoverImgURL("");
    setIsGlobal(true);

    form.clearErrors();
    form.reset();
  }

  function handleTempProfileFileUpload(e: any) {
    setUploadProfileFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setTempProfileImgURL(url);
  }

  function handleTempCoverFileUpload(e: any) {
    setUploadCoverFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setTempCoverImgURL(url);
  }

  function handleRemoveTempProfileImg() {
    setUploadProfileFile(null);
    setTempProfileImgURL("");
  }

  function handleRemoveTempCoverImg() {
    setUploadCoverFile(null);
    setTempCoverImgURL("");
  }

  return (
    <div className="w-full h-auto mb-10">
      <div className="w-full flex justify-center my-10">
        <h1 className="font-semibold text-3xl">Create New Group</h1>
      </div>
      <div className="max-w-screen-lg mx-auto space-y-8">
        <div>
          <Label className="font-medium mb-2">Group cover image</Label>
          {tempCoverImgURL ? (
            <div className="w-full h-[300px] rounded-xl overflow-hidden relative border-[1px]">
              <img src={tempCoverImgURL} alt={tempCoverImgURL} className="w-full h-full object-cover" />
              <Button size="icon" variant="outline" className="absolute top-5 right-5" onClick={() => handleRemoveTempCoverImg()}>
                <X className="w-5" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-[300px] relative bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                onChange={(e) => handleTempCoverFileUpload(e)}
              />
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
        <div>
          <Label className="font-medium mb-2">Group profile image</Label>
          {tempProfileImgURL ? (
            <div className="w-40 h-40 rounded-full overflow-hidden relative border-[1px]">
              <img src={tempProfileImgURL} alt={tempProfileImgURL} className="w-full h-full object-cover" />
              <Button size="icon" variant="outline" className="absolute top-5 right-5" onClick={() => handleRemoveTempProfileImg()}>
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add description" className="max-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <FormLabel>Group privacy</FormLabel>
                  <div className="flex gap-5">
                    <Select value={isGlobal ? "global" : "private"} onValueChange={(value) => setIsGlobal(() => (value === "global" ? true : false))}>
                      <SelectTrigger className="w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">
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
                <div className="flex flex-col gap-3">
                  <FormLabel>Post permission</FormLabel>
                  <div className="flex gap-5">
                    <Select value={isGlobal ? "global" : "private"} onValueChange={(value) => setIsGlobal(() => (value === "global" ? true : false))}>
                      <SelectTrigger className="w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">
                          <div className="flex items-center gap-2 mr-3">
                            <Globe className="h-4 text-gray-600" />
                            <p>Allow all posts</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2 mr-3">
                            <Lock className="h-4 text-gray-600" />
                            <p>Submit post request</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit">Create group</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
