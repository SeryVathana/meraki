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
import { Link, NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupsDialog from "./dialogs/GroupsDialog";
import PendingGroupInviteDialog from "./dialogs/PendingGroupInviteDialog";
import SearchDialog from "./dialogs/SearchDialog";
import { Button } from "./ui/button";
import { signOut } from "@/redux/slices/authThunk";
import { useAppDispatch } from "@/redux/hook";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tags, setTags] = React.useState([]);
  const [openDropDown, setOpenDropDown] = React.useState<boolean>(false);

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.userData.email;
  const [selectedTag, setSelectedTag] = React.useState<string>("all");

  const handleUserLogout = async () => {
    dispatch(signOut());
    navigate("/login");
  };

  const tag = useParams().tag;

  const getFullName = () => {
    if (auth?.userData.first_name && auth?.userData.last_name) {
      return `${capitalizeFirstLetter(auth?.userData.first_name)} ${capitalizeFirstLetter(auth?.userData.last_name)}`;
    } else {
      return auth?.userData.email;
    }
  };

  React.useEffect(() => {
    if (window.location.href.includes("tag") || window.location.href == "/") {
      navigate(`/tag/${selectedTag}`);
    }
  }, [selectedTag]);

  React.useEffect(() => {
    fetch("http://localhost:8000/api/tag", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        setTags(data.tags);
      });
  }, []);

  React.useEffect(() => {
    if (tag) {
      setSelectedTag(tag);
    }
  }, [tag]);
  return (
    <div className="w-full flex items-center gap-10">
      <NavLink to="/">
        <h1 className="scroll-m-20 text-lg text-primary font-extrabold tracking-tight lg:text-xl ">Meraki</h1>
      </NavLink>
      <NavigationMenu className="flex gap-2">
        {(window.location.href.includes("tag") || window.location.href == "/") && (
          <NavigationMenuList>
            <Select
              value={selectedTag}
              onValueChange={(val) => {
                setSelectedTag(val);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {tags.map((tag, i) => (
                  <SelectItem key={tag.id} value={String(tag.name).toLowerCase()}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </NavigationMenuList>
        )}
        <NavigationMenuList>
          {user && (
            <NavigationMenuItem asChild>
              <Link to="/create-post">
                <Button>Create Post</Button>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {user ? (
        <div className="flex gap-5 ml-auto">
          <SearchDialog />

          <GroupsDialog userId={auth.userData.id} type="icon" />

          <DropdownMenu open={openDropDown} onOpenChange={() => setOpenDropDown(!openDropDown)}>
            <DropdownMenuTrigger asChild className=" cursor-pointer">
              <div className="relative">
                <Avatar className="border rounded-full">
                  <AvatarImage src={auth.userData.pf_img_url} referrerPolicy="no-referrer" alt="@shadcn" className="object-cover w-full h-full" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {auth.userData.total_noti > 0 && (
                  <div className="absolute -right-1 -top-1 px-[5px] py-[0px] text-xs border rounded-full bg-destructive text-white">
                    {auth.userData.total_noti}
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-10">
              <DropdownMenuLabel>{getFullName()}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {auth.userData.role == "admin" && (
                  <DropdownMenuItem asChild>
                    <NavLink to={"/dashboard"} className="cursor-pointer">
                      Admin Dashboard
                    </NavLink>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile"} className="cursor-pointer">
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile/setting"} className="cursor-pointer">
                    Setting
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile?post=my-posts"} className="cursor-pointer">
                    My Posts
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile?post=my-posts"} className="cursor-pointer">
                    Created Posts
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={"/profile?post=saved-posts"} className="cursor-pointer">
                    Saved Posts
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild onClick={() => setOpenDropDown(false)}>
                  <>
                    <GroupsDialog userId={auth.userData.id} type="drop-down-link" />
                  </>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/create-group")} className="cursor-pointer">
                  Create Groups
                </DropdownMenuItem>
                <DropdownMenuItem asChild onClick={() => setOpenDropDown(false)}>
                  <>
                    <PendingGroupInviteDialog type="drop-down-link" />
                  </>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUserLogout()} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-5 ml-auto">
          <Button variant={"secondary"} asChild>
            <Link to={"/login"}>Log in</Link>
          </Button>
          <Button variant={"default"} asChild>
            <Link to={"/signup"}>Sign up</Link>
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
