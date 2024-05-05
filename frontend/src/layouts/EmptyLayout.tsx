import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const EmptyLayout = () => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth?.email && window.location.pathname != "/login" && window.location.pathname != "/register") {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="px-5 md:px-10">
      <Outlet />
    </div>
  );
};

export default EmptyLayout;
