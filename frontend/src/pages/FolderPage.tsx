import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, MoreHorizontalIcon } from "lucide-react";
import EditFolderDialog from "@/components/dialogs/EditFolderDialog";
import DeleteFolderDialog from "@/components/dialogs/DeleteFolderDialog";

const FolderPage = () => {
  const [folder, setFolder] = useState<any | null>(null);
  const [savedPosts, setSavedPosts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const idParam = useParams().id;
  const navigate = useNavigate();

  const handleFetchFolderInfo = () => {
    // fetch folder info
    console.log("Fetching folder info...");
    setIsLoading(true);
    fetch(`http://localhost:8000/api/folder/${idParam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFolder(data.folder);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFetchSavedPosts = () => {
    if (!folder) {
      return;
    }
    // fetch saved posts
    console.log("Fetching saved posts...");

    fetch(`http://localhost:8000/api/post/savedPosts/${folder.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSavedPosts(data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSavePost = (postId: number) => {
    // remove this post from saved posts state

    fetch(`http://localhost:8000/api/post/savepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        post_id: postId,
        folder_id: [folder.id],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setSavedPosts(savedPosts.filter((post) => post.id !== postId));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    handleFetchFolderInfo();
  }, []);

  useEffect(() => {
    handleFetchSavedPosts();
  }, [folder]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isLoading && !folder) {
    return <Navigate to="/404" />;
  }

  return (
    <div className="mb-10 mt-5">
      <div className="mb-10 space-y-5">
        <div className="flex gap-5 justify-center items-center">
          <h1 className="text-center text-xl font-semibold">{folder.title}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"} size={"icon"}>
                <MoreHorizontalIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <EditFolderDialog folder={folder} handleFetchFolderInfo={handleFetchFolderInfo} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteFolderDialog folder={folder} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-center max-w-[600px] mx-auto text-muted-foreground">{folder.description}</p>
      </div>
      {savedPosts && savedPosts.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto sm:px-10 lg:px-5 xl:px-10 2xl:px-0 gap-5 space-y-5 mt-3">
          {savedPosts?.map((post: any, index: number) => {
            return (
              <div className="group relative border-[1px] rounded-2xl overflow-hidden cursor-pointer" key={index}>
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  className={cn("hidden absolute top-3 right-3 z-10 group-hover:flex hover:border-primary text-white rounded-full")}
                  onClick={() => handleSavePost(post.id)}
                >
                  <h1 className="font-semibold">Unsave</h1>
                </Button>

                <div className="hidden group-hover:flex absolute bottom-3 left-3 z-10 gap-2 items-center" onClick={() => navigate(`/user/${1}`)}>
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.user_pf_img_url} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col text-white ">
                    <h1 className="font-medium text-sm">{capitalizeFirstLetter(post.user_name)}</h1>
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
      ) : (
        <h1 className="text-center">No posts saved in this folder</h1>
      )}
    </div>
  );
};

export default FolderPage;
