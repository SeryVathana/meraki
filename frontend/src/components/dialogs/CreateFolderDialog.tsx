import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required. Please input any title.')
    .max(24, 'Title must be equal or less than 24 characters.'),
  description: z.string().max(500, 'Description must be equal or less than 24 characters.').optional(),
});

const CreateFolderDialog = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const reqBody = {
      title: values.title,
      description: values.description,
    };

    console.log(reqBody);

    setOpenDialog(false);
  }

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
      <DialogTrigger asChild>
        <div className='border-[1px] h-[300px] relative group cursor-pointer bg-slate-100 rounded-xl overflow-hidden flex justify-center items-center'>
          <Plus className='w-10 h-10 text-slate-500' />
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Title (required)</FormLabel>

                  <FormControl>
                    <Input placeholder='Add title here' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>

                  <FormControl>
                    <Textarea placeholder='Add description here' className='max-h-[200px]' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='float-end'>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
