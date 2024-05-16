import PostsContainer from "@/components/PostsContainer";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const HomePage = () => {
  const auth = useSelector((state: RootState) => state.auth);

  if (auth?.userData.email) {
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
