import PostsContainer from "@/components/PostsContainer";
import { RootState } from "@/redux/store";
import { getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useSelector } from "react-redux";
import { Navigate, redirect } from "react-router-dom";

const HomePage = () => {
  return <Navigate to="/tag/all" />;
};

export default HomePage;
