import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownAZ, ArrowUpAZ, Ban, Dot, FilterX, Globe, Lock, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const userFollowers = [
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

const userFollowings = [
  {
    id: '4',
    img_url: 'https://github.com/shadcn.png',
    username: 'Kimmy',
  },
  {
    id: '5',
    img_url: 'https://github.com/shadcn.png',
    username: 'Vathy',
  },
  {
    id: '6',
    img_url: 'https://github.com/shadcn.png',
    username: 'Nymoly',
  },
];

const myFollowing = ['1', '3', '5'];

const FollowDialog = ({ user_id, type }: { user_id: string; type: string }) => {
  const [followers, setFollowers] = useState(userFollowers);
  const [followings, setFollowings] = useState(userFollowings);
  const [myFollowings, setMyFollowings] = useState(myFollowing);
  const [selectedType, setSelectedType] = useState<string>(type);

  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {selectedType == 'followers' ? (
          <Button variant={'link'} className='rounded-full'>
            3 followers
          </Button>
        ) : (
          <Button variant={'link'} className='rounded-full'>
            3 followings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle className='my-3 flex items-center'>
            {selectedType == 'followers' ? 'Followers' : 'Followings'}
            <span className='text-sm text-muted-foreground ml-5'>3</span>
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
        <Tabs defaultValue={selectedType}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='followers' onClick={() => setSelectedType('followers')}>
              Followers
            </TabsTrigger>
            <TabsTrigger value='followings' onClick={() => setSelectedType('followings')}>
              Followings
            </TabsTrigger>
          </TabsList>
          <TabsContent value='followers'>
            <div className='flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden'>
              {followers.map((user) => {
                return (
                  <DialogTrigger asChild>
                    <Button
                      key={user.id}
                      className='flex w-full justify-start gap-5 py-7'
                      variant={'outline'}
                      onClick={() => navigate(`/user?id=${user.id}`)}
                    >
                      <Avatar className=''>
                        <AvatarImage src={user.img_url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className='flex gap-2 items-center'>
                        <h1 className='text-lg'>{user.username}</h1>
                        {myFollowings.includes(user.id) ? (
                          <div className='flex items-center text-gray-400'>
                            <Dot />
                            <h1 className='text-xs font-normal'>followed</h1>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </Button>
                  </DialogTrigger>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value='followings'>
            <div className='flex flex-col gap-2 max-h-[500px] overflow-y-auto overflow-x-hidden'>
              {followings.map((user) => {
                return (
                  <DialogTrigger asChild>
                    <Button
                      key={user.id}
                      className='flex w-full justify-start gap-5 py-7'
                      variant={'outline'}
                      onClick={() => navigate(`/group?id=${user.id}`)}
                    >
                      <Avatar className=''>
                        <AvatarImage src={user.img_url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className='flex gap-2 items-center'>
                        <h1 className='text-lg'>{user.username}</h1>
                        {myFollowings.includes(user.id) ? (
                          <div className='flex items-center text-gray-400'>
                            <Dot />
                            <h1 className='text-xs font-normal'>followed</h1>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </Button>
                  </DialogTrigger>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
