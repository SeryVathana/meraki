<?php

namespace App\Http\Controllers;

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
                    'password' => 'required',
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

        print_r($user->id);

        return response()->json([
            'status' => 200,
            'message' => 'User Data',
            'data' => $user
        ], 200);
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


        $uArr = array_unique($followers);


        $user->followers = json_encode($uArr);

        $user->save();



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

}