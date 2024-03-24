import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, Lock, Search, Users } from 'lucide-react';
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

const MyGroupsDialog = () => {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'icon'}>
          <Users className='w-5 h-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle className='my-3 flex items-center'>
            My Groups <span className='text-sm text-muted-foreground ml-5'>{myGroups.length} Groups</span>
          </DialogTitle>
          <div className='flex gap-2'>
            <div className='relative w-full mr-auto'>
              <Input placeholder='Search groups...' className='pr-10 ' />
              <Search className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 w-5' />
            </div>
            <Select defaultValue='none'>
              <SelectTrigger className='w-fit'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='w-fit'>
                <SelectItem value='none'>
                  <Ban className='h-4 text-gray-600' />
                </SelectItem>
                <SelectItem value='global'>
                  <Globe className='h-4 text-gray-600' />
                </SelectItem>
                <SelectItem value='private'>
                  <Lock className='h-4 text-gray-600' />
                </SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue='none'>
              <SelectTrigger className='w-fit'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>
                  <FilterX className='h-4 text-gray-600' />
                </SelectItem>
                <SelectItem value='private'>
                  <ArrowUpAZ className='h-4 text-gray-600' />
                </SelectItem>
                <SelectItem value='global'>
                  <ArrowDownAZ className='h-4 text-gray-600' />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <div className='flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden'>
          {myGroups.map((group) => {
            return (
              <DialogTrigger asChild>
                <Button
                  key={group.id}
                  className='flex w-full justify-start gap-5 py-7'
                  variant={'outline'}
                  onClick={() => navigate(`group/${group.id}`)}
                >
                  <Avatar className=''>
                    <AvatarImage src={group.img_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className='flex gap-2 items-center'>
                    <h1 className='text-lg'>{group.group_name}</h1>
                    <Dot className='text-gray-500' />
                    <p className='text-gray-500'>{group.isPublic ? 'public' : 'private'}</p>
                  </div>
                </Button>
              </DialogTrigger>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyGroupsDialog;
