<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Post;
use App\Models\SavedPost;
use App\Http\Requests\StoreSavedPostRequest;
use App\Http\Requests\UpdateSavedPostRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SavedPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function getSavedPosts($id)
    {
        $user = Auth::user();

        $folder = Folder::where("user_id", $user->id)->where("id", $id)->first();
        if (!$folder) {
            $data = [
                "status" => 400,
                "message" => "Folder not found"
            ];
            return response()->json($data, 400);
        }

        $post = SavedPost::where("folder_id", $id)->where("user_id", $user->id)->get();
        $allSavedPosts = [];

        for ($i = 0; $i < count($post); $i++) {

            $postDetail = Post::where("id", $post[$i]->post_id)->first();
            if (!$postDetail) {
                continue;
            }

            $postOwner = User::where("id", $postDetail->user_id)->first();
            if (!$postOwner) {
                continue;
            }

            $detail = [
                "id" => $postDetail->id,
                "img_url" => $postDetail->img_url,
                "user_id" => $postDetail->user_id,
                "is_saved" => true,
                "user_name" => $postOwner->first_name . " " . $postOwner->last_name,
                "user_pf_img_url" => $postOwner->pf_img_url,
                "created_at" => $postDetail->created_at,
                "updated_at" => $postDetail->updated_at,
            ];


            array_push($allSavedPosts, $detail);
        }

        $data = [
            "status" => 200,
            "message" => "All saved posts",
            "posts" => $allSavedPosts
        ];

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSavedPostRequest $request)
    {

        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'post_id' => 'required',
            'folder_id' => 'required',
        ]);

        if ($validator->fails()) {
            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];
            return response()->json($data, 400);
        }

        $post = Post::where("user_id", $userId)->where("id", $request->post_id)->first();
        if (!$post) {
            $data = [
                "status" => 400,
                "message" => "Post not found"
            ];
            return response()->json($data, 400);
        }


        for ($i = 0; $i < count($request->folder_id); $i++) {
            $existedSavedPost = SavedPost::where("user_id", $userId)->where("post_id", $request->post_id)->where("folder_id", $request->folder_id[$i])->first();

            if ($existedSavedPost) {
                // remove the saved post
                $existedSavedPost->delete();


            } else {
                $folder = Folder::where("user_id", $userId)->where("id", $request->folder_id[$i])->first();
                if (!$folder) {
                    continue;
                }

                $savedPost = new SavedPost;
                $savedPost->user_id = $userId;
                $savedPost->folder_id = $folder->id;
                $savedPost->post_id = $request->post_id;
                $savedPost->save();
            }
        }

        $data = [
            "status" => 200,
            "message" => "Post saved successfully"
        ];
        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(SavedPost $savedPost)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SavedPost $savedPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSavedPostRequest $request, SavedPost $savedPost)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SavedPost $savedPost)
    {
        //
    }
}
