import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SavePostDialog from "./dialogs/SavePostDialog";

const PostsContainer = ({ posts }: { posts: any[] }) => {
  const navigate = useNavigate();
  const [data, setData]: any[] = useState<any[]>(posts);
  useEffect(() => {
    setData(posts);
  }, [posts]);

  if (!data) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-5 xl:px-10 2xl:px-0 gap-5 space-y-5 mt-3">
      {data?.map((post: any, index: number) => {
        return (
          <div className="group relative border-[1px] rounded-2xl overflow-hidden cursor-pointer" key={index}>
            <SavePostDialog postId={post.id} isSaved={post.is_saved} />

            <div className="hidden group-hover:flex absolute bottom-3 left-3 z-10 gap-2 items-center" onClick={() => navigate(`/user/${1}`)}>
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.user_pf_img_url} alt="@shadcn" className="object-cover w-full h-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-white">
                <h1 className="font-medium text-sm line-clamp-1 truncate">{post.user_name}</h1>
              </div>
            </div>

            <div key={index} onClick={() => navigate(`/post/${post.id}`)}>
              <img className="w-full bg-gray-300" src={post.img_url} alt="" />
              <div className="hidden group-hover:flex">
                <div className="absolute top-0 left-0 w-full h-full opacity-80 bg-gradient-to-t from-black to-[#80808050]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsContainer;
