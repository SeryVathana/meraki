import PostsContainer from '@/components/PostsContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pen, Upload } from 'lucide-react';

import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';

const ProfilePage = () => {
  const [postParams] = useSearchParams('my-posts');

  const navigate = useNavigate();

  const myParam = postParams.get('post');

  return (
    <div className=''>
      <div className='flex flex-col gap-2 items-center my-10'>
        <div className='w-32 h-32 rounded-full relative group'>
          <input type='file' className='absolute inset-0 w-full h-full opacity-0 z-50 rounded-full cursor-pointer' />

          <label htmlFor='file-upload' className='relative '>
            <Avatar className='w-32 h-32  group-hover:border-2 border-gray-200'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className='w-full h-full absolute top-0 left-0 rounded-full  opacity-0 group-hover:opacity-80 bg-gray-800 flex justify-center items-center'>
              <Pen className='text-white ' />
            </div>
          </label>
        </div>

        <h1 className='text-4xl font-bold tracking-tight lg:text-3xl'>Sery Vathana</h1>
        <h3 className='text-slate-500'>@znaazmz</h3>
        <h3 className='text-slate-500'>yooseryvathana@gmail.com</h3>

        <div className='flex gap-5'>
          <p>1 follower</p>

          <p>2 following</p>
        </div>

        <div className='flex gap-5 mt-5'>
          <Button className='rounded-full'>Group</Button>
          <Button className='rounded-full' onClick={() => navigate('/profile/setting')}>
            Edit Profile
          </Button>
        </div>

        <div className='flex gap-10 mt-10'>
          <NavLink to={'/profile?post=my-posts'} className={cn(myParam === 'my-posts' || !myParam ? 'underline' : '')}>
            Created
          </NavLink>
          <NavLink to={'/profile?post=saved-posts'} className={cn(myParam === 'saved-posts' ? 'underline' : '')}>
            Saved
          </NavLink>
        </div>
      </div>
      <PostsContainer />
    </div>
  );
};

export default ProfilePage;
