import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: any }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth?.userData.email) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default ProtectedRoute;
