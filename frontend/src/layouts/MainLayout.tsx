import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
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
