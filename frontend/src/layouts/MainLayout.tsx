import { Navbar } from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className='w-full'>
      <Navbar />

      <main className='px-10'>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
