import PostsContainer from '@/components/PostsContainer';
import CreateGroupPostDialog from '@/components/dialogs/CreateGroupPostDialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dot } from 'lucide-react';
import { useState } from 'react';

const GroupPage = () => {
  const [isPublicGroup, setIsPublicGroup] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(true);

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full h-[35vh] bg-gray-400 relative rounded-2xl'>
        <div className='w-full h-full overflow-hidden rounded-xl'>
          <AspectRatio ratio={16 / 9}>
            <img
              src='https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              alt='Image'
              className='object-cover rounded-xl'
            />
          </AspectRatio>
        </div>
        <Avatar className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-40 border-4 border-white'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <div className='flex flex-col items-center mt-24 gap-5'>
        <h1 className='text-4xl font-bold tracking-tight lg:text-3xl'>Kab Jak</h1>

        <div className='flex gap-5'>
          <p>Public group</p>
          <Dot className='mt-[1px]' />
          <p>1200 members</p>
        </div>

        <div className='flex gap-5'>
          {isJoined ? (
            <div className='w-full flex justify-end mt-5'>
              <CreateGroupPostDialog />
            </div>
          ) : (
            <Button className='rounded-full'>Request Join</Button>
          )}
          {/* <Button className='rounded-full'>Edit Profile</Button> */}
        </div>
      </div>
      <div className='mt-10'>{isPublicGroup && isJoined ? <PostsContainer /> : <h1>Join group to see posts</h1>}</div>
    </div>
  );
};

export default GroupPage;
