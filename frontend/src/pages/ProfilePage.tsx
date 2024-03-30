import PostsContainer from '@/components/PostsContainer';
import FollowDialog from '@/components/dialogs/FollowDialog';
import GroupsDialog from '@/components/dialogs/GroupsDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cross, Pen, Plus } from 'lucide-react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';

import data from '@/db/mock-post.json';
import CreateFolderDialog from '@/components/dialogs/CreateFolderDialog';

const ProfilePage = () => {
  const [params] = useSearchParams('my-posts');

  const navigate = useNavigate();

  const postParam = params.get('post');

  return (
    <div className='min-h-[100vh]'>
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
          <FollowDialog user_id='1' type='followers' />
          <FollowDialog user_id='1' type='followings' />
        </div>

        <div className='flex gap-5 mt-5'>
          <GroupsDialog user_id='1' type='button' />
          <Button className='rounded-full' onClick={() => navigate('/profile/setting')}>
            Edit Profile
          </Button>
        </div>

        <div className='flex gap-10 mt-10'>
          <NavLink
            to={'/profile?post=my-posts'}
            className={cn(postParam === 'my-posts' || !postParam ? 'underline text-primary' : '')}
          >
            Created
          </NavLink>
          <NavLink to={'/profile?post=saved-posts'} className={cn(postParam === 'saved-posts' ? 'underline  text-primary' : '')}>
            Saved
          </NavLink>
        </div>
      </div>
      {postParam === 'my-posts' || !postParam ? (
        <div>
          <PostsContainer />
        </div>
      ) : (
        <div className='grid grid-cols-6 gap-4 my-10'>
          <CreateFolderDialog />
          {data.slice(0, 9).map((folder, index) => {
            return (
              <div
                key={index}
                onClick={() => navigate('/folder?id=1')}
                className='border-[1px] h-[300px] relative group cursor-pointer flex flex-col rounded-xl overflow-hidden'
              >
                <div className='w-full h-1/2 border-r-[1px]'>
                  <img src={data[6].img_url} alt='' className='w-full h-full object-cover' />
                </div>
                <div className='w-full h-1/2 flex border-t-[1px]'>
                  <div className='w-1/2 h-full border-r-[1px]'>
                    <img src={data[1].img_url} alt='' className='w-full h-full object-cover' />
                  </div>
                  <div className='w-1/2 h-full '>
                    <img src={data[2].img_url} alt='' className='w-full h-full object-cover' />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
