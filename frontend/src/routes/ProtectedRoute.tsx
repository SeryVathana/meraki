import { UserAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: any }) => {
  const auth = UserAuth();

  if (!auth?.user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default ProtectedRoute;
