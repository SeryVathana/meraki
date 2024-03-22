import PostsContainer from '@/components/PostsContainer';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { PostType } from '@/types/types';

import mockData from '../db/mock-post.json';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, ChevronRight, MessageCircle, Pin, Save, Send, SendHorizonal, Share, ThumbsUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostType>();

  useEffect(() => {
    mockData.map((data) => {
      if (String(data.id) == postId) {
        setPost(data);
        return data;
      }
    });

    window.scrollTo(0, 0);
  }, [postId]);

  return (
    <div>
      <div className='mt-10 mb-32 max-w-screen-lg max-h-fit mx-auto grid grid-cols-2 gap-10'>
        <div className='w-full h-full bg-slate-100 rounded-xl'>
          <AspectRatio ratio={3 / 4} className='h-full w-full flex justify-center items-center overflow-hidden'>
            <img src={post?.img_url} alt='Image' className='object-contain h-full w-full' />
          </AspectRatio>
        </div>
        <div className='relative flex flex-col'>
          <div className='flex flex-col h-full overflow-auto pr-5'>
            <div className='flex gap-4 items-center'>
              <Avatar className=''>
                <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-12 rounded-full' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <div className='flex gap-2 items-center'>
                  <h1 className=' text-xl font-semibold'>Sery Vathana</h1>
                  <ChevronRight className='h-6' />
                  <h1 className=' text-xl font-semibold'>Kab jak</h1>
                </div>
                <div className='flex items-center gap-3'>
                  <p className=''>March 9 at 9:32 AM</p>
                  <Users className='h-4 text-slate-500' />
                </div>
              </div>
            </div>

            <div className='mt-8'>
              <p className='text-2xl font-semibold'>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className='my-5'>
              <p className='text-md text-muted-foreground'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sit debitis voluptatibus qui, in excepturi
                molestias mollitia voluptas? Itaque, debitis!
              </p>
            </div>

            <Separator className='h-[0.5px]' />
            <div className='flex'>
              <button className='w-1/3 flex items-center justify-center py-3 group hover:bg-gray-50'>
                <ThumbsUp className='h-5 text-gray-500' />
              </button>
              <button className='w-1/3 flex items-center justify-center py-3'>
                <MessageCircle className='h-5 text-gray-500' />
              </button>
              <button className='w-1/3 flex items-center justify-center py-3'>
                <Pin className='h-5 text-gray-500' />
              </button>
            </div>
            <Separator />

            <div className='h-auto flex-col flex-1 flex-grow max-h-[200px] my-5'>
              <div className='flex flex-col'>
                <div className='flex gap-3'>
                  <Avatar className='w-8 h-8 min-w-8 min-h-8'>
                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-8 rounded-full' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='line-clamp-2'>
                      <span className='font-bold'>Sery Vathana</span>: Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor, repellendus magnam eos cum odit, odio ea, fugiat maxime assumenda ducimus eveniet perspiciatis fugit
                      id voluptas iusto cupiditate sapiente sunt vel inventore? Molestiae.
                    </p>
                    <p className='float-end'>see more</p>
                    <div className='flex gap-5 my-3'>
                      <h1>Like</h1>
                      <h1>Reply</h1>
                    </div>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Avatar className='w-8 h-8 min-w-8 min-h-8'>
                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-8 rounded-full' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='line-clamp-2'>
                      <span className='font-bold'>Sery Vathana</span>: Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor, repellendus magnam eos cum odit, odio ea, fugiat maxime assumenda ducimus eveniet perspiciatis fugit
                      id voluptas iusto cupiditate sapiente sunt vel inventore? Molestiae.
                    </p>
                    <p className='float-end'>see more</p>
                    <div className='flex gap-5 my-3'>
                      <h1>Like</h1>
                      <h1>Reply</h1>
                    </div>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Avatar className='w-8 h-8 min-w-8 min-h-8'>
                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-8 rounded-full' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='line-clamp-2'>
                      <span className='font-bold'>Sery Vathana</span>: Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor, repellendus magnam eos cum odit, odio ea, fugiat maxime assumenda ducimus eveniet perspiciatis fugit
                      id voluptas iusto cupiditate sapiente sunt vel inventore? Molestiae.
                    </p>
                    <p className='float-end'>see more</p>
                    <div className='flex gap-5 my-3'>
                      <h1>Like</h1>
                      <h1>Reply</h1>
                    </div>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Avatar className='w-8 h-8 min-w-8 min-h-8'>
                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-8 rounded-full' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='line-clamp-2'>
                      <span className='font-bold'>Sery Vathana</span>: Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor, repellendus magnam eos cum odit, odio ea, fugiat maxime assumenda ducimus eveniet perspiciatis fugit
                      id voluptas iusto cupiditate sapiente sunt vel inventore? Molestiae.
                    </p>
                    <p className='float-end'>see more</p>
                    <div className='flex gap-5 my-3'>
                      <h1>Like</h1>
                      <h1>Reply</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex w-full space-x-2 bg-white pt-2'>
            <Textarea placeholder='Type your message here.' />
            <Button type='submit' variant={'secondary'} className='min-h-[60px] py-0'>
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </div>

      <PostsContainer />
    </div>
  );
};

export default PostDetailPage;
