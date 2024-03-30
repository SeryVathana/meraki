import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownAZ, ArrowUpAZ, Ban, Check, Dot, FilterX, Globe, Lock, Search, Users, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const myGroups = [
  {
    id: '1',
    img_url: 'https://github.com/shadcn.png',
    group_name: 'Kab Jak',
    isPublic: true,
  },
  {
    id: '2',
    img_url: 'https://github.com/shadcn.png',
    group_name: 'Informationo Technology and Engineering',
    isPublic: false,
  },
  {
    id: '3',
    img_url: 'https://github.com/shadcn.png',
    group_name: 'Royal University of Phnom Penh',
    isPublic: true,
  },
];

const PendingGroupInviteDialog = ({ user_id, type }: { user_id: string; type: string }) => {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type == 'icon' ? (
          <Button variant={'outline'} size={'icon'}>
            <Users className='w-5 h-5' />
          </Button>
        ) : type == 'button' ? (
          <Button variant={'secondary'} className='rounded-full'>
            Pending Invites
          </Button>
        ) : type == 'drop-down-link' ? (
          <p className='text-sm w-full px-2 py-1 hover:bg-slate-100 rounded-sm'>Pending Invites</p>
        ) : (
          ''
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle className='my-3 flex items-center'>
            Pending group invites<span className='text-sm text-muted-foreground ml-5'>{myGroups.length} Groups</span>
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden'>
          {myGroups.map((group, index) => {
            return (
              <DialogTrigger asChild key={index} className='border-[1px] rounded-md px-2'>
                <div className='flex justify-between items-center'>
                  <div className='flex w-full justify-start gap-5 py-2' onClick={() => navigate(`/group?id=${group.id}`)}>
                    <Avatar>
                      <AvatarImage src={group.img_url} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className='flex gap-2 items-center'>
                      <h1 className='text-sm line-clamp-1'>{group.group_name}</h1>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button size={'icon'} variant={'ghost'} className='w-8 h-8'>
                      <Check className='w-5 h-5 text-green-500' />
                    </Button>
                    <Button size={'icon'} variant={'ghost'} className='w-8 h-8'>
                      <X className='w-5 h-5 text-red-500' />
                    </Button>
                  </div>
                </div>
              </DialogTrigger>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingGroupInviteDialog;
