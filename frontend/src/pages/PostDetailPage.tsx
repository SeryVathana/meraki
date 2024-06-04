import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { PostType } from "@/types/types";
import { getToken } from "@/utils/HelperFunctions";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { format, formatDistance, set } from "date-fns";
import { ChevronDown, ChevronRight, Heart, LoaderCircle, MessageCircle, Pin, SearchX, SendHorizonal, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import NotFoundPage from "./NotFoundPage";

const PostDetailPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { postId } = useParams();
  const [post, setPost] = useState<PostType>();
  const [comments, setComments] = useState<any[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [inputComment, setInputComment] = useState<string>("");
  const [inputReply, setInputReply] = useState<string>("");
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyToId, setReplyToId] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleMakeReply = (cmtId: string) => {
    if (replyToId != cmtId) {
      setIsReplying(true);
      setReplyToId(cmtId);
      return;
    }

    if (isReplying) {
      setIsReplying(false);
      setReplyToId("");
    } else {
      setIsReplying(true);
      setReplyToId(cmtId);
    }
  };

  const handlePostComment = (postId: number, comment: string) => {
    if (comment) {
      fetch(`http://localhost:8000/api/comment`, {
        method: "POST",
        body: JSON.stringify({ post_id: postId, comment }),
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 200) {
            handleFetchComments();
          }
        });

      setInputComment("");
    }
  };

  const handlePostReply = (cmtId: string, comment: string) => {
    if (comment.trim()) {
      fetch(`http://localhost:8000/api/comment/${cmtId}/reply`, {
        method: "POST",
        body: JSON.stringify({ comment }),
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 200) {
            handleFetchComments();
          }
        });

      setIsReplying(false);
      setInputReply("");
    }
  };

  const handleLikePost = (postId: number) => {
    setIsLiked((prev) => !prev);
    fetch(`http://localhost:8000/api/post/like/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          handleFetchPost();
        }
      });
  };

  const handleFetchComments = () => {
    fetch(`http://localhost:8000/api/comment/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments);
      });
  };

  const handleFetchPost = () => {
    fetch(`http://localhost:8000/api/post/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setPost(data.post))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    handleFetchPost();

    window.scrollTo(0, 0);
  }, [postId]);

  useEffect(() => {
    handleFetchComments();
  }, [postId]);

  useEffect(() => {
    setIsLiked(post?.is_liked);
  }, [post]);

  useEffect(() => {
    // calculate total comment length with replies
    let totalComments = 0;
    comments.forEach((comment) => {
      totalComments += comment.replies.length + 1;
    });
    setTotalComments(totalComments);
  }, [comments]);

  if (isLoading && !post) {
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-2">
        <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && !post) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <div className={cn(" h-[80vh] relative mb-10 max-w-screen-lg mx-auto grid grid-cols-2 gap-10 border-[1px] rounded-2xl")}>
        <div className={cn("w-full h-[80vh] bg-slate-100 border-r-[1px] border-b-[1px] rounded-l-2xl overflow-hidden")}>
          <img src={post?.img_url} alt="Image" className={cn("object-contain h-full mx-auto")} />
        </div>
        <div className={cn("relative flex flex-col pt-5 max-h-[80vh]")}>
          <div className={cn("flex flex-col pr-5  overflow-auto")}>
            <div className="flex gap-4 items-center">
              <Avatar className="cursor-pointer border rounded-full overflow-hidden" onClick={() => navigate(`/user/${1}`)}>
                <AvatarImage src={post.user_pf_img_url} alt="@shadcn" className="w-12 " />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex gap-2 items-center">
                  <Link to={`/user/${post.user_id}`} className="px-0 py-0 text-xl font-semibold text-primary hover:underline">
                    {post.user_name}
                  </Link>
                  {post?.group_id && (
                    <>
                      <ChevronRight className="h-6" />
                      <Link to={`/group/${post.group_id}`} className="px-0 py-0 text-xl font-semibold text-primary hover:underline">
                        {post.group_title}
                      </Link>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs">{format(new Date(post?.created_at), "PPpp")}</p>
                  <Users className="h-4 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-2xl font-semibold">{post?.title}</p>
            </div>

            <div className="my-3">
              <p className={cn("text-md  text-muted-foreground")}>{post.description}</p>
            </div>

            <div className="flex gap-2">
              {post.tags.map((tag) => {
                return (
                  <Link to={`/tag/${String(tag.name).toLowerCase()}`} key={tag.id} className="text-blue-600 text-sm">
                    #{tag.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex gap-5 items-center my-2">
              <div className="flex items-center gap-1">
                <Heart className="w-4 text-red-500 mt-[2px]" />
                <p className="text-md">{post.like_count}</p>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 text-gray-500 mt-[2px]" />
                <p className="text-md">{totalComments}</p>
              </div>
            </div>

            <div className="flex border rounded-sm">
              <button
                className={cn(
                  "w-1/2 border-r flex items-center justify-center py-3 group hover:bg-gray-50 text-gray-500",
                  isLiked && "text-red-500 bg-red-50 hover:bg-red-100"
                )}
                onClick={() => handleLikePost(post.id)}
              >
                <Heart className="h-5" />
              </button>
            </div>
            {/* <Separator /> */}

            <div className="flex flex-col flex-grow my-5">
              {comments.length == 0 && <p className="text-lg text-muted-foreground">No comments yet.</p>}
              <div className="flex flex-col h-full gap-3 overflow-hidden">
                {comments.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <div className="relative">
                        <div className="flex gap-3 items-start">
                          <Avatar className="w-8 h-8 min-w-8 min-h-8 rounded-full border overflow-hidden" onClick={() => navigate(`/user/${1}`)}>
                            <AvatarImage src={comment.user_pf_img_url} alt="@shadcn" className="w-8" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="text-sm max-w-full ">
                              <span className="font-semibold mr-2 cursor-pointer hover:underline" onClick={() => navigate(`/user/${1}`)}>
                                {comment.user_name}
                              </span>{" "}
                              <span className="break-words break-all">{comment.comment}</span>
                            </p>

                            <div className="flex items-center gap-4 mb-3 mt-1 text-sm text-muted-foreground">
                              <h1>{comment.created_at != undefined && formatDistance(new Date(comment?.created_at), new Date())}</h1>
                              <button className="float-end text-sm hover:text-gray-400" onClick={() => handleMakeReply(comment.id)}>
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>

                        {isReplying && replyToId == comment.id ? (
                          <div className="flex w-full gap-2 bg-white pl-10 mb-5">
                            <Textarea
                              placeholder="Add reply here."
                              className="border-2 max-h-[100px]"
                              value={inputReply}
                              onChange={(e) => setInputReply(e.target.value)}
                            />
                            <div className="h-full flex items-end">
                              <Button type="submit" className="min-h-[60px] border-2" onClick={() => handlePostReply(comment.id, inputReply)}>
                                <SendHorizonal />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="ml-10 relative">
                        <div className="w-[1.5px] h-[calc(100%-30px)] bg-gray-300 absolute -left-7 top-0"></div>
                        {comment.replies
                          ? comment.replies.map((reply: any) => {
                              return (
                                <div key={reply.id}>
                                  <div className="flex gap-3 items-start">
                                    <Avatar
                                      className="w-8 h-8 min-w-8 min-h-8 rounded-full border overflow-hidden"
                                      onClick={() => navigate(`/user/${1}`)}
                                    >
                                      <AvatarImage src={reply.user_pf_img_url} alt="@shadcn" className="w-8" />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>

                                    <div>
                                      <p className="line-clamp-2 text-sm">
                                        <span className="font-semibold mr-2 cursor-pointer hover:underline" onClick={() => navigate(`/user/${1}`)}>
                                          {reply.user_name}
                                        </span>{" "}
                                        {reply.comment}
                                      </p>

                                      <div className="flex items-center gap-4 mb-3 mt-1 text-xs">
                                        <h1 className="text-muted-foreground">
                                          {reply.created_at != undefined && formatDistance(new Date(reply.created_at), new Date())}
                                        </h1>
                                        <button className="float-end hover:text-gray-400" onClick={() => handleMakeReply(reply.id)}>
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {isReplying && replyToId == reply.id ? (
                                    <div className="flex w-full gap-2 bg-white pl-10 mb-5">
                                      <Textarea
                                        placeholder="Add reply here."
                                        className="border-2  max-h-[100px]"
                                        value={inputReply}
                                        onChange={(e) => setInputReply(e.target.value)}
                                      />
                                      <div className="h-full flex items-end">
                                        <Button
                                          type="submit"
                                          className="min-h-[60px] border-2"
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 flex w-full gap-2  pt-5 pb-5 pr-3 mt-auto border-t-[1px]">
            <Textarea
              placeholder="Add comment here."
              className="border-2  max-h-[60px]"
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
            />
            <div className="h-full flex items-end">
              <Button type="submit" className="min-h-[60px] border-2" onClick={() => handlePostComment(post.id, inputComment)}>
                <SendHorizonal />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <PostsContainer posts={pos} /> */}
    </div>
  );
};

export default PostDetailPage;
