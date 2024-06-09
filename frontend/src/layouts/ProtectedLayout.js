import { jsx as _jsx } from "react/jsx-runtime";
import { getToken } from "@/utils/HelperFunctions";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
const ProtectedRoute = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const token = getToken();
    if (!token) {
        navigate("/login");
    }
    return (_jsx("div", { children: _jsx(Outlet, {}) }));
};
export default ProtectedRoute;
