import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const NotFoundPage = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: 'flex flex-col items-center h-[80vh] justify-center', children: [_jsx("h1", { className: 'text-8xl text-red-500', children: "404" }), _jsx("h1", { className: 'text-4xl', children: "Page not found" }), _jsxs("div", { className: 'mt-5 flex items-center', children: [_jsx("p", { children: "Back to" }), ' ', _jsx(Button, { variant: 'link', onClick: () => navigate('/'), children: "Home page" })] })] }));
};
export default NotFoundPage;
