import { UserAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const EmptyLayout = () => {
  const auth = UserAuth();

  if (!auth?.user && window.location.pathname != "/login" && window.location.pathname != "/register") {
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
