import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const CreateGroupPostDialog = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [tempImgURL, setTempImgURL] = useState<string>('');

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
      img_url: tempImgURL,
    };

    console.log(reqBody);

    setUploadFile(null);
    setTempImgURL('');
  }

  function handleTempFileUpload(e: any) {
    setUploadFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setTempImgURL(url);
  }

  function handleRemoveTempImg() {
    setUploadFile(null);
    setTempImgURL('');
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' className='rounded-full'>
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className=' flex justify-center'>
          {tempImgURL ? (
            <div className='w-full h-[300px] rounded-2xl overflow-hidden relative border-[1px] bg-gray-200'>
              <img src={tempImgURL} alt={tempImgURL} className='h-full object-contain mx-auto' />
              <Button
                size='icon'
                variant='destructive'
                className='absolute top-3 right-3 rounded-lg hover:bg-red-400 hover:border-[1px]'
                onClick={() => handleRemoveTempImg()}
              >
                <X className='w-5' />
              </Button>
            </div>
          ) : (
            <div className='w-full h-[300px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200'>
              <input
                type='file'
                className='absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer'
                onChange={(e) => handleTempFileUpload(e)}
              />
              <Upload className='my-5' />
              <h3 className='font-medium text-xl'>
                <label htmlFor='file-upload' className='relative cursor-pointer '>
                  <span>Drag and drop</span>
                  <span className='text-indigo-600'> or browse </span>
                  <span>to upload</span>
                </label>
              </h3>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Title (optional)</FormLabel>

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

            <DialogTrigger asChild>
              <Button type='submit' className='float-end'>
                Submit Post
              </Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupPostDialog;
