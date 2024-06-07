<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserFollower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserFollowerController extends Controller
{
    public function followUser($id)
    {
        $loggedInUser = Auth::user();

        if ($loggedInUser->id == $id) {
            return response()->json([
                'status' => 401,
                'message' => 'You can not follow yourself'
            ], 401);
        }


        $user = User::find($id);
        $follower = UserFollower::where('user_id', $user->id)->where('follower_id', $loggedInUser->id)->first();

        if ($follower) {
            return response()->json([
                'status' => 401,
                'message' => 'You are already following this user'
            ], 401);
        }

        $newFollow = new UserFollower;
        $newFollow->user_id = $id;
        $newFollow->follower_id = $loggedInUser->id;
        $newFollow->save();


        return response()->json([
            'status' => 200,
            'message' => 'User Followed Successfully',
        ], 200);
    }

    public function unfollowUser($id)
    {
        $loggedInUser = Auth::user();

        if ($loggedInUser->id == $id) {
            return response()->json([
                'status' => 401,
                'message' => 'You can not unfollow yourself'
            ], 401);
        }

        $follower = UserFollower::where('user_id', $id)->where('follower_id', $loggedInUser->id)->first();
        if ($follower) {
            $follower->delete();
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'You are not following this user'
            ], 401);
        }

        return response()->json([
            'status' => 200,
            'message' => 'User Unfollowed Successfully'
        ], 200);
    }

    public function getUserFollowers(Request $request, $id)
    {
        $searchQuery = $request->query('q');
        $loggedInUser = Auth::user();
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }

        $followers = UserFollower::where('user_id', '=', $id)->get()->pluck('follower_id')->toArray();

        $data = [];

        foreach ($followers as $follower) {
            $f = "";
            if ($searchQuery != "") {
                $f = User::find($follower)->where("id", $follower)->where(function ($query) use ($searchQuery) {
                    $query->where('first_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('email', 'like', '%' . $searchQuery . '%');
                })->first();
            } else {
                $f = User::find($follower);
            }
            if (!$f) {
                continue;
            }

            $isFollowing = false;

            $following = UserFollower::where('user_id', '=', $follower)->where("follower_id", $loggedInUser->id)->first();
            if ($following) {
                $isFollowing = true;
            }

            $userData = [
                'id' => $f->id,
                'first_name' => $f->first_name,
                'last_name' => $f->last_name,
                'email' => $f->email,
                'pf_img_url' => $f->pf_img_url,
                'is_following' => $isFollowing,
            ];
            array_push($data, $userData);
        }

        return response()->json([
            'status' => 200,
            'message' => 'User Followers',
            'data' => $data
        ], 200);
    }


    public function getUserFollowings(Request $request, $id)
    {
        $searchQuery = $request->query('q');
        $loggedInUser = Auth::user();
        $user = User::find($id);

        $followings = UserFollower::where('follower_id', $id)->get()->pluck('user_id')->toArray();

        $data = [];

        foreach ($followings as $following) {
            $f = "";
            if ($searchQuery != "") {
                $f = User::find($following)->where("id", $following)->where(function ($query) use ($searchQuery) {
                    $query->where('first_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('email', 'like', '%' . $searchQuery . '%');
                })->first();
            } else {
                $f = User::find($following);
            }
            if (!$f) {
                continue;
            }

            $isFollowing = false;
            $followed = UserFollower::where('user_id', '=', $following)->where("follower_id", $loggedInUser->id)->first();
            if ($followed) {
                $isFollowing = true;
            }


            $userData = [
                'id' => $f->id,
                'first_name' => $f->first_name,
                'last_name' => $f->last_name,
                'email' => $f->email,
                'pf_img_url' => $f->pf_img_url,
                'is_following' => $isFollowing,
            ];
            array_push($data, $userData);
        }

        return response()->json([
            'status' => 200,
            'message' => 'User Followings',
            'data' => $data
        ], 200);
    }
}
