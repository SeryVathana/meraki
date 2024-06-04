import { RootState } from "@/redux/store";
import { getToken } from "@/utils/HelperFunctions";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const token = getToken();

  if (!token) {
    navigate("/login");
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
