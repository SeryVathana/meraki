import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

const generalChangeSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
});
const passwordChangeSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
  cf_new_password: z.string(),
});

const SettingPage = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const generalForm = useForm<z.infer<typeof generalChangeSchema>>({
    resolver: zodResolver(generalChangeSchema),
  });
  const passwordForm = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
  });

  function onSubmitGeneral(values: z.infer<typeof generalChangeSchema>) {
    console.log(values);
  }
  function onSubmitPassword(values: z.infer<typeof passwordChangeSchema>) {
    console.log(values);
  }

  const [postParams] = useSearchParams('');

  const myParams = postParams.get('section');

  useEffect(() => {
    setFirstName('Sery');
    setLastName('Vathana');
    setUsername('Username');
    setEmail('yooseryvathana@gmail.com');
  }, []);

  return (
    <div className='flex w-full'>
      <div className='w-1/5 flex flex-col my-10'>
        <Link
          to={'/profile/setting?section=profile_setting'}
          className={cn('font-semibold', myParams === 'profile_setting' || !myParams ? 'underline' : '')}
        >
          Profile Setting
        </Link>
      </div>

      {myParams === 'profile_setting' || !myParams ? (
        <div className='w-2/5  '>
          <h1 className='text-xl font-bold mt-10'>Profile Setting</h1>
          <Separator className='mt-3 mb-8 ' />

          <div className='space-y-16'>
            <div>
              <h1 className='my-5 text-lg font-semibold'>General Setting</h1>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className='space-y-4 '>
                  <FormField
                    control={generalForm.control}
                    name='first_name'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder='' type='text' defaultValue={firstName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name='last_name'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder='' type='text' defaultValue={lastName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>Username</FormLabel>
                        <FormControl>
                          <Input placeholder='' type='text' defaultValue={username} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='' type='text' defaultValue={email} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='w-full flex justify-end'>
                    <Button type='submit'>Submit Change</Button>
                  </div>
                </form>
              </Form>
            </div>
            <div>
              <h1 className='my-5 text-lg font-semibold'>Credential Setting</h1>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className='space-y-4 '>
                  <FormField
                    control={passwordForm.control}
                    name='old_password'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>Old Password</FormLabel>
                        <FormControl>
                          <Input placeholder='*********' type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name='new_password'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>New Password</FormLabel>
                        <FormControl>
                          <Input placeholder='*********' type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name='cf_new_password'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-10'>
                        <FormLabel className='w-1/2'>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input placeholder='*********' type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='w-full flex justify-end'>
                    <Button type='submit'>Change Password</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default SettingPage;
