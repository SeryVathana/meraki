import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { UserAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import GroupsDialog from './dialogs/GroupsDialog';
import SearchDialog from './dialogs/SearchDialog';
import { Button } from './ui/button';
import PendingGroupInviteDialog from './dialogs/PendingGroupInviteDialog';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

export function Navbar() {
  const navigate = useNavigate();

  const [openDropDown, setOpenDropDown] = React.useState<boolean>(false);

  const auth = UserAuth();
  const user: boolean = auth?.user;

  const handleLogOut = () => {
    auth?.setUser(null);
    navigate('/');
  };

  return (
    <div className='py-5 px-10 flex items-center gap-10 w-full sticky top-0 z-10 bg-white'>
      <NavLink to={'/'}>
        <h1 className='scroll-m-20 text-4xl text-primary font-extrabold tracking-tight lg:text-xl '>Meraki</h1>
      </NavLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                <li className='row-span-3'>
                  <NavigationMenuLink asChild>
                    <a
                      className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                      href='/'
                    >
                      <div className='mb-2 mt-4 text-lg font-medium'>shadcn/ui</div>
                      <p className='text-sm leading-tight text-muted-foreground'>
                        Beautifully designed components built with Radix UI and Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href='/docs' title='Introduction'>
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href='/docs/installation' title='Installation'>
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href='/docs/primitives/typography' title='Typography'>
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {user && (
            <NavigationMenuItem asChild>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link to='/create-post'>Create</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {user ? (
        <div className='flex gap-5 ml-auto'>
          <SearchDialog />

          <GroupsDialog user_id='1' type='icon' />

          <DropdownMenu open={openDropDown} onOpenChange={() => setOpenDropDown(!openDropDown)}>
            <DropdownMenuTrigger asChild className=' cursor-pointer'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 mr-10'>
              <DropdownMenuLabel>Sery Vathana</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <NavLink to={'/profile'}>Profile</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={'/profile/setting'}>Setting</NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <NavLink to={'/profile?post=my-posts'}>My Posts</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={'/create-post'}>Create Posts</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to={'/profile?post=saved-posts'}>Saved Posts</NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild onClick={() => setOpenDropDown(false)}>
                  <GroupsDialog user_id='1' type='drop-down-link' />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-group')}>Create Groups</DropdownMenuItem>
                <DropdownMenuItem asChild onClick={() => setOpenDropDown(false)}>
                  <PendingGroupInviteDialog user_id='1' type='drop-down-link' />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className='flex gap-5 ml-auto'>
          <Button variant={'secondary'} asChild>
            <Link to={'/login'}>Login</Link>
          </Button>
          <Button variant={'default'} asChild>
            <Link to={'/register'}>Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
