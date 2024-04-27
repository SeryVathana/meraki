import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const EmptyLayout = () => {
  const auth = useSelector((state: RootState) => state.auth);

  if (
    !auth?.email &&
    window.location.pathname != "/login" &&
    window.location.pathname != "/register"
  ) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="w-full">
      <main className="px-10">
        <Outlet />
      </main>
    </div>
  );
};

export default EmptyLayout;
