import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getToken } from "@/utils/HelperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const EditFolderDialog = ({ folder, handleFetchFolderInfo }: { folder: any; handleFetchFolderInfo: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    title: z.string({ required_error: "Name is required" }).min(3, "Group name must 3 characters long.").max(50),
    description: z.string().optional().or(z.literal("")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: folder.title,
      description: folder.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const reqBody = {
      title: values.title,
      description: values.description,
      status: "private",
    };

    setIsLoading(true);

    await fetch(`${import.meta.env.VITE_SERVER_URL}/folder/${folder.id}`, {
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
        handleFetchFolderInfo();
        setOpen(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <p className="text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm cursor-pointer">Edit Folder</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-screen-sm max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="my-3 flex items-center">Edit Folder</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center">
                  <FormLabel className="col-span-1">Folder Name</FormLabel>
                  <FormControl className="col-span-2">
                    <Input placeholder="Edit title" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-3 items-center">
                  <FormLabel className="col-span-1">Folder Description</FormLabel>
                  <FormControl className="col-span-2">
                    <Textarea placeholder="Edit description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-5">
              <div>{}</div>
              <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(false)}>
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
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderDialog;
