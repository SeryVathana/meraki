import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center h-[80vh] justify-center'>
      <h1 className='text-8xl text-red-500'>404</h1>
      <h1 className='text-4xl'>Page not found</h1>
      <div className='mt-5 flex items-center'>
        <p>Back to</p>{' '}
        <Button variant={'link'} onClick={() => navigate('/')}>
          Home page
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
