import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import GroupsDialog from "./dialogs/GroupsDialog";
import PendingGroupInviteDialog from "./dialogs/PendingGroupInviteDialog";
import SearchDialog from "./dialogs/SearchDialog";
import { Button } from "./ui/button";
import { signOut } from "@/redux/slices/authThunk";
import { useAppDispatch } from "@/redux/hook";

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [openDropDown, setOpenDropDown] = React.useState<boolean>(false);

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.userData.email;

  const handleUserLogout = () => {
    dispatch(signOut());
    navigate("/login");
  };

  return (
    <div className="w-full flex items-center gap-10">
      <NavLink to={"/"}>
        <h1 className="scroll-m-20 text-lg text-primary font-extrabold tracking-tight lg:text-xl ">Meraki</h1>
      </NavLink>
      <NavigationMenu>
        <NavigationMenuList>
          {user && (
            <NavigationMenuItem asChild>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link to="/create-post">Create Post</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {user ? (
        <div className="flex gap-5 ml-auto">
          <SearchDialog />

          <GroupsDialog user_id="1" type="icon" />

          <DropdownMenu open={openDropDown} onOpenChange={() => setOpenDropDown(!openDropDown)}>
            <DropdownMenuTrigger asChild className=" cursor-pointer">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-10">
              <DropdownMenuLabel>{auth.userData.fullname}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {auth.userData.role == "admin" && (
                  <DropdownMenuItem asChild>
                    <NavLink to={"/dashboard"}>Admin Dashboard</NavLink>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile"}>Profile</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile/setting"}>Setting</NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile?post=my-posts"}>My Posts</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={"/create-post"}>Create Posts</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile?post=saved-posts"}>Saved Posts</NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild onClick={() => setOpenDropDown(false)}>
                  <GroupsDialog user_id="1" type="drop-down-link" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/create-group")}>Create Groups</DropdownMenuItem>
                <DropdownMenuItem asChild onClick={() => setOpenDropDown(false)}>
                  <PendingGroupInviteDialog user_id="1" type="drop-down-link" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserLogout()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-5 ml-auto">
          <Button variant={"secondary"} asChild>
            <Link to={"/login"}>Login</Link>
          </Button>
          <Button variant={"default"} asChild>
            <Link to={"/register"}>Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
