<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StorePostRequest;
use Illuminate\Support\Facades\Gate;
use Validator;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{

    /**
     * Display a listing of the resource.
     */

    public function index()
    {

        $posts = Post::where("status", "public")->get();

        $result = [];
        for ($i = 0; $i < count($posts); $i++) {
            $tags = json_decode($posts[$i]->tag);

            $tagDetails = [];

            for ($j = 0; $j < count($tags); $j++) {
                $tag = Tag::find($tags[$j]);
                if ($tag) {
                    array_push($tagDetails, ["name" => $tag->name, "id" => $tag->id]);
                }
            }
            $user = User::find($posts[$i]->user_id);

            $post = [
                "id" => $posts[$i]->id,
                "user_id" => $posts[$i]->user_id,
                "group_id" => $posts[$i]->group_id,
                "tags" => $tagDetails,
                "title" => $posts[$i]->title,
                "description" => $posts[$i]->description,
                "img_url" => $posts[$i]->img_url,
                "status" => $posts[$i]->status,
                "likes" => count(json_decode($posts[$i]->likes)),
                "user_name" => $user->first_name . " " . $user->last_name,
                "user_pf_img_url" => $user->pf_img_url,
                "created_at" => $posts[$i]->created_at,
                "updated_at" => $posts[$i]->updated_at
            ];



            array_push($result, $post);
        }

        $data = [
            'status' => 200,
            'posts' => $result,
        ];

        return response()->json($data, 200);

    }
    public function getHighlightedPosts()
    {
        $highlightedPost = Post::where('is_highlighted', true)->first();

        return response()->json([
            'highlighted_post' => $highlightedPost,
        ]);
    }

    public function getLatestPosts()
    {
        $latestPost = Post::orderBy('created_at', 'desc')->first();

        return response()->json([
            'latest_post' => $latestPost,
        ]);
    }

    public function getMyPosts()
    {
        $user = Auth::user();
        $userId = $user->id;

        $post = Post::where("user_id", $userId)->get();
        $data = [
            'status' => 200,
            'posts' => $post
        ];

        return response()->json($data, 200);
    }
    public function getUserPosts($id)
    {
        $curUser = Auth::user();
        $curUserId = $curUser->id;

        $user = User::find($id);
        if (!$user) {
            $data = [
                "status" => 404,
                "message" => "User not found",
            ];

            return response()->json($data, 404);
        }
        $posts = "";

        if ($curUser->role == "admin") {
            $posts = Post::where("user_id", $id)->get();
        } else {
            $post = Post::where("user_id", $id)->where("status", "public")->get();
        }

        $result = [];
        for ($i = 0; $i < count($posts); $i++) {
            $tags = json_decode($posts[$i]->tag);

            $tagDetails = [];

            for ($j = 0; $j < count($tags); $j++) {
                $tag = Tag::find($tags[$j]);
                if ($tag) {
                    array_push($tagDetails, ["name" => $tag->name, "id" => $tag->id]);
                }
            }
            $user = User::find($posts[$i]->user_id);

            $post = [
                "id" => $posts[$i]->id,
                "user_id" => $posts[$i]->user_id,
                "group_id" => $posts[$i]->group_id,
                "tags" => $tagDetails,
                "title" => $posts[$i]->title,
                "description" => $posts[$i]->description,
                "img_url" => $posts[$i]->img_url,
                "status" => $posts[$i]->status,
                "likes" => count(json_decode($posts[$i]->likes)),
                "user_name" => $user->first_name . " " . $user->last_name,
                "user_pf_img_url" => $user->pf_img_url,
                "created_at" => $posts[$i]->created_at,
                "updated_at" => $posts[$i]->updated_at
            ];



            array_push($result, $post);
        }


        $data = [
            'status' => 200,
            'posts' => $result
        ];

        return response()->json($data, 200);
    }

    public function getGroupPosts($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $authorized = true;

        $group = Group::find($id);
        if (!$group) {

            $data = [
                "status" => 404,
                "message" => "Group not found"
            ];

            return response()->json($data, 404);
        }

        $isGroupMember = GroupMember::where("group_id", $id)->where("user_id", $userId)->first();

        if ($group->status == "private" && $user->role != 'admin' && !$isGroupMember) {
            $authorized = false;
        }

        $posts = [];
        if ($authorized) {
            $posts = Post::where("group_id", $id)->get();
            $result = [];
            for ($i = 0; $i < count($posts); $i++) {
                $tags = json_decode($posts[$i]->tag);

                $tagDetails = [];

                for ($j = 0; $j < count($tags); $j++) {
                    $tag = Tag::find($tags[$j]);
                    if ($tag) {
                        array_push($tagDetails, ["name" => $tag->name, "id" => $tag->id]);
                    }
                }
                $user = User::find($posts[$i]->user_id);

                $post = [
                    "id" => $posts[$i]->id,
                    "user_id" => $posts[$i]->user_id,
                    "group_id" => $posts[$i]->group_id,
                    "tags" => $tagDetails,
                    "title" => $posts[$i]->title,
                    "description" => $posts[$i]->description,
                    "img_url" => $posts[$i]->img_url,
                    "status" => $posts[$i]->status,
                    "likes" => count(json_decode($posts[$i]->likes)),
                    "user_name" => $user->first_name . " " . $user->last_name,
                    "user_pf_img_url" => $user->pf_img_url,
                    "created_at" => $posts[$i]->created_at,
                    "updated_at" => $posts[$i]->updated_at
                ];



                array_push($result, $post);
            }

            $data = [
                "status" => 200,
                "posts" => $result,
            ];

            return response()->json($data, 200);
        } else {
            $data = [
                "status" => 403,
                "message" => "Unathorized",
            ];

            return response()->json($data, 403);
        }
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
    public function store(StorePostRequest $request)
    {

        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'group_id' => 'nullable',
            'title' => 'nullable|max:255',
            'description' => 'nullable|max:1000',
            'img_url' => 'nullable',
            'status' => 'required',
            'tag' => 'nullable|string|max:255',
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

            return response()->json($data, 404);
        }

        $post = new Post;

        if ($request->group_id != null) {
            $group1 = Group::find($request->group_id);
            if (!$group1) {
                $data = [
                    "status" => 404,
                    "message" => "Group not found"
                ];
                return response()->json($data, 402);
            }

            $post->status = $group1->status;
        } else {
            $post->status = $request->status;
        }

        $goodTags = [];

        $tags = json_decode($request->tag);
        for ($i = 0; $i < count($tags); $i++) {
            $tag = Tag::find($tags[$i]);
            if ($tag) {
                array_push($goodTags, $tag->id);
            }
        }

        $post->group_id = $request->group_id;
        $post->user_id = $userId;
        $post->title = $request->title;
        $post->description = $request->description;
        $post->likes = '[]';
        $post->img_url = $request->img_url;
        $post->tag = json_encode($goodTags);
        $post->save();

        $data = [
            "status" => 201,
            "message" => "Post created successfully",
        ];

        return response()->json($data, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show($id, Post $post)
    {
        $user = Auth::user();
        $userId = $user->id;

        $post = Post::find($id);

        if (!$post) {
            $data = [
                "status" => 404,
                "message" => "Post not found",
            ];
            return response()->json($data, 200);
        }

        if ($post->status == "private" && $post->user_id != $userId && $user->role != "admin") {
            $data = [
                "status" => 401,
                "message" => "Unauthorized",
            ];

            return response()->json($data, 403);
        }

        $postOwner = User::find($post->user_id);

        $likes = json_decode($post->likes);

        $isLiked = false;

        if (in_array($user->id, $likes)) {
            $isLiked = true;
        }

        //get group info if there is a group_id
        if ($post->group_id != null) {
            $group = Group::find($post->group_id);
            $post->group_title = $group->title;
        }




        $tags = json_decode($post->tag);

        $tagDetails = [];

        for ($j = 0; $j < count($tags); $j++) {
            $tag = Tag::find($tags[$j]);
            if ($tag) {
                array_push($tagDetails, ["name" => $tag->name, "id" => $tag->id]);
            }
        }
        $user = User::find($post->user_id);

        $postData = [
            "id" => $post->id,
            "user_id" => $post->user_id,
            "group_id" => $post->group_id,
            "tags" => $tagDetails,
            "title" => $post->title,
            "description" => $post->description,
            "img_url" => $post->img_url,
            "status" => $post->status,
            "likes" => $likes,
            "like_count" => count($likes),
            "is_liked" => $isLiked,
            "user_name" => $postOwner->first_name . " " . $postOwner->last_name,
            "user_pf_img_url" => $postOwner->pf_img_url,
            "created_at" => $post->created_at,
            "updated_at" => $post->updated_at
        ];

        $data = [
            "status" => 200,
            "post" => $postData,
        ];

        return response()->json($data, 200);

    }
    public function related($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $post = Post::find($id);

        if (!$post) {
            $data = [
                "status" => 404,
                "message" => "Post not found",
            ];
            return response()->json($data, 200);
        }
        if ($post->status == "private" && $post->user_id != $userId && $user->role != "admin") {
            $data = [
                "status" => 401,
                "message" => "Unauthorized",
            ];

            return response()->json($data, 403);
        }

        $relatedPosts = Post::where('tag', $post->tag)
            ->where('id', '!=', $post->id)
            ->get();

        $data = [
            "post" => $post,
            "relatedPosts" => $relatedPosts,
        ];

        return response()->json($data, 200);
    }

    public function likePost($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $post = Post::find($id);
        if (!$post) {
            $data = [
                "status" => 404,
                "message" => "Post not found",
            ];
            return response()->json($data, 404);
        }

        if ($post->status == "private" && $post->user_id != $userId && $user->role != "admin") {
            $data = [
                "status" => 401,
                "message" => "Unauthorized",
            ];

            return response()->json($data, 403);
        }

        $likes = json_decode($post->likes);

        if (in_array($userId, $likes)) {
            $key = array_search($userId, $likes);
            array_splice($likes, $key, 1);
        } else {
            array_push($likes, $userId);
        }

        $uArr = array_unique($likes);


        $post->likes = json_encode($uArr);
        $post->save();

        $data = [
            "status" => 200,
            "message" => "Post updated successfully",
        ];
        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post, )
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $post = Post::find($id);

        if (!$post) {
            $data = [
                "status" => 404,
                "message" => "Post not found",
            ];

            return response()->json($data, 404);
        }

        if (!Gate::allows('update', $post)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'nullable|max:255',
            'img_url' => 'required',
            'status' => 'required',
            'tags' => 'required|array'
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


        $post->title = $request->get('title');
        $post->description = $request->get('description');
        $post->img_url = $request->get('img_url');
        $post->status = $request->get('status');
        $tags = Tag::find($request->tags);
        $post->tags()->sync($tags);

        $post->save();
        $tags->save();

        $data = [
            "status" => 200,
            "message" => "Post updated successfully",
            "tags" => $tags,
        ];

        return response()->json($data, $post->load('tags'));

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $post = Post::find($id);

        if (!$post) {
            $data = [
                "status" => 404,
                "message" => "Post not found",
            ];

            return response()->json($data, 404);
        }

        $authorized = false;

        if ($user->role != "admin") {
            if ($post->group_id != null) {
                $group = Group::find($post->group_id);
                if (!$group && $post->user_id != $userId) {
                    $authorized = false;
                }

                $member = GroupMember::where("group_id", $group->id)->where("user_id", $userId)->where("role", "admin")->first();
                if ($member) {
                    $authorized = true;
                }
            }
        }

        if ($post->status != "private" && $post->user_id == $userId && $user->role == "admin") {
            $authorized = true;
        }

        if (!$authorized) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized",
            ];

            return response()->json($data, 403);
        }


        $post->delete();

        $data = [
            "status" => 200,
            "message" => "Post deleted successfully",
        ];

        return response()->json($data, 200);

    }

    //Post CRUD By Admin
    //Get ALL Post
    public function adminIndex()
    {
        $comments = Post::all();
        return response()->json($comments);
    }

    //Get Post By Id
    public function adminShow($id)
    {
        $comment = Post::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        return response()->json($comment);
    }

    //Delete Post
    public function adminDestroy($id)
    {
        $comment = Post::find($id);
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
