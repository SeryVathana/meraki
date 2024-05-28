import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { Label } from "@/components/ui/label";
import { GoogleLogin } from "react-google-login"; // Import GoogleLogin component
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/slices/authThunk";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 characters").max(50),
});

const LoginPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // States
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsError(false);
    setErrorMessage("");

    // You can dispatch an action to your Redux store to handle user authentication
    const res = await dispatch(login(data));

    if (res?.payload === undefined) {
      setIsError(true);
      setErrorMessage("Incorrect email or password");
    } else {
      navigate("/");
    }
  };

  // const responseGoogle = (response: any) => {
  //   console.log(response); // You'll get user information here
  //   // You can dispatch an action to your Redux store to handle user authentication
  // };

  useEffect(() => {
    if (auth.token) {
      navigate("/");
    }
  });

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-[100vh]">
      <div className="flex items-center justify-center py-12 min-h-[100vh] md:min-h-auto">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register("email")} required />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" {...register("password")} required />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            {isError && (
              <div className="flex justify-center items-center my-5">
                <p className="text-destructive">{errorMessage}</p>
              </div>
            )}

            <Button type="submit" className={cn("w-full", !isError ? "mt-5" : "")}>
              Login
            </Button>
            {/* Google login button */}
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
          {/* <GoogleLogin
            clientId="584573966192-8vas8uq7o2p04la9pva2eo5pkla0km91.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle} // Handle failure case if needed
            cookiePolicy={"single_host_origin"}
            className="w-full mt-3"
          /> */}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;
