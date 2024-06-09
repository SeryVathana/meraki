import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [weeklyNewUsers, setWeeklyNewUsers] = useState(0);
    const [lastWeekUsersPercentage, setLastWeekUsersPercentage] = useState(0);
    const [lastWeekPostsPercentage, setLastWeekPostsPercentage] = useState(0);
    const [lastWeekGroupsPercentage, setLastWeekGroupsPercentage] = useState(0);
    const [lastWeekNewUsersDifferent, setLastWeekNewUsersDifferent] = useState(0);
    const [newUsers, setNewUsers] = useState([]);
    const [lastSixMonthsPosts, setLastSixMonthsPosts] = useState(defaultData);
    const [isLoadingNewUsers, setIsLoadingNewUsers] = useState(false);
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
    return (_jsxs("main", { className: "flex flex-1 flex-col gap-4", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [_jsxs(Card, { "x-chunk": "dashboard-01-chunk-0", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Users" }), _jsx(User, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: totalUsers.toLocaleString() }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["+", lastWeekUsersPercentage.toFixed(1), "% from last week"] })] })] }), _jsxs(Card, { "x-chunk": "dashboard-01-chunk-1", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Posts" }), _jsx(Newspaper, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: totalPosts.toLocaleString() }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["+", lastWeekPostsPercentage.toFixed(1), "% from last week"] })] })] }), _jsxs(Card, { "x-chunk": "dashboard-01-chunk-2", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Groups" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: totalGroups.toLocaleString() }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["+", lastWeekGroupsPercentage.toFixed(1), "% from last week"] })] })] }), _jsxs(Card, { "x-chunk": "dashboard-01-chunk-3", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Weekly New Users" }), _jsx(Sparkles, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["+", weeklyNewUsers.toLocaleString()] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["+", lastWeekNewUsersDifferent.toLocaleString(), " since last week"] })] })] })] }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-2 xl:grid-cols-4", children: [_jsxs(Card, { className: "xl:col-span-3", "x-chunk": "dashboard-01-chunk-4", children: [_jsx(CardHeader, { className: "flex flex-row items-center", children: _jsxs("div", { className: "grid gap-2", children: [_jsx(CardTitle, { children: "User's posts" }), _jsx(CardDescription, { children: "Total user's post of last 6 months" })] }) }), _jsx(CardContent, { children: _jsx(Bar, { options: options, data: lastSixMonthsPosts }) })] }), _jsxs(Card, { "x-chunk": "dashboard-01-chunk-5", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "New users" }) }), _jsx(CardContent, { className: "grid", children: newUsers.length === 0 && isLoadingNewUsers && isLoadingNewUsers
                                    ? [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (_jsxs("div", { className: "flex items-center gap-4 px-1 py-3", children: [_jsx(Skeleton, { className: "hidden h-9 w-9 sm:flex rounded-full" }), _jsxs("div", { className: "grid gap-1", children: [_jsx(Skeleton, { className: "h-4 w-32" }), _jsx(Skeleton, { className: "h-4 w-32" })] })] }, index)))
                                    : newUsers.map((user, index) => (_jsxs("div", { className: "flex items-center gap-4 hover:bg-muted px-1 py-3 rounded-md cursor-pointer", onClick: () => navigate(`/user/${user.id}`), children: [_jsxs(Avatar, { className: "hidden h-9 w-9 sm:flex", children: [_jsx(AvatarImage, { src: user.pf_img_url, alt: "Avatar", className: "object-cover" }), _jsx(AvatarFallback, { children: "OM" })] }), _jsxs("div", { className: "grid gap-1", children: [_jsx("p", { className: "text-sm font-medium leading-none", children: user.first_name + " " + user.last_name }), _jsx("p", { className: "text-sm text-muted-foreground", children: user.email })] })] }, index))) })] })] })] }));
};
function getLastFiveMonths() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    let currentMonth = today.getMonth();
    const lastFiveMonths = [];
    for (let i = 0; i < 6; i++) {
        // Handle going back to December from January
        const monthIndex = (currentMonth - i + 12) % 12;
        lastFiveMonths.push(months[monthIndex]);
    }
    return lastFiveMonths.reverse(); // Reverse to get most recent month first
}
export default DashboardOverviewPage;
