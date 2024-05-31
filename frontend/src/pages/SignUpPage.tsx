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
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
    userName: z.string().min(2, "Username must be at least 2 characters").max(16, "Username must be at most 16 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must contain at least 8 characters").max(50),
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
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const errors = form.formState.errors;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission here
    console.log(data);

    const reqBody = {
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.userName,
      email: data.email,
      password: data.password,
    };

    fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
            if (data.errors.username && data.errors.username[0] == "The username has already been taken.") {
              form.setError("userName", { message: "Username already exists" });
            }
          }
          // Redirect to login page
        }
      })
      .catch((err) => console.error(err));

    // form.setError("email", { message: "Email already exists" });
  };

  useEffect(() => {
    const token = getToken();

    if (token) {
      // Redirect to home page if user is already logged in
      navigate("/tag/all");
    }
  }, []);

  // const responseGoogle = (response: any) => {
  //   console.log("ers:", response); // You'll get user information here
  //   // You can dispatch an action to your Redux store to handle user authentication
  // };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-[100vh]">
      <div className="flex items-center justify-center py-12 h-[100vh]">
        <div className="mx-auto grid w-[500px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">Enter your email and password to create an account</p>
          </div>
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
              <Label htmlFor="userName">Username</Label>
              <Input id="userName" type="text" placeholder="johndoe" {...form.register("userName")} required />
              {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} required />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} required />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} required />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
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
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
