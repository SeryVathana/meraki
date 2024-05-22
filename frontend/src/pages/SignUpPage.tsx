import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { z } from "zod";
import { GoogleLogin } from 'react-google-login'; // Import GoogleLogin component

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 characters").max(50),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, { message: "Please accept the terms and conditions" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUpPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission here
  };

  const responseGoogle = (response: any) => {
    console.log("ers:", response); // You'll get user information here
    // You can dispatch an action to your Redux store to handle user authentication
  };
   

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">Enter your email and password to create an account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register("email")} required />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} required />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} required />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" {...register("terms")} required />
              <Label htmlFor="terms">Accept terms and conditions</Label>
              {errors.terms && <p className="text-red-500">{errors.terms.message}</p>}
            </div>
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>} {/* Error message for password mismatch */}

            <Button type="submit" className="w-full mt-5">
              Sign Up
            </Button>

            {/* Google login button */}
            <GoogleLogin
              clientId="584573966192-8vas8uq7o2p04la9pva2eo5pkla0km91.apps.googleusercontent.com"
              buttonText="Sign up with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle} // Handle failure case if needed
              cookiePolicy={'single_host_origin'}
              className="w-full mt-3"
            />
            

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

export default SignUpPage;
