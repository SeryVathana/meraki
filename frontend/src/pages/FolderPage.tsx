import PostsContainer from "@/components/PostsContainer";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

const FolderPage = () => {
  const [pageParams] = useSearchParams("");

  const folderParam = pageParams.get("id");

  if (!folderParam) return <Navigate to={"/profile?post=saved-posts"} />;

  useEffect(() => {
    window.scrollTo(0, 0)
  },[]) 

  return (
    <div className="mb-10 mt-5">
      <div className="mb-10 space-y-5">
        <h1 className="mx-auto text-center text-xl font-medium">Folder Name</h1>
        <p className="text-center max-w-[600px] mx-auto text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam deserunt iusto laudantium, quisquam qui harum nisi ducimus magni voluptate
          voluptatum consequatur tempora, voluptates explicabo! Beatae mollitia impedit modi! Velit enim vitae est laudantium laborum nobis ut
          repudiandae temporibus quam, cupiditate alias ipsum non, quis consectetur aperiam impedit! Distinctio, optio vitae!
        </p>
      </div>
      <PostsContainer />
    </div>
  );
};

export default FolderPage;
