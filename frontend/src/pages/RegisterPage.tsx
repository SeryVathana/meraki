import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must contain at least 8 character(s)").max(50),
    cf_password: z.string().min(8).max(50),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Passwords don't match",
    path: ["cf_password"],
  });

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      cf_password: "",
    },
  });

  const auth = UserAuth();

  function onSubmit(values: z.infer<typeof formSchema>) {
    auth?.setUser({ email: values.email });
  }

  if (auth?.user) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 h-screen">
      <h1 className="text-3xl">Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[400px]">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="joe@mail.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cf_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button type="submit" className="">
              Register
            </Button>
          </div>
        </form>
      </Form>
      <span>
        Already have account?{" "}
        <Link to="/login" className="text-primary">
          login
        </Link>{" "}
        now.
      </span>
    </div>
  );
};

export default RegisterPage;
