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
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Heart,
  LoaderCircle,
  MessageCircle,
  Pen,
  Pin,
  SearchX,
  SendHorizonal,
  Trash,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import NotFoundPage from "./NotFoundPage";
import SavePostDialog from "@/components/dialogs/SavePostDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import PostsContainer from "@/components/PostsContainer";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [report, setReport] = useState<string>("");
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);
  const { toast } = useToast();

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
    setIsLiking(true);
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
      })
      .finally(() => setIsLiking(false));
  };

  const handleFetchComments = () => {
    fetch(`http://localhost:8000/api/comment/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments);
      })
      .finally(() => setIsLoadingComments(false));
  };

  const handleFetchPost = () => {
    fetch(`http://localhost:8000/api/post/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setPost(data.post))
      .finally(() => setIsLoading(false));
  };

  const handleFetchRelatedPosts = () => {
    fetch(`http://localhost:8000/api/post/related/${postId}`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => setPosts(data.relatedPosts));
  };

  const handleSubmitReport = () => {
    if (isReporting) return;
    if (report.trim().length == 0) {
      toast({
        title: "Report cannot be empty.",
        description: "Please provide a reason for reporting this post.",
        variant: "destructive",
      });
      return;
    }
    // handle report
    const reqBody = {
      user_id: auth.userData.id,
      post_id: post.id,
      reason: report,
    };

    console.log(reqBody);

    fetch("http://localhost:8000/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.status == 200) {
          setIsReportOpen(false);
          setReport("");
          toast({
            title: "Reported successfully.",
            description: "Your report has been submitted. Post will be reviewed by our team.",
            variant: "success",
          });
        } else {
          toast({
            title: "Failed to report.",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      });

    // close dialog
  };

  const handleDeletePost = () => {
    fetch(`http://localhost:8000/api/post/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          navigate("/profile");
          toast({
            title: "Post deleted successfully.",
            variant: "success",
          });
        } else {
          toast({
            title: "Failed to delete post.",
            variant: "destructive",
          });
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    handleFetchPost();
    handleFetchRelatedPosts();

    window.scrollTo(0, 0);
  }, [postId]);

  useEffect(() => {
    if (isLoadingComments) return;

    setIsLoadingComments(true);
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
                <AvatarImage src={post.user_pf_img_url} alt="@shadcn" className="w-12 h-12 object-cover" />
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-3 right-3">
                  <Ellipsis className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {auth.userData.id == post.user_id || auth.userData.role == "admin" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={`/post/edit/${post.id}`} className="w-full py-0 text-left cursor-pointer">
                        <div className="flex gap-2 justify-start items-center py-1">
                          <Pen className="w-4 h-4" />
                          <span>Edit</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Dialog open={isReportOpen} onOpenChange={() => setIsReportOpen(!isReportOpen)}>
                        <DialogTrigger asChild>
                          <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
                            <Trash className="w-4 h-4" />
                            <span>Delete</span>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Delete Post</DialogTitle>
                          <DialogDescription>Are you sure you want to delete this post? This action cannot be undone.</DialogDescription>
                          <div className="flex gap-5 justify-end">
                            <Button variant="outline" onClick={() => setIsReportOpen(!isReportOpen)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeletePost()}>
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Dialog open={isReportOpen} onOpenChange={() => setIsReportOpen(!isReportOpen)}>
                      <DialogTrigger asChild>
                        <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Report</span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Report Post</DialogTitle>
                        <DialogDescription>If you believe this post violates our community guidelines, please report it.</DialogDescription>
                        <div className="flex flex-col gap-5">
                          <Textarea
                            placeholder="Add reason here."
                            className="border-2 min-h-[150px]"
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                          />
                          <Button variant="default" className="w-full font-semibold" onClick={() => handleSubmitReport()}>
                            Report
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
                disabled={isLiking}
                className={cn(
                  "w-1/2 border-r flex items-center justify-center py-3 group hover:bg-gray-50 text-gray-500",
                  isLiked && "text-red-500 bg-red-50 hover:bg-red-100"
                )}
                onClick={() => handleLikePost(post.id)}
              >
                {isLiking ? <LoaderCircle className="w-5 h-5 text-gray-400 animate-spin" /> : <Heart className="h-5" />}
              </button>
              <SavePostDialog postId={post.id} isSaved={post.is_saved} type="button" />
            </div>
            {/* <Separator /> */}

            {isLoadingComments && comments.length == 0 ? (
              <h1 className="my-2">Loading...</h1>
            ) : (
              <div className="flex flex-col flex-grow my-5">
                {comments.length == 0 && <p className="text-lg text-muted-foreground">No comments yet.</p>}
                <div className="flex flex-col h-full gap-3 overflow-hidden">
                  {comments.map((comment) => {
                    return (
                      <div key={comment.id}>
                        <div className="relative">
                          <div className="flex gap-3 items-start">
                            <Avatar className="w-8 h-8 min-w-8 min-h-8 rounded-full border overflow-hidden" onClick={() => navigate(`/user/${1}`)}>
                              <AvatarImage src={comment.user_pf_img_url} alt="@shadcn" className="w-8 h-8 object-cover" />
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
                                        <AvatarImage src={reply.user_pf_img_url} alt="@shadcn" className="w-8 h-8 object-cover" />
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
            )}
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

      <div className="my-20">
        <h1 className="text-lg font-semibold mt-3">Related Posts</h1>
        <PostsContainer posts={posts} />
      </div>
    </div>
  );
};

export default PostDetailPage;
