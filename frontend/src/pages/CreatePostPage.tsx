import { Input } from '@/components/ui/input';
import { Globe, Lock, Trash, Upload, Users, X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const CreatePostPage = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [tempImgURL, setTempImgURL] = useState<string>('');
  const [isGlobal, setIsGlobal] = useState<boolean>(true);

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
      is_global: isGlobal,
      img_url: tempImgURL,
    };

    console.log(reqBody);

    setUploadFile(null);
    setTempImgURL('');
    setIsGlobal(true);

    form.clearErrors();
    form.reset();
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
    <div className='w-full h-auto'>
      <div className='w-full flex justify-center my-10'>
        <h1 className='font-semibold text-3xl'>Create Post</h1>
      </div>
      <div className='max-w-screen-xl min-h-[500px] mx-auto flex gap-20 justify-center'>
        <div className='w-1/2 max-w-[500px] h-full flex justify-center'>
          {tempImgURL ? (
            <div className='h-[500px] rounded-2xl overflow-hidden relative border-[1px]'>
              <img src={tempImgURL} alt={tempImgURL} className='w-full h-full object-contain' />
              <Button size='icon' variant='outline' className='absolute top-5 right-5' onClick={() => handleRemoveTempImg()}>
                <X className='w-5' />
              </Button>
            </div>
          ) : (
            <div className='w-full h-[500px] relative bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200'>
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
        <div className='w-1/2 max-w-[500px] h-full '>
          <div className=''>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 '>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Add title' type='text' {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Add description' className='max-h-[200px]' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-3'>
                  <FormLabel>Post privacy</FormLabel>
                  <div className='flex gap-5'>
                    <Select
                      value={isGlobal ? 'global' : 'private'}
                      onValueChange={(value) => setIsGlobal(() => (value === 'global' ? true : false))}
                    >
                      <SelectTrigger className='w-fit'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='global'>
                          <div className='flex items-center gap-2 mr-3'>
                            <Globe className='h-4 text-gray-600' />
                            <p>Global</p>
                          </div>
                        </SelectItem>
                        <SelectItem value='private'>
                          <div className='flex items-center gap-2 mr-3'>
                            <Lock className='h-4 text-gray-600' />
                            <p>Private</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='w-full flex justify-end'>
                  <Button type='submit' disabled={!tempImgURL}>
                    Publish
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
