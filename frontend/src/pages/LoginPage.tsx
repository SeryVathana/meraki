import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 character(s)").max(50),
});

const LoginPage = () => {
  const auth = useSelector((state: RootState) => state.auth);

  // if (auth?.email) {
  //   return <Navigate to={"/"} />;
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onLogin(values: z.infer<typeof formSchema>) {}

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full mt-5">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
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
    // <div className="flex flex-col items-center justify-center gap-10 h-screen pb-32">
    //   <h1 className="text-3xl">Login</h1>

    //   <Form {...form}>
    //     <form
    //       onSubmit={form.handleSubmit(onLogin)}
    //       className="space-y-8 w-[400px]"
    //     >
    //       <FormField
    //         control={form.control}
    //         name="email"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Email</FormLabel>
    //             <FormControl>
    //               <Input placeholder="joe@mail.com" type="email" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name="password"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Password</FormLabel>
    //             <FormControl>
    //               <Input placeholder="********" type="password" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <span className="text-sm text-muted-foreground pl-auto">
    //         forgot password?{" "}
    //         <Link to="/register" className="text-primary">
    //           create new account
    //         </Link>
    //       </span>

    //       <div className="w-full flex justify-center">
    //         <Button type="submit" className="float-right">
    //           Login
    //         </Button>
    //       </div>
    //     </form>
    //   </Form>
    //   <span>
    //     Don't have account?{" "}
    //     <Link to="/register" className="text-primary">
    //       register
    //     </Link>{" "}
    //     now.
    //   </span>
    // </div>
  );
};

export default LoginPage;
