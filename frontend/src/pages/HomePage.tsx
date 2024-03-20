import PostsContainer from "@/components/PostsContainer";
import { UserAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const auth = UserAuth();
  const user = auth?.user;

  if (user?.email) {
    return <PostsContainer />;
  } else {
    return (
      <div>
        <h1>Welcome page</h1>
      </div>
    );
  }
};

export default HomePage;
