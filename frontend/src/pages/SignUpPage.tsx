import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { GoogleLogin } from "react-google-login"; // Import GoogleLogin component
import { getToken } from "@/utils/HelperFunctions";
import { toast, useToast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name must be at least 1 characters").max(50),
    lastName: z.string().min(1, "Last name must be at least 1 characters").max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters in length")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(/[@$!%*#?&]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const errors = form.formState.errors;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission here
    const reqBody = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          toast({
            title: "Successfully registered account.",
            variant: "success",
            description: "Please login to continue.",
          });
          navigate("/login");
        } else {
          if (data.status == 401) {
            // Handle error here
            if (data.errors.email && data.errors?.email[0] == "The email has already been taken.") {
              form.setError("email", { message: "Email already exists" });
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const token = getToken();

    if (token) {
      // Redirect to home page if user is already logged in
      navigate("/tag/all");
    }
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
    } else {
      // Handle error
      console.error("Authentication failed");
    }
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-[100vh]">
      <div className="flex items-center justify-center py-12 h-[100vh]">
        <div className="mx-auto grid w-[500px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">Create account to start using our application. </p>
          </div>

          <Button onClick={() => authenticate("google")} variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span>Sign Up With Google</span>
          </Button>

          <h3 className="text-lg font-semibold text-center">Create New Account</h3>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" placeholder="John" {...form.register("firstName")} required />
                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" placeholder="Doe" {...form.register("lastName")} required />
                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} required />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="***********" {...form.register("password")} required />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="***********" {...form.register("confirmPassword")} required />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="">
              <p className="font-semibold">Password must meet the following criteria:</p>
              <ul className="text-slate-500 ml-2 space-y-1 my-2 text-sm">
                <li>1. Must be at least 8 characters in length</li>
                <li>2. Must contain at least one lowercase letter</li>
                <li>3. Must contain at least one uppercase letter</li>
                <li>4. Must contain at least one digit</li>
                <li>5. Must contain at least one special character (@, $, !, %, *, #, ?, &)</li>
              </ul>
            </div>

            <Button type="submit" className="w-full mt-5">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://images.pexels.com/photos/23731983/pexels-photo-23731983/free-photo-of-a-sheep-is-standing-in-a-field-with-a-tree.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Image"
          className="min-h-[100vh] w-fu object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
