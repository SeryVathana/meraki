import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getToken } from "@/utils/HelperFunctions";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Newspaper, Sparkles, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = getLastFiveMonths();

const DashboardOverviewPage = () => {
  const defaultData = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(64, 192, 87, 0.8)",
      },
    ],
  };

  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalGroups, setTotalGroups] = useState<number>(0);
  const [weeklyNewUsers, setWeeklyNewUsers] = useState<number>(0);
  const [lastWeekUsersPercentage, setLastWeekUsersPercentage] = useState<number>(0);
  const [lastWeekPostsPercentage, setLastWeekPostsPercentage] = useState<number>(0);
  const [lastWeekGroupsPercentage, setLastWeekGroupsPercentage] = useState<number>(0);
  const [lastWeekNewUsersDifferent, setLastWeekNewUsersDifferent] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [lastSixMonthsPosts, setLastSixMonthsPosts] = useState<any>(defaultData);
  const [isLoadingNewUsers, setIsLoadingNewUsers] = useState<boolean>(false);

  const handleFetchTotalUsers = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/getTotalUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalUsers(data.data.total_users);
        setLastWeekUsersPercentage(data.data.last_week_percent);
      });
  };

  const handleFetchTotalPosts = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/getTotalPosts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalPosts(data.data.total_posts);
        setLastWeekPostsPercentage(data.data.last_week_percent);
      });
  };

  const handleFetchTotalGroups = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/getTotalGroups`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalGroups(data.data.total_groups);
        setLastWeekGroupsPercentage(data.data.last_week_percent);
      });
  };

  const handleFetchWeeklyNewUsers = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/getWeeklyNewUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWeeklyNewUsers(data.data.weekly_new_users);
        setLastWeekNewUsersDifferent(data.data.difference);
      });
  };

  const handleFetchNewUsers = async () => {
    setIsLoadingNewUsers(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/get10NewUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNewUsers(data.data);
      })
      .finally(() => {
        setIsLoadingNewUsers(false);
      });
  };

  const handleFetchLastSixMonthsPosts = async () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/getTotalPostsOfLastSixMonths`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const posts = data.data;

        const newDatasets = [
          {
            label: "Posts",
            data: posts,
            backgroundColor: "rgba(64, 192, 87, 0.8)",
          },
        ];

        setLastSixMonthsPosts({
          labels,
          datasets: newDatasets,
        });
      });
  };

  useEffect(() => {
    handleFetchTotalUsers();
    handleFetchTotalPosts();
    handleFetchTotalGroups();
    handleFetchWeeklyNewUsers();
    handleFetchNewUsers();
    handleFetchLastSixMonthsPosts();
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{lastWeekUsersPercentage.toFixed(1)}% from last week</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{lastWeekPostsPercentage.toFixed(1)}% from last week</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGroups.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{lastWeekGroupsPercentage.toFixed(1)}% from last week</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly New Users</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{weeklyNewUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{lastWeekNewUsersDifferent.toLocaleString()} since last week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="xl:col-span-3" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>User's posts</CardTitle>
              <CardDescription>Total user's post of last 6 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Bar options={options} data={lastSixMonthsPosts} />
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>New users</CardTitle>
          </CardHeader>
          <CardContent className="grid">
            {newUsers.length === 0 && isLoadingNewUsers && isLoadingNewUsers
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div key={index} className="flex items-center gap-4 px-1 py-3">
                    <Skeleton className="hidden h-9 w-9 sm:flex rounded-full" />

                    <div className="grid gap-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))
              : newUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 hover:bg-muted px-1 py-3 rounded-md cursor-pointer"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={user.pf_img_url} alt="Avatar" className="object-cover" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">{user.first_name + " " + user.last_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

function getLastFiveMonths() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  let currentMonth = today.getMonth();

  const lastFiveMonths: string[] = [];
  for (let i = 0; i < 6; i++) {
    // Handle going back to December from January
    const monthIndex = (currentMonth - i + 12) % 12;
    lastFiveMonths.push(months[monthIndex]);
  }

  return lastFiveMonths.reverse(); // Reverse to get most recent month first
}

export default DashboardOverviewPage;
