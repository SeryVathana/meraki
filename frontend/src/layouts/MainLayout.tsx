import { Navbar } from "@/components/Navbar";
import { useAppDispatch } from "@/redux/hook";
import { fetchUserData } from "@/redux/slices/authThunk";
import { getToken } from "@/utils/HelperFunctions";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useSWR from "swr";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Store the interval id in a const, so you can cleanup later
    const intervalId = setInterval(() => {
      dispatch(fetchUserData());
    }, 5000);

    return () => {
      // Since useEffect dependency array is empty, this will be called only on unmount
      clearInterval(intervalId);
    };
  }, []);
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
