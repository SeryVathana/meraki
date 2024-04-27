import PostsContainer from '@/components/PostsContainer';
import CreateGroupPostDialog from '@/components/dialogs/CreateGroupPostDialog';
import GroupAddMembersDialog from '@/components/dialogs/GroupAddMembersDialog';
import GroupJoinRequests from '@/components/dialogs/GroupJoinRequests';
import GroupMembersDialog from '@/components/dialogs/GroupMembersDialog';
import GroupPostRequests from '@/components/dialogs/GroupPostRequests';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dot, Ellipsis, Pen } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const GroupPage = () => {
  const [isPublicGroup, setIsPublicGroup] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(true);

  const [pageParams] = useSearchParams('');

  const params = pageParams.get('id');

  if (!params) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='relative w-full h-[35vh] bg-gray-400 rounded-2xl'>
        <img
          src='https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='Image'
          className='w-full h-full object-cover rounded-xl'
        />
        <div className='z-40  group absolute rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 border-4 border-white'>
          <input type='file' className='absolute inset-0 z-50 w-full h-full opacity-0 rounded-full  cursor-pointer' />

          <label htmlFor='file-upload' className='relative '>
            <Avatar className=' w-40 h-40 border-gray-200'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className='w-full h-full absolute top-0 left-0 rounded-full  opacity-0 group-hover:opacity-80 bg-gray-800 flex justify-center items-center'>
              <Pen className='text-white ' />
            </div>
          </label>
        </div>
      </div>

      <div className='flex flex-col items-center gap-5 relative w-full mt-5'>
        <h1 className='text-4xl font-bold tracking-tight lg:text-3xl  mt-12'>Kab Jak</h1>

        <div className='flex items-center gap-5'>
          <p>Public group</p>
          <Dot className='' />
          <GroupMembersDialog group_id='1' type='link' />
        </div>

        <div className='w-full flex justify-center gap-5'>
          {isJoined ? <CreateGroupPostDialog /> : <Button className='rounded-full'>Request Join</Button>}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='' size={'icon'} variant={'secondary'}>
                <Ellipsis className='w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <GroupMembersDialog group_id='1' type='dropdown' />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <GroupJoinRequests group_id='1' type='dropdown' />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <GroupPostRequests group_id='1' type='dropdown' />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <GroupAddMembersDialog group_id='1' type='dropdown' />
              </DropdownMenuItem>
              <DropdownMenuItem>Edit group</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Leave group</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='mt-10'>{isPublicGroup && isJoined ? <PostsContainer /> : <h1>Join group to see posts</h1>}</div>
    </div>
  );
};

export default GroupPage;
