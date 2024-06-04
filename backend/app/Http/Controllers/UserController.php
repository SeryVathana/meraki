<?php

namespace App\Http\Controllers;

use App\Models\GroupInvite;
use App\Models\GroupMember;
use App\Models\GroupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Create User
     * @param Request $request
     * @return User 
     */
    public function createUser(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make(
                $request->all(),
                [
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'username' => 'required|unique:users',
                    'email' => 'required|email|unique:users,email',
                    'password' => [
                        'required',
                        'min:8',
                        'regex:/[a-z]/',      // must contain at least one lowercase letter
                        'regex:/[A-Z]/',      // must contain at least one uppercase letter
                        'regex:/[0-9]/',      // must contain at least one digit
                        'regex:/[@$!%*#?&]/', // must contain a special character
                    ],
                    'pf_img_url' => 'nullable',
                    'social_login_info' => 'nullable',
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!$request->pf_img_url) {
                $pfImgUrl = "https://i.pinimg.com/736x/e7/fd/e7/e7fde7197f89cac7846e66ad629287cc.jpg";
            } else {
                $pfImgUrl = $request->pf_img_url;
            }

            if (!$request->social_login_info) {
                $socialLoginInfo = "{}";
            } else {
                $socialLoginInfo = $request->social_login_info;
            }

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => "user",
                'pf_img_url' => $pfImgUrl,
                'social_login_info' => $socialLoginInfo,
                'followers' => "[]",
                'followings' => "[]",
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'User Created Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }
    public function createUserMobile(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make(
                $request->all(),
                [
                    'username' => 'required|unique:users',
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required',
                ]
            );

            if ($validateUser->fails()) {
                print_r('Error' . $validateUser->errors()->first());

                if ($validateUser->errors()->first() == "The username has already been taken.") {
                    return response()->json([
                        "status" => 400,
                        "message" => "Username already taken"
                    ], 403);
                }

                if ($validateUser->errors()->first() == "The email has already been taken.") {
                    return response()->json([
                        "status" => 400,
                        "message" => "Email already taken"
                    ], 404);
                }
                return response()->json([
                    'status' => 401,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!$request->pf_img_url) {
                $pfImgUrl = "https://i.pinimg.com/736x/e7/fd/e7/e7fde7197f89cac7846e66ad629287cc.jpg";
            } else {
                $pfImgUrl = $request->pf_img_url;
            }

            if (!$request->social_login_info) {
                $socialLoginInfo = "{}";
            } else {
                $socialLoginInfo = $request->social_login_info;
            }

            $user = User::create([
                'first_name' => "First Name",
                'last_name' => "Last Name",
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => "user",
                'pf_img_url' => $pfImgUrl,
                'social_login_info' => $socialLoginInfo,
                'followers' => "[]",
                'followings' => "[]",
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'User Created Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email',
                    'password' => 'required'
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Incorrect Email or Password',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            return response()->json([
                'status' => 200,
                'message' => 'User Logged In Successfully',
                'data' => [
                    'token' => $user->createToken("API TOKEN")->plainTextToken,
                    "user" => $user
                ]

            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getUserData(Request $request)
    {
        $user = Auth::user();

        $invites = GroupInvite::where('user_id', $user->id)->get();

        $myGroupsAsAdmin = GroupMember::where('user_id', $user->id)
            ->where('role', 'admin')
            ->get();

        // Check if any group_id matches in GroupRequest
        $groupIds = $myGroupsAsAdmin->pluck('group_id');
        $joinRequests = GroupRequest::whereIn('group_id', $groupIds)->get();

        $data = [
            "id" => $user->id,
            "first_name" => $user->first_name,
            "last_name" => $user->last_name,
            "username" => $user->username,
            "email" => $user->email,
            "role" => $user->role,
            "pf_img_url" => $user->pf_img_url,
            "social_login_info" => $user->social_login_info,
            "followers" => $user->followers,
            "followings" => $user->followings,
            "created_at" => $user->created_at,
            "updated_at" => $user->updated_at,
            "invites" => count($invites),
            "group_req" => count($joinRequests),
            "total_noti" => count($invites) + count($joinRequests),
        ];

        return response()->json([
            'status' => 200,
            'message' => 'User Data',
            // 'data' => $data
            'data' => $data
        ], 200);
    }
    public function getUserDataMobile(Request $request)
    {
        $user = Auth::user();

        return response()->json($user, 200);
    }

    public function getUserDataById(Request $request, $id)
    {

        $loggedInUser = Auth::user();

        $user = User::find($id);

        //get followers length and followings length
        $followers = json_decode($user->followers);
        $follings = json_decode($user->followings);

        $user->followers = count($followers);
        $user->followings = count($follings);

        $isFollowing = false;
        $key = array_search($loggedInUser->id, $followers);
        if ($key !== false) {
            $isFollowing = true;
        }

        $data = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'username' => $user->username,
            'is_following' => $isFollowing,
            'email' => $user->email,
            'role' => $user->role,
            'pf_img_url' => $user->pf_img_url,
            'followers' => $user->followers,
            'followings' => $user->followings,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at
        ];

        return response()->json([
            'status' => 200,
            'message' => 'User Data',
            'user' => $data
        ], 200);
    }

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
        $followers = json_decode($user->followers);

        if (!array_key_exists($loggedInUser->id, $followers)) {
            array_push($followers, $loggedInUser->id);
        }


        $self = User::find($loggedInUser->id);
        $myFollowing = json_decode($self->followings);

        if (!array_key_exists($user->id, $myFollowing)) {
            array_push($myFollowing, $user->id);
        }

        $uArr = array_unique($followers);
        $selfArr = array_unique($myFollowing);

        $self->followings = json_encode($selfArr);
        $user->followers = json_encode($uArr);


        $user->save();
        $self->save();


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

        $user = User::find($id);
        $followers = json_decode($user->followers);



        $key = array_search($loggedInUser->id, $followers);
        if ($key !== false) {
            unset($followers[$key]);
        }

        $user->followers = json_encode($followers);
        $user->save();
        return response()->json([
            'status' => 200,
            'message' => 'User Unfollowed Successfully'
        ], 200);
    }

    public function editProfileMobile(Request $request)
    {
        //only username
        $loggedUser = Auth::user();

        if ($request->username == $loggedUser->username) {
            return response()->json([
                'status' => 200,
                'message' => 'No changes made'
            ], 200);
        }

        //Validated
        $validateUser = Validator::make(
            $request->all(),
            [
                'username' => 'required|unique:users',
            ]
        );

        if ($validateUser->fails()) {
            print_r('Error' . $validateUser->errors()->first());

            if ($validateUser->errors()->first() == "The username has already been taken.") {
                return response()->json([
                    "status" => 400,
                    "message" => "Username already taken"
                ], 403);
            }
            return response()->json([
                'status' => 401,
                'message' => 'validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }

        $user = User::find($loggedUser->id);

        $user->username = $request->username;

        $user->save();
        return response()->json([
            'status' => 200,
            'message' => 'Profile Updated Successfully',
            'data' => $user
        ], 200);
    }
    public function editProfile(Request $request)
    {
        //only username
        $loggedUser = Auth::user();

        if ($request->username == $loggedUser->username && $request->first_name == $loggedUser->first_name && $request->last_name == $loggedUser->last_name) {
            return response()->json([
                'status' => 200,
                'message' => 'No changes made'
            ], 200);
        }

        //Validated
        if ($request->username != $loggedUser->username) {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'username' => 'required|unique:users',
                ]
            );
        } else {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'first_name' => 'required',
                    'last_name' => 'required',
                ]
            );
        }

        if ($validateUser->fails()) {
            print_r('Error' . $validateUser->errors()->first());

            if ($validateUser->errors()->first() == "The username has already been taken.") {
                return response()->json([
                    "status" => 400,
                    "message" => "Username already taken"
                ], 403);
            }
            return response()->json([
                'status' => 401,
                'message' => 'validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }

        $user = User::find($loggedUser->id);

        $user->username = $request->username;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;

        $user->save();
        return response()->json([
            'status' => 200,
            'message' => 'Profile Updated Successfully',
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 200,
            'message' => 'User Logged Out Successfully'
        ], 200);
    }

    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'status' => 200,
            'message' => 'User Logged Out From All Devices Successfully'
        ], 200);
    }

    public function updateUserPassword(Request $request)
    {
        $loggedUser = Auth::user();


        $validateUser = Validator::make(
            $request->all(),
            [
                'old_password' => 'required',
                'new_password' => [
                    'required',
                    'min:8',
                    'regex:/[a-z]/',      // must contain at least one lowercase letter
                    'regex:/[A-Z]/',      // must contain at least one uppercase letter
                    'regex:/[0-9]/',      // must contain at least one digit
                    'regex:/[@$!%*#?&]/', // must contain a special character
                ]
            ]
        );

        if ($validateUser->fails()) {
            return response()->json([
                'status' => 401,
                'message' => 'validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }

        if (!Hash::check($request->old_password, $loggedUser->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'Incorrect Old Password',
            ], 401);
        }

        //check if new password is same as old password
        if (Hash::check($request->new_password, $loggedUser->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'New Password can not be same as Old Password',
            ], 401);
        }

        $loggedUser->password = Hash::make($request->new_password);
        $loggedUser->save();

        return response()->json([
            'status' => 200,
            'message' => 'Password Updated Successfully',
        ], 200);
    }


    public function updateUserPfImg(Request $request)
    {
        $loggedUser = Auth::user();

        $validateUser = Validator::make(
            $request->all(),
            [
                'pf_img_url' => 'required',
            ]
        );

        if ($validateUser->fails()) {
            return response()->json([
                'status' => 401,
                'message' => 'validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }

        $loggedUser->pf_img_url = $request->pf_img_url;
        $loggedUser->save();

        return response()->json([
            'status' => 200,
            'message' => 'Profile Image Updated Successfully',
        ], 200);
    }

    public function getUserFollowers(Request $request, $id)
    {
        $searchQuery = $request->query('q');
        $loggedInUser = Auth::user();
        $user = User::find($id);

        $followers = json_decode($user->followers);

        $data = [];

        foreach ($followers as $follower) {
            $f = "";
            if ($searchQuery != "") {
                $f = User::find($follower)->where("id", $follower)->where(function ($query) use ($searchQuery) {
                    $query->where('first_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('email', 'like', '%' . $searchQuery . '%')
                        ->orWhere('username', 'like', '%' . $searchQuery . '%');
                })->first();
            } else {
                $f = User::find($follower);
            }
            if (!$f) {
                continue;
            }

            $isFollowing = false;

            $followers = json_decode($f->followers);
            if (in_array($loggedInUser->id, $followers)) {
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

        $followings = json_decode($user->followings);

        $data = [];


        foreach ($followings as $following) {
            $f = "";
            if ($searchQuery != "") {
                $f = User::find($following)->where("id", $following)->where(function ($query) use ($searchQuery) {
                    $query->where('first_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                        ->orWhere('email', 'like', '%' . $searchQuery . '%')
                        ->orWhere('username', 'like', '%' . $searchQuery . '%');
                })->first();
            } else {
                $f = User::find($following);
            }
            if (!$f) {
                continue;
            }
            $isFollowing = false;

            $followers = json_decode($f->followers);
            if (in_array($loggedInUser->id, $followers)) {
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