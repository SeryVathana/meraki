import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownAZ, ArrowUpAZ, Ban, Delete, Dot, FilterX, Globe, Lock, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const USERS = [
  {
    id: '1',
    img_url: 'https://github.com/shadcn.png',
    username: 'Kim',
  },
  {
    id: '2',
    img_url: 'https://github.com/shadcn.png',
    username: 'Vath',
  },
  {
    id: '3',
    img_url: 'https://github.com/shadcn.png',
    username: 'Nymol',
  },
];

const myFollowing = ['1', '3'];

const GroupAddMembersDialog = ({ group_id, type }: { group_id: string; type: string }) => {
  const [users, setUsers] = useState(USERS);
  const [myFollowings, setMyFollowings] = useState(myFollowing);

  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == 'button' ? (
          <Button variant={'secondary'} className='rounded-full px-0'>
            Add members
          </Button>
        ) : (
          <p className='text-sm w-full px-2 py-1.5 hover:bg-secondary rounded-sm'>Add members</p>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle className='my-3 flex items-center'>Add Members</DialogTitle>
          <div className='flex gap-2'>
            <div className='relative w-full mr-auto'>
              <Input placeholder='Search users...' className='pr-10 ' />
              <Search className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5' />
            </div>
          </div>
        </DialogHeader>
        <div className='flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden'>
          {users.map((user, index) => {
            return (
              <div key={index} className='flex w-full justify-between px-2 py-2 rounded-md border-[1px]'>
                <div className='flex w-full gap-5'>
                  <Avatar className='hover:border-2 cursor-pointer' onClick={() => navigate(`/user?id=${user.id}`)}>
                    <AvatarImage src={user.img_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className='flex gap-2 items-center'>
                    <h1
                      className='text-md hover:underline hover:text-primary cursor-pointer'
                      onClick={() => navigate(`/user?id=${user.id}`)}
                    >
                      {user.username}
                    </h1>
                    {myFollowings.includes(user.id) ? (
                      <div className='flex items-center text-gray-400 cursor-default'>
                        <Dot />
                        <h1 className='text-xs font-normal cursor-default'>followed</h1>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <Button variant={'ghost'} className='z-10'>
                  Add
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupAddMembersDialog;
