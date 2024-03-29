import PostsContainer from '@/components/PostsContainer';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PostType } from '@/types/types';
import { useEffect, useState } from 'react';

import { v4 } from 'uuid';

import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronDown, ChevronRight, Heart, Pin, SendHorizonal, Users } from 'lucide-react';
import mockData from '../db/mock-post.json';

import { cn } from '@/lib/utils';

const mock_comments = [
  {
    id: '1',
    comment: 'Nice work',
    replies: [
      {
        id: '4',
        comment: 'asdasd work',
      },
      {
        id: '5',
        comment: 'asdasddd work',
      },
    ],
  },
  {
    id: '2',
    comment: 'Hello work',
    replies: [],
  },
  {
    id: '3',
    comment: 'Bye work',
    replies: [],
  },
];

const PostDetailPage = () => {
  const [postId] = useSearchParams('');
  const idParam = postId.get('id');

  const [post, setPost] = useState<PostType>();

  const [comments, setComments] = useState<any[]>(mock_comments);

  const [inputComment, setInputComment] = useState<string>('');
  const [inputReply, setInputReply] = useState<string>('');

  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyToId, setReplyToId] = useState<string>('');

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const [showedDesc, setShowedDesc] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleMakeReply = (cmtId: string) => {
    if (replyToId != cmtId) {
      setIsReplying(true);
      setReplyToId(cmtId);
      return;
    }

    if (isReplying) {
      setIsReplying(false);
      setReplyToId('');
    } else {
      setIsReplying(true);
      setReplyToId(cmtId);
    }
  };

  const handlePostComment = (comment: string) => {
    if (comment) {
      const cmtObj = {
        id: v4(),
        comment: comment,
        replies: [],
      };
      setComments((prev) => [...prev, cmtObj]);
      setInputComment('');
    }
  };

  const handlePostReply = (cmtId: string, comment: string) => {
    console.log(comment);
    if (comment) {
      const cmtObj = {
        id: v4(),
        comment: comment,
      };

      setComments((prev) =>
        prev.map((cmt) => {
          if (cmt.id === cmtId) {
            return {
              ...cmt,
              replies: [...cmt.replies, cmtObj],
            };
          }

          return cmt;
        })
      );

      setIsReplying(false);
      setInputReply('');
    }
  };

  useEffect(() => {
    mockData.map(async (data) => {
      if (String(data.id) == idParam) {
        setPost(data);

        return data;
      }
    });

    setShowedDesc(false);

    window.scrollTo(0, 0);
  }, [idParam]);

  return (
    <div>
      <div className={cn(' h-[80vh] relative mb-10 max-w-screen-lg mx-auto grid grid-cols-2 gap-10 border-[1px] rounded-2xl')}>
        <div className={cn('w-full h-[80vh] bg-slate-100 border-r-[1px] border-b-[1px] rounded-l-2xl')}>
          <img src={post?.img_url} alt='Image' className={cn('object-contain h-full mx-auto')} />
        </div>
        <div className={cn('relative flex flex-col pt-5 max-h-[80vh]')}>
          <div className={cn('flex flex-col pr-5  overflow-auto')}>
            <div className='flex gap-4 items-center'>
              <Avatar className='cursor-pointer' onClick={() => navigate(`/user?id=${1}`)}>
                <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-12 rounded-full' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <div className='flex gap-2 items-center'>
                  <Button variant={'link'} className='px-0 text-xl font-semibold' onClick={() => navigate(`/user?id=${1}`)}>
                    Sery Vathana
                  </Button>
                  <ChevronRight className='h-6' />
                  <Button variant={'link'} className='px-0 text-xl font-semibold' onClick={() => navigate(`/group?id=${1}`)}>
                    Kab jak
                  </Button>
                </div>
                <div className='flex items-center gap-3'>
                  <p className=''>March 9 at 9:32 AM</p>
                  <Users className='h-4 text-slate-500' />
                </div>
              </div>
            </div>

            <div className='mt-5'>
              <p className='text-2xl font-semibold'>Lorem ipsum dolor sit amet.</p>
            </div>

            <div className={cn('my-3 relative overflow-hidden', showedDesc ? 'overflow-visible' : '')}>
              <p className={cn('text-md  text-muted-foreground')}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sit debitis voluptatibus qui, in excepturi
                molestias mollitia voluptas? Itaque, debitis! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui vitae
                alias deserunt libero maiores voluptas rem modi voluptatem expedita fuga iure reiciendis autem at quidem, eaque
                dolorem enim impedit. Deserunt! lorem50 Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate ad
                consectetur impedit porro laboriosam, molestias ab minus labore natus autem ducimus. Esse, similique? Optio quasi
                nesciunt omnis dicta doloremque? Tenetur error minus eaque omnis asperiores a harum magnam modi ipsa minima vel
                delectus voluptatibus nemo laboriosam, eligendi illo magni impedit?
              </p>
              {showedDesc ? (
                ''
              ) : (
                <>
                  <div className='absolute w-full h-[60px] bg-gradient-to-b from-slate-50 to-slate-900 bottom-0 opacity-10'></div>

                  <div className='absolute w-full bottom-0 flex justify-center py-1' onClick={() => setShowedDesc(true)}>
                    <Button className='opacity-80 w-[35px] h-[35px]' variant={'default'} size={'icon'}>
                      <ChevronDown />
                    </Button>
                  </div>
                </>
              )}
            </div>

            <Separator className='h-[0.5px]' />
            <div className='flex'>
              <button
                className={cn(
                  'w-1/2 flex items-center justify-center py-3 group hover:bg-gray-50 text-gray-500',
                  isLiked && 'text-red-500'
                )}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className='h-5' />
              </button>

              <button
                className={cn(
                  'w-1/2 flex items-center justify-center py-3 group hover:bg-gray-50 text-gray-500',
                  isPinned && 'text-red-500'
                )}
                onClick={() => setIsPinned(!isPinned)}
              >
                <Pin className='h-5' />
              </button>
            </div>
            <Separator />

            <div className='flex flex-col flex-grow my-5'>
              <div className='flex flex-col h-full gap-3'>
                {comments.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <div>
                        <div className='flex gap-3 items-start'>
                          <Avatar className='w-8 h-8 min-w-8 min-h-8' onClick={() => navigate(`/user?id=${1}`)}>
                            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-8 rounded-full' />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className='line-clamp-2 text-sm' onClick={() => navigate(`/user?id=${1}`)}>
                              <span className='font-semibold'>Sery Vathana</span> {comment.comment}
                            </p>

                            <div className='flex items-center gap-4 mb-3 mt-1 text-sm'>
                              <h1>2d</h1>
                              <button
                                className='float-end text-sm hover:text-gray-400'
                                onClick={() => handleMakeReply(comment.id)}
                              >
                                Reply
                              </button>
                              <button
                                className={cn(
                                  'float-end text-gray-600 hover:text-gray-400',
                                  true && 'text-red-500 hover:text-red-300'
                                )}
                              >
                                <Heart className='w-4 ' />
                              </button>
                            </div>
                          </div>
                        </div>

                        {isReplying && replyToId == comment.id ? (
                          <div className='flex w-full gap-2 bg-white pl-10 mb-5'>
                            <Textarea
                              placeholder='Add reply here.'
                              className='border-2 max-h-[100px]'
                              value={inputReply}
                              onChange={(e) => setInputReply(e.target.value)}
                            />
                            <div className='h-full flex items-end'>
                              <Button
                                type='submit'
                                className='min-h-[60px] border-2'
                                onClick={() => handlePostReply(comment.id, inputReply)}
                              >
                                <SendHorizonal />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {comment.replies
                        ? comment.replies.map((reply: any) => {
                            return (
                              <div key={reply.id}>
                                <div className='ml-10 flex gap-3 items-start'>
                                  <Avatar className='w-8 h-8 min-w-8 min-h-8' onClick={() => navigate(`/user?id=${1}`)}>
                                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-8 rounded-full' />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>

                                  <div>
                                    <p className='line-clamp-2 text-sm' onClick={() => navigate(`/user?id=${1}`)}>
                                      <span className='font-semibold'>Sery Vathana</span> {reply.comment}
                                    </p>

                                    <div className='flex items-center  gap-4 mb-3 mt-1 text-sm'>
                                      <h1>2d</h1>
                                      <button
                                        className='float-end text-sm hover:text-gray-400'
                                        onClick={() => handleMakeReply(reply.id)}
                                      >
                                        Reply
                                      </button>
                                      <button
                                        className={cn(
                                          'float-end text-gray-600 hover:text-gray-400',
                                          true && 'text-red-500 hover:text-red-300'
                                        )}
                                      >
                                        <Heart className='w-4 ' />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {isReplying && replyToId == reply.id ? (
                                  <div className='flex w-full gap-2 bg-white pl-10 mb-5'>
                                    <Textarea
                                      placeholder='Add reply here.'
                                      className='border-2  max-h-[100px]'
                                      value={inputReply}
                                      onChange={(e) => setInputReply(e.target.value)}
                                    />
                                    <div className='h-full flex items-end'>
                                      <Button
                                        type='submit'
                                        className='min-h-[60px] border-2'
                                        onClick={() => handlePostReply(comment.id, inputReply)}
                                      >
                                        <SendHorizonal />
                                      </Button>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='sticky bottom-0 flex w-full gap-2  pt-5 pb-5 pr-3 mt-auto border-t-[1px]'>
            <Textarea
              placeholder='Add comment here.'
              className='border-2  max-h-[100px]'
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
            />
            <div className='h-full flex items-end'>
              <Button type='submit' className='min-h-[60px] border-2' onClick={() => handlePostComment(inputComment)}>
                <SendHorizonal />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PostsContainer />
    </div>
  );
};

export default PostDetailPage;
