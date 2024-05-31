import { Navbar } from "@/components/Navbar";
import { useAppDispatch } from "@/redux/hook";
import { fetchUserData } from "@/redux/slices/authThunk";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(fetchUserData());
  // }, []);

  return (
    <div className="w-full relative">
      <header className=" w-full h-[8vh] sticky top-0 z-50 bg-white flex items-center">
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
