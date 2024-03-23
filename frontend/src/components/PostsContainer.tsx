import { Button } from '@/components/ui/button.js';
import data from '../db/mock-post.json';
import { Pin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const PostsContainer = () => {
  const navigate = useNavigate();
  return (
    <div className='columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-0 xl:px-0 gap-4 space-y-4 mt-3'>
      {data.map((post, index) => {
        return (
          <div className='group relative' key={index} onClick={() => navigate(`/post/${post.id}`)}>
            <img className=' rounded-2xl w-full bg-gray-300' src={post.img_url} alt='' />
            <div className='hidden group-hover:flex'>
              <div className='absolute top-0 left-0 w-full h-full rounded-xl opacity-50 bg-gray-900' />
              <Button variant={'default'} className='bg-red-500 px-3 py-2 absolute top-3 right-3'>
                <Pin className='w-5 h-5' />
              </Button>

              <div className='absolute bottom-3 left-3 flex gap-2 items-center'>
                <Avatar className='w-8 h-8'>
                  <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className='flex flex-col text-white '>
                  <h1 className='font-medium'>Sery Vathana</h1>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsContainer;
