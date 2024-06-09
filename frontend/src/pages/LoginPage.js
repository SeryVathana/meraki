import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/slices/authThunk";
import { cn } from "@/lib/utils";
import { getToken } from "@/utils/HelperFunctions";
const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
const LoginPage = () => {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // States
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (data) => {
        setIsError(false);
        setErrorMessage("");
        // You can dispatch an action to your Redux store to handle user authentication
        const res = await dispatch(login(data));
        if (res?.payload === undefined) {
            setIsError(true);
            setErrorMessage("Incorrect email or password");
        }
        else {
            navigate("/");
        }
    };
    // const responseGoogle = (response: any) => {
    //   console.log(response); // You'll get user information here
    //   // You can dispatch an action to your Redux store to handle user authentication
    // };
    useEffect(() => {
        const token = getToken();
        if (token) {
            navigate("/");
        }
    });
    useEffect(() => {
        handleCallback();
    }, []);
    // Redirect user to the provider
    function authenticate(provider) {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/${provider}`;
    }
    // Handle the callback
    async function handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            // Store the token in localStorage or a cookie
            localStorage.setItem("token", token);
        }
        else {
            // Handle error
            console.error("Authentication failed");
        }
    }
    return (_jsxs("div", { className: "w-full lg:grid lg:grid-cols-2 min-h-[100vh]", children: [_jsx("div", { className: "flex items-center justify-center py-12 min-h-[100vh]", children: _jsxs("div", { className: "mx-auto grid w-[350px] gap-6", children: [_jsxs("div", { className: "grid gap-2 text-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Login" }), _jsx("p", { className: "text-balance text-muted-foreground", children: "Enter your email below to login to your account" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-10", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "m@example.com", ...register("email"), required: true }), errors.email && _jsx("p", { className: "text-red-500", children: errors.email.message })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("div", { className: "flex items-center", children: _jsx(Label, { htmlFor: "password", children: "Password" }) }), _jsx(Input, { id: "password", type: "password", placeholder: "***********", ...register("password"), required: true }), errors.password && _jsx("p", { className: "text-red-500", children: errors.password.message })] }), isError && (_jsx("div", { className: "flex justify-center items-center my-5", children: _jsx("p", { className: "text-destructive", children: errorMessage }) })), _jsx(Button, { type: "submit", className: cn("w-full", !isError ? "mt-5" : ""), children: "Login" })] }), _jsxs("div", { className: "text-center text-sm", children: ["Don't have an account?", " ", _jsx(Link, { to: "/signup", className: "underline", children: "Sign up" })] }), _jsxs("div", { className: "flex justify-center items-center gap-4", children: [_jsx("div", { className: "h-[1px] w-full bg-gray-300" }), _jsx("span", { className: "text-muted-foreground", children: "or" }), _jsx("div", { className: "h-[1px] w-full bg-gray-300" })] }), _jsxs(Button, { onClick: () => authenticate("google"), variant: "outline", className: "flex items-center gap-2", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", width: "20", height: "20", viewBox: "0 0 48 48", children: [_jsx("path", { fill: "#FFC107", d: "M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" }), _jsx("path", { fill: "#FF3D00", d: "M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" }), _jsx("path", { fill: "#4CAF50", d: "M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" }), _jsx("path", { fill: "#1976D2", d: "M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" })] }), _jsx("span", { children: "Sign Up With Google" })] })] }) }), _jsx("div", { className: "hidden bg-muted lg:block h-[100vh]", children: _jsx("img", { src: "https://images.pexels.com/photos/23105933/pexels-photo-23105933/free-photo-of-a-rock-in-the-ocean-with-waves-crashing-on-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Image", width: "1920", height: "1080", className: "h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" }) })] }));
};
export default LoginPage;
