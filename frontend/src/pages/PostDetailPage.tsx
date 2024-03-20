import PostsContainer from '@/components/PostsContainer';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { PostType } from '@/types/types';

import mockData from '../db/mock-post.json';
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
    // setPost(
    // );
  }, [postId]);

  return (
    <div>
      <div className='w-[1000px] min-h-[300px] overflow-hidden flex mx-auto rounded-3xl shadow-lg shadow-slate-100 my-10'>
        <div className='w-1/2 h-full '>
          <img src={post.img_url} className='w-full h-auto rounded-l-3xl' />
        </div>
        <div>
          <h1>Hi</h1>
        </div>
      </div>

      <PostsContainer />
    </div>
  );
};

export default PostDetailPage;
