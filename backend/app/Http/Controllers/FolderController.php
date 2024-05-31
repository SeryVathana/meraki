<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Models\Post;
use App\Models\SavedPost;
use Illuminate\Support\Facades\Auth;
use Validator;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        $folders = Folder::where("user_id", $userId)->get();

        $data = [];
        for ($i = 0; $i < count($folders); $i++) {
            $savedPosts = SavedPost::where("user_id", $userId)->where("folder_id", $folders[$i]->id)->limit(3)->get();

            $allSavedPosts = [];
            for ($j = 0; $j < count($savedPosts); $j++) {

                $post = Post::where("id", $savedPosts[$j]->post_id)->first();
                if (!$post) {
                    continue;
                }

                $savePost = [
                    "id" => $post->id,
                    "img_url" => $post->img_url,
                ];

                array_push($allSavedPosts, $savePost);
            }
            $folder = [
                "id" => $folders[$i]->id,
                "title" => $folders[$i]->title,
                "saved_posts" => $allSavedPosts,
                "created_at" => $folders[$i]->created_at,
                "updated_at" => $folders[$i]->updated_at
            ];

            array_push($data, $folder);
        }

        $result = [
            "status" => 200,
            "folders" => $data,
        ];

        return response()->json($result, 200);
    }
    public function getFoldersByPostId($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $post = Post::where("id", $id)->first();
        if (!$post) {
            $data = [
                "status" => 404,
                "message" => "Post not found"
            ];
            return response()->json($data, 404);
        }

        $folders = Folder::where("user_id", $userId)->get();

        $data = [];
        for ($i = 0; $i < count($folders); $i++) {


            $isSaved = false;

            $savedPost = SavedPost::where("user_id", $userId)->where("folder_id", $folders[$i]->id)->where("post_id", $id)->first();
            if (!$savedPost) {
                $isSaved = false;
            } else {
                $isSaved = true;
            }

            $folder = [
                "id" => $folders[$i]->id,
                "title" => $folders[$i]->title,
                "is_saved" => $isSaved,
                "created_at" => $folders[$i]->created_at,
                "updated_at" => $folders[$i]->updated_at
            ];

            array_push($data, $folder);
        }

        $result = [
            "status" => 200,
            "folders" => $data,
        ];

        return response()->json($result, 200);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolderRequest $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'nullable|max:255',
            'status' => 'required',
        ]);

        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);

        }

        if ($request->status != "public" && $request->status != "private") {
            $data = [
                "status" => 400,
                "message" => "Invalid input"
            ];

            return response()->json($data, 400);
        }

        $folder = new Folder;
        $folder->user_id = $userId;
        $folder->title = $request->title;
        $folder->description = $request->description;
        $folder->status = $request->status;
        $folder->save();

        $data = [
            "status" => 200,
            "message" => "Folder created successfully",
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();

        $folder = Folder::where("id", "=", $id)->where("user_id", $user->id)->first();
        if (!$folder) {
            $data = [
                "status" => 404,
                "message" => "Folder not found"
            ];
            return response()->json($data, 404);
        }

        $data = [
            "status" => 200,
            "folder" => $folder
        ];

        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'nullable|max:255',
            'status' => 'required',
        ]);

        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);

        }

        $folder = Folder::find($id);
        if (!$folder) {
            $data = [
                "status" => 404,
                "message" => "Folder not found"
            ];
            return response()->json($data, 404);
        }

        if ($folder->user_id != $userId) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        if ($request->status != "public" && $request->status != "private") {
            $data = [
                "status" => 400,
                "message" => "Invalid input"
            ];

            return response()->json($data, 400);
        }

        $folder->title = $request->title;
        $folder->description = $request->description;
        $folder->status = $request->status;
        $folder->save();
        $data = [
            "status" => 200,
            "message" => "Folder updated successfully"
        ];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $folder = Folder::find($id);
        if (!$folder) {
            $data = [
                "status" => 404,
                "message" => "Folder not found"
            ];
            return response()->json($data, 404);
        }

        if ($folder->user_id != $userId) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        $folder->delete();

        SavedPost::where("user_id", $userId)->where("folder_id", $id)->delete();

        $data = [
            "status" => 200,
            "message" => "Folder deleted successfully"
        ];
        return response()->json($data, 200);
    }
}
