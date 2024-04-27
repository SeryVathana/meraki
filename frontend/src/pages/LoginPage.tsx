import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 character(s)")
    .max(50),
});

const LoginPage = () => {
  const auth = UserAuth();

  if (auth?.user) {
    return <Navigate to={"/"} />;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    auth?.setUser({ email: values.email });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 h-screen pb-32">
      <h1 className="text-3xl">Login</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[400px]"
        >
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

          <span className="text-sm text-muted-foreground pl-auto">
            forgot password?{" "}
            <Link to="/register" className="text-primary">
              create new account
            </Link>
          </span>

          <div className="w-full flex justify-center">
            <Button type="submit" className="float-right">
              Login
            </Button>
          </div>
        </form>
      </Form>
      <span>
        Don't have account?{" "}
        <Link to="/register" className="text-primary">
          register
        </Link>{" "}
        now.
      </span>
    </div>
  );
};

export default LoginPage;
