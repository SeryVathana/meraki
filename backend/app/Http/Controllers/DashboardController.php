<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupMember;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getTotalUsers(Request $request)
    {
        $totalUsers = User::count();

        //get last weeks users count
        $lastWeekUsers = User::where('created_at', '>=', now()->subWeek())->count();
        $lastWeekUserPercentage = $lastWeekUsers / $totalUsers * 100;
        $data = [
            "status" => 200,
            "message" => "Total users fetched successfully",
            "data" => [
                "total_users" => $totalUsers,
                "last_week_percent" => $lastWeekUserPercentage
            ]
        ];

        return response()->json($data, 200);
    }

    public function getTotalPosts(Request $request)
    {
        $totalPosts = Post::count();

        //get last weeks posts count
        $lastWeekPosts = Post::where('created_at', '>=', now()->subWeek())->count();
        $lastWeekPostPercentage = $lastWeekPosts / $totalPosts * 100;
        $data = [
            "status" => 200,
            "message" => "Total posts fetched successfully",
            "data" => [
                "total_posts" => $totalPosts,
                "last_week_percent" => $lastWeekPostPercentage
            ]
        ];

        return response()->json($data, 200);
    }

    public function getTotalGroups(Request $request)
    {
        $totalGroups = Group::count();

        //get last weeks groups count
        $lastWeekGroups = Group::where('created_at', '>=', now()->subWeek())->count();
        $lastWeekGroupPercentage = $lastWeekGroups / $totalGroups * 100;
        $data = [
            "status" => 200,
            "message" => "Total groups fetched successfully",
            "data" => [
                "total_groups" => $totalGroups,
                "last_week_percent" => $lastWeekGroupPercentage
            ]
        ];

        return response()->json($data, 200);
    }

    public function getWeeklyNewUsers(Request $request)
    {
        // Calculate the start and end dates for the last week
        $endDateLastWeek = now();
        $startDateLastWeek = now()->subWeek();

        // Calculate the start and end dates for the previous week
        $endDatePreviousWeek = $startDateLastWeek;
        $startDatePreviousWeek = $startDateLastWeek->subWeek();

        // Get the count of new users for the last week
        $newUsersLastWeek = User::whereBetween('created_at', [$startDateLastWeek, $endDateLastWeek])->count();

        // Get the count of new users for the previous week
        $newUsersPreviousWeek = User::whereBetween('created_at', [$startDatePreviousWeek, $endDatePreviousWeek])->count();

        // Calculate the difference
        $difference = $newUsersLastWeek - $newUsersPreviousWeek;

        // Prepare the response data
        $data = [
            "status" => 200,
            "message" => "Weekly new users fetched successfully",
            "data" => [
                "weekly_new_users" => $newUsersLastWeek,
                "difference" => $difference
            ]
        ];

        // Return the JSON response
        return response()->json($data, 200);
    }

    public function get10NewUsers(Request $request)
    {
        // Get the 10 newest users
        $newUsers = User::select(["id", "first_name", "last_name", "email", "pf_img_url"])->orderBy('created_at', 'desc')->take(10)->get();

        // Prepare the response data
        $data = [
            "status" => 200,
            "message" => "10 newest users fetched successfully",
            "data" => $newUsers
        ];

        // Return the JSON response
        return response()->json($data, 200);
    }

    public function getTotalPostsOfLastSixMonths(Request $request)
    {
        // Generate the last six months' periods
        $months = collect();
        for ($i = 0; $i < 6; $i++) {
            $months->push(now()->subMonths($i)->startOfMonth()->format('Y-m'));
        }
        $months = $months->reverse();

        // Get the total number of posts for each month in the last six months
        $postCounts = Post::selectRaw('DATE_TRUNC(\'month\', created_at) AS month, COUNT(*) AS count')
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [\Carbon\Carbon::parse($item->month)->format('Y-m') => $item->count];
            });

        // Prepare the data with 0 for months with no posts
        $data = $months->map(function ($month) use ($postCounts) {
            return $postCounts->get($month, 0);
        })->values()->toArray();

        // Prepare the response data
        $response = [
            "status" => 200,
            "message" => "Total posts of last six months fetched successfully",
            "data" => $data
        ];

        // Return the JSON response
        return response()->json($response, 200);
    }


    public function getAllUsers(Request $request)
    {
        $searchQuery = $request->query("q");
        // Check if the authenticated user is an admin
        $loggedUser = Auth::user();
        if ($loggedUser->role !== 'admin') {
            return response()->json([
                'status' => 403,
                'message' => 'Forbidden: You do not have permission to access this resource.'
            ], 403);
        }


        // Build the query to search users
        $usersQuery = User::select(["id", "first_name", "last_name", "email", "pf_img_url", "created_at"])
            ->where("role", "!=", "admin")
            ->orderByDesc("created_at");

        if ($searchQuery) {
            $usersQuery->where(function ($query) use ($searchQuery) {
                $query->where('first_name', 'like', "%{$searchQuery}%")
                    ->orWhere('last_name', 'like', "%{$searchQuery}%")
                    ->orWhere('email', 'like', "%{$searchQuery}%");
            });
        }

        // Execute the query and get the users
        $users = $usersQuery->get();


        foreach ($users as $user) {
            $posts = Post::where("user_id", $user->id)->count();
            $groupOwn = Group::where("owner_id", $user->id)->count();
            $groupMember = GroupMember::where("user_id", $user->id)->count();
            $user->posts = $posts;
            $user->group_own = $groupOwn;
            $user->group_member = $groupMember;
        }

        return response()->json([
            'status' => 200,
            'message' => 'Users Retrieved Successfully',
            'data' => $users
        ], 200);
    }

    public function getAllAdmins(Request $request)
    {
        $searchQuery = $request->query('q');
        $loggedUser = Auth::user();
        if ($loggedUser->role !== 'admin') {
            return response()->json([
                'status' => 200,
                'message' => 'Forbidden: You do not have permission to access this resource.'
            ], 200);
        }

        $users = User::select(['id', 'first_name', 'last_name', 'email', 'pf_img_url', 'created_at'])
            ->where('role', '=', 'admin')
            ->where(function ($query) use ($searchQuery) {
                $query->where('first_name', 'ilike', '%' . $searchQuery . '%')
                    ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('email', 'like', '%' . $searchQuery . '%');
            })
            ->orderByDesc('created_at')->get();

        return response()->json([
            'status' => 200,
            'message' => 'Admins Retrieved Successfully',
            'data' => $users
        ], 200);
    }

}


