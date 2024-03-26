import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button.js';
import { Heart, HeartCrack, Pin, PinOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mockData from '../db/mock-post.json';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const PostsContainer = () => {
  const navigate = useNavigate();

  const [data, setData]: any[] = useState<any[]>(mockData);

  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    // setData(shuffleArray(mockData));
  }, [data]);

  if (!data) {
    return <h1>Loading</h1>;
  }

  const handleSavePost = (id: string) => {
    if (savedPosts.includes(id)) {
      setSavedPosts((prev) => {
        const indexToRemove = prev.indexOf(id);
        if (indexToRemove !== -1) {
          // Create a new array without the item to remove
          const updatedPosts = [...prev.slice(0, indexToRemove), ...prev.slice(indexToRemove + 1)];
          return updatedPosts;
        }
        // If the item is not found, return the original array
        return prev;
      });
    } else {
      setSavedPosts([...savedPosts, id]);
    }
  };

  const handleLikePost = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts((prev) => {
        const indexToRemove = prev.indexOf(id);
        if (indexToRemove !== -1) {
          // Create a new array without the item to remove
          const updatedPosts = [...prev.slice(0, indexToRemove), ...prev.slice(indexToRemove + 1)];
          return updatedPosts;
        }
        // If the item is not found, return the original array
        return prev;
      });
    } else {
      setLikedPosts([...savedPosts, id]);
    }
  };

  return (
    <div className='columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-5 xl:px-10 2xl:px-0 gap-5 space-y-5 mt-3'>
      {data.map((post: any, index: number) => {
        return (
          <div className='group relative border-[1px] rounded-2xl overflow-hidden cursor-pointer' key={index}>
            <Button
              variant={'secondary'}
              size={'icon'}
              className={cn(
                'hidden absolute top-3 right-3 z-10 group-hover:flex bg-white text-primary bg-opacity-70 hover:bg-opacity-100 hover:border-primary',
                savedPosts.includes(String(post.id))
                  ? 'bg-red-500 text-secondary bg-opacity-70 hover:bg-opacity-100 hover:bg-red-500'
                  : ''
              )}
              onClick={() => handleSavePost(String(post.id))}
            >
              {savedPosts.includes(String(post.id)) ? <PinOff className='w-5 h-5' /> : <Pin className='w-5 h-5' />}
            </Button>
            <Button
              variant={'secondary'}
              size={'icon'}
              className={cn(
                'hidden absolute bottom-3 right-3 z-10 group-hover:flex bg-white text-primary bg-opacity-70 hover:bg-opacity-100 hover:border-primary',
                likedPosts.includes(String(post.id))
                  ? 'bg-red-500 text-secondary bg-opacity-70 hover:bg-opacity-100 hover:bg-red-500'
                  : ''
              )}
              onClick={() => handleLikePost(String(post.id))}
            >
              {likedPosts.includes(String(post.id)) ? <Heart className='w-5 h-5' /> : <Heart className='w-5 h-5' />}
            </Button>

            <div
              className='hidden group-hover:flex absolute bottom-3 left-3 z-10 gap-2 items-center'
              onClick={() => navigate(`/user?id=${1}`)}
            >
              <Avatar className='w-6 h-6'>
                <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className='flex flex-col text-white '>
                <h1 className='font-medium text-sm'>Sery Vathana</h1>
              </div>
            </div>

            <div key={index} onClick={() => navigate(`/post?id=${post.id}`)}>
              <img className='w-full bg-gray-300' src={post.img_url} alt='' />
              <div className='hidden group-hover:flex'>
                <div className='absolute top-0 left-0 w-full h-full opacity-50 bg-gray-900' />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsContainer;
