import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { getToken } from "@/utils/HelperFunctions";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/redux/hook";
import { fetchUserData } from "@/redux/slices/authThunk";
const passwordChangeSchema = z
    .object({
    old_password: z.string(),
    new_password: z
        .string()
        .min(8, "Password must be at least 8 characters in length")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(/[@$!%*#?&]/, "Password must contain at least one special character"),
    cf_new_password: z.string(),
})
    .refine((data) => data.new_password === data.cf_new_password, {
    message: "Passwords don't match",
    path: ["cf_new_password"], // path of error
});
const SettingPage = () => {
    const auth = useSelector((state) => state.auth);
    const [user, setUser] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const { toast } = useToast();
    const passwordForm = useForm({
        resolver: zodResolver(passwordChangeSchema),
    });
    function onSubmitPassword(values) {
        setErrMsg("");
        if (values.new_password === values.old_password) {
            passwordForm.setError("new_password", { message: "New password can not be same as old password" });
            return;
        }
        if (values.new_password !== values.cf_new_password) {
            passwordForm.setError("cf_new_password", { message: "Password does not match" });
            return;
        }
        const reqBody = {
            old_password: values.old_password,
            new_password: values.new_password,
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/user/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.message == "New Password can not be same as Old Password") {
                setErrMsg("New password can not be same as old password");
            }
            if (data.message == "Incorrect Old Password") {
                setErrMsg("Old password is incorrect");
            }
            if (data.status == 200) {
                toast({
                    title: "Password Changed",
                    description: "Password has been changed successfully",
                    variant: "success",
                });
            }
            if (data.status == 500) {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive",
                });
            }
        });
    }
    const [postParams] = useSearchParams("");
    const myParams = postParams.get("section");
    const handleFetchUser = async () => {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${auth.userData.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setUser(data.user);
        });
    };
    useEffect(() => {
        handleFetchUser();
    }, [auth]);
    if (!user) {
        return _jsx("h1", { children: "Loading" });
    }
    return (user && (_jsxs("div", { className: "flex w-full mb-10", children: [_jsx("div", { className: "w-1/5 hidden md:flex flex-col my-10", children: _jsx(Link, { to: "/profile/setting?section=profile_setting", className: cn("font-semibold", myParams === "profile_setting" || !myParams ? "underline" : ""), children: "Profile Setting" }) }), myParams === "profile_setting" || !myParams ? (_jsxs("div", { className: "md:w-4/5 lg:w-3/5  xl:w-2/5", children: [_jsx("h1", { className: "text-xl font-bold mt-10", children: "Profile Setting" }), _jsx(Separator, { className: "mt-3 mb-8 " }), user ? (_jsxs("div", { className: "space-y-16", children: [_jsxs("div", { children: [_jsx("h1", { className: "my-5 text-lg font-semibold", children: "General Information" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-10", children: [_jsx(Label, { className: "w-1/2", children: "Email" }), _jsx("div", { className: "w-full", children: _jsx("p", { className: "float-start", children: user.email }) })] }), _jsxs("div", { className: "flex items-center gap-10", children: [_jsx(Label, { className: "w-1/2", children: "First Name" }), _jsx("div", { className: "w-full", children: _jsx("p", { className: "float-start", children: user.first_name }) })] }), _jsxs("div", { className: "flex items-center gap-10", children: [_jsx(Label, { className: "w-1/2", children: "Last Name" }), _jsx("div", { className: "w-full", children: _jsx("p", { className: "float-start", children: user.last_name }) })] })] }), _jsx("div", { className: "w-full flex justify-end mt-5", children: _jsx(EditUserPfDialog, { user: user, handleFetchUserInfo: handleFetchUser }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold mt-10", children: "Credential Setting" }), _jsx(Separator, { className: "mt-3 mb-8 " }), _jsxs("div", { className: "my-10", children: [_jsx("p", { className: "font-semibold", children: "Password must meet the following criteria:" }), _jsxs("ul", { className: "text-slate-500 ml-2 space-y-1 my-2 text-sm", children: [_jsx("li", { children: "1. Must be at least 8 characters in length" }), _jsx("li", { children: "2. Must contain at least one lowercase letter" }), _jsx("li", { children: "3. Must contain at least one uppercase letter" }), _jsx("li", { children: "4. Must contain at least one digit" }), _jsx("li", { children: "5. Must contain at least one special character (@, $, !, %, *, #, ?, &)" })] })] }), _jsx(Form, { ...passwordForm, children: _jsxs("form", { onSubmit: passwordForm.handleSubmit(onSubmitPassword), className: "space-y-2 ", children: [_jsx(FormField, { control: passwordForm.control, name: "old_password", render: ({ field }) => (_jsxs(_Fragment, { children: [_jsxs(FormItem, { className: "flex items-center gap-10", children: [_jsx(FormLabel, { className: "w-1/2", children: "Old Password" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "*********", type: "password", ...field }) })] }), _jsx("div", { className: "flex justify-end", children: _jsx(FormMessage, { className: "w-fit" }) })] })) }), _jsx(FormField, { control: passwordForm.control, name: "new_password", render: ({ field }) => (_jsxs(_Fragment, { children: [_jsxs(FormItem, { className: "flex items-center gap-10", children: [_jsx(FormLabel, { className: "w-1/2", children: "New Password" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "*********", type: "password", ...field }) })] }), _jsx("div", { className: "flex justify-end", children: _jsx(FormMessage, { className: "w-fit" }) })] })) }), _jsx(FormField, { control: passwordForm.control, name: "cf_new_password", render: ({ field }) => (_jsxs(_Fragment, { children: [_jsxs(FormItem, { className: "flex items-center gap-10", children: [_jsx(FormLabel, { className: "w-1/2", children: "Confirm New Password" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "*********", type: "password", ...field }) })] }), _jsx("div", { className: "flex justify-end", children: _jsx(FormMessage, { className: "w-fit" }) })] })) }), _jsx("div", { className: "flex justify-center", children: errMsg ? _jsx("p", { className: "text-red-500", children: errMsg }) : "" }), _jsx("div", { className: "w-full flex justify-end pt-5", children: _jsx(Button, { type: "submit", children: "Change Password" }) })] }) })] })] })) : ("")] })) : ("")] })));
};
const EditUserPfDialog = ({ user, handleFetchUserInfo }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const generalChangeSchema = z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
    });
    const generalForm = useForm({
        resolver: zodResolver(generalChangeSchema),
        defaultValues: {
            first_name: user.first_name,
            last_name: user.last_name,
        },
    });
    function onSubmitGeneral(values) {
        if (!values.first_name && !values.last_name) {
            return;
        }
        fetch(`${import.meta.env.VITE_SERVER_URL}/user/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((data) => {
            setOpen(false);
            handleFetchUserInfo();
            dispatch(fetchUserData());
        });
    }
    return (_jsxs(Dialog, { open: open, onOpenChange: () => setOpen(!open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "default", children: "Edit Profile" }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] lg:max-w-screen-sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit profile" }), _jsx(DialogDescription, { children: "Make changes to your profile here. Click save when you're done." })] }), _jsx(Form, { ...generalForm, children: _jsxs("form", { onSubmit: generalForm.handleSubmit(onSubmitGeneral), className: "space-y-4 ", children: [_jsx(FormField, { control: generalForm.control, name: "first_name", render: ({ field }) => (_jsxs(FormItem, { className: "flex items-center gap-10", children: [_jsx(FormLabel, { className: "w-1/3", children: "First Name" }), _jsxs("div", { className: "w-2/3 space-y-2", children: [_jsx(FormControl, { children: _jsx(Input, { placeholder: "", type: "text", ...field }) }), _jsx(FormMessage, {})] })] })) }), _jsx(FormField, { control: generalForm.control, name: "last_name", render: ({ field }) => (_jsxs(FormItem, { className: "flex items-center gap-10", children: [_jsx(FormLabel, { className: "w-1/3", children: "Last Name" }), _jsxs("div", { className: "w-2/3 space-y-2", children: [_jsx(FormControl, { children: _jsx(Input, { placeholder: "", type: "text", ...field }) }), _jsx(FormMessage, {})] })] })) }), _jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { type: "submit", className: "float-end", children: "Save Changes" }) })] }) })] })] }));
};
export default SettingPage;
