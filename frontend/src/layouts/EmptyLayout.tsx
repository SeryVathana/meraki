import { useAppDispatch } from "@/redux/hook";
import { fetchUserData } from "@/redux/slices/authThunk";
import { RootState } from "@/redux/store";
import { getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const EmptyLayout = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      await dispatch(fetchUserData());
    } catch (e) {
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserData();
  }, [auth.token]);

  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default EmptyLayout;
