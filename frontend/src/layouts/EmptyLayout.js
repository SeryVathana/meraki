import { jsx as _jsx } from "react/jsx-runtime";
import { useAppDispatch } from "@/redux/hook";
import { fetchUserData } from "@/redux/slices/authThunk";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
const EmptyLayout = () => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const getUserData = async () => {
        try {
            await dispatch(fetchUserData());
        }
        catch (e) {
            navigate("/login");
        }
    };
    useEffect(() => {
        getUserData();
    }, [auth.token]);
    return (_jsx("div", { className: "", children: _jsx(Outlet, {}) }));
};
export default EmptyLayout;
