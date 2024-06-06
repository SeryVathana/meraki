<?php

namespace App\Http\Controllers;

use App\Models\PostLike;
use App\Models\PostTag;
use App\Models\SavedPost;
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

    public function index(Request $request)
    {

        $loggedUser = Auth::user();
        $qTag = $request->tag;

        $posts = [];
        $tag = Tag::where('name', "ILIKE", $qTag)->first();


        if ($tag) {
            $postTags = PostTag::where("tag_id", $tag->id)->get();
            foreach ($postTags as $postTag) {
                $post = Post::where("status", "public")->find($postTag->post_id);
                if ($post) {
                    array_push($posts, $post);
                }
            }
        } else {
            $posts = Post::where("status", "public")->orderByDesc("created_at")->get();
        }

        $result = [];
        for ($i = 0; $i < count($posts); $i++) {
            $user = User::find($posts[$i]->user_id);

            $isSaved = false;
            $savePost = SavedPost::where("user_id", $loggedUser->id)->where("post_id", $posts[$i]->id)->first();
            if ($savePost) {
                $isSaved = true;
            } else {
                $isSaved = false;
            }

            $post = [
                "id" => $posts[$i]->id,
                "user_id" => $posts[$i]->user_id,
                "img_url" => $posts[$i]->img_url,
                "is_saved" => $isSaved,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "full_name" => $user->first_name . " " . $user->last_name,
                "username" => $user->username,
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
    public function getAllPosts(Request $request)
    {
        $posts = Post::where("status", "public")->orderByDesc("created_at")->get();

        $result = [];
        for ($i = 0; $i < count($posts); $i++) {
            $post = [
                "id" => $posts[$i]->id,
                "user_id" => $posts[$i]->user_id,
                "title" => $posts[$i]->title,
                "description" => $posts[$i]->description,
                "img_url" => $posts[$i]->img_url,
                "user_name" => "vathana",
                "user_pf_img_url" => "https://i.pinimg.com/564x/44/06/42/440642d919661e04315f376b6e59eba0.jpg",
                "created_at" => $posts[$i]->created_at,
                "updated_at" => $posts[$i]->updated_at
            ];



            array_push($result, $post);
        }



        return response()->json($result, 200);

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

        $posts = Post::where("user_id", $userId)->get();


        $postDetails = [];

        for ($i = 0; $i < count($posts); $i++) {

            $isSaved = false;
            $savePost = SavedPost::where("user_id", $userId)->where("post_id", $posts[$i]->id)->first();
            if ($savePost) {
                $isSaved = true;
            } else {
                $isSaved = false;
            }

            $detail = [
                "id" => $posts[$i]->id,
                "img_url" => $posts[$i]->img_url,
                "is_saved" => $isSaved,
                "user_id" => $posts[$i]->user_id,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "full_name" => $user->first_name . " " . $user->last_name,
                "username" => $user->username,
                "user_pf_img_url" => $user->pf_img_url,
                "created_at" => $posts[$i]->created_at,
                "updated_at" => $posts[$i]->updated_at
            ];

            array_push($postDetails, $detail);
        }

        $data = [
            'status' => 200,
            'posts' => $postDetails
        ];

        return response()->json($data, 200);
    }
    public function getMyPostsMobile()
    {
        $user = Auth::user();
        $userId = $user->id;

        $posts = Post::where("user_id", $userId)->orderByDesc("created_at")->get();


        $postDetails = [];

        for ($i = 0; $i < count($posts); $i++) {

            $detail = [
                "id" => $posts[$i]->id,
                "title" => $posts[$i]->title,
                "description" => $posts[$i]->description,
                "img_url" => $posts[$i]->img_url,
                "user_id" => $posts[$i]->user_id,
                "user_name" => $user->first_name . " " . $user->last_name,
                "user_pf_img_url" => $user->pf_img_url,
                "created_at" => $posts[$i]->created_at,
                "updated_at" => $posts[$i]->updated_at
            ];

            array_push($postDetails, $detail);
        }


        return response()->json($postDetails, 200);
    }
    public function getUserPosts($id)
    {
        $curUser = Auth::user();

        $user = User::find($id);
        if (!$user) {
            $data = [
                "status" => 404,
                "message" => "User not found",
            ];

            return response()->json($data, 404);
        }

        $posts = Post::where("user_id", $id)->where("status", "public")->get();

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
                "img_url" => $posts[$i]->img_url,
                "user_id" => $posts[$i]->user_id,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "full_name" => $user->first_name . " " . $user->last_name,
                "username" => $user->username,
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




        $post->group_id = $request->group_id;
        $post->user_id = $userId;
        $post->title = $request->title;
        $post->description = $request->description;
        $post->img_url = $request->img_url;
        $post->save();

        $tags = json_decode($request->tag);

        for ($i = 0; $i < count($tags); $i++) {
            $tag = Tag::find($tags[$i]);

            if (!$tag)
                continue;

            //create post tag
            $postTag = new PostTag;
            $postTag->post_id = $post->id;
            $postTag->tag_id = $tag->id;
            $postTag->save();

        }

        $data = [
            "status" => 201,
            "message" => "Post created successfully",
        ];

        return response()->json($data, 201);

    }

    public function searchPostByTitle(Request $request)
    {
        $searchQuery = $request->query("q");
        $posts = Post::where("title", "like", "%" . $searchQuery . "%")->get();
        return response()->json($posts, 200);
    }

    public function createMobilePost(Request $request)
    {
        $post = new Post();
        $post->group_id = null;
        $post->user_id = $request->user_id;
        $post->title = $request->title;
        $post->description = $request->description;
        $post->status = "public";
        $post->img_url = $request->img_url;
        $post->tag = json_encode([]);
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


        $isLiked = false;
        $likePost = PostLike::where("post_id", $post->id)->where("user_id", $userId)->first();
        if ($likePost)
            $isLiked = true;

        $isSaved = false;
        $save = SavedPost::where("post_id", $post->id)->where("user_id", $userId)->first();
        if ($save)
            $isSaved = true;



        $groupTitle = "";
        if ($post->group_id != null) {
            $group = Group::find($post->group_id);
            $groupTitle = $group->title;
        }

        $tags = PostTag::where("post_id", $post->id)->get();

        $tagDetails = [];

        for ($i = 0; $i < count($tags); $i++) {
            $tag = Tag::find($tags[$i]->tag_id);
            if ($tag) {
                array_push($tagDetails, ["name" => $tag->name, "id" => $tag->id]);
            }
        }

        $user = User::find($post->user_id);

        $postData = [
            "id" => $post->id,
            "user_id" => $post->user_id,
            "group_id" => $post->group_id,
            "group_title" => $groupTitle,
            "tags" => $tagDetails,
            "title" => $post->title,
            "description" => $post->description,
            "img_url" => $post->img_url,
            "status" => $post->status,
            "like_count" => PostLike::where("post_id", $post->id)->count(),
            "is_liked" => $isLiked,
            "is_saved" => $isSaved,
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
            return response()->json($data, 404);
        }

        if ($post->status == "private" && $post->user_id != $userId) {
            $data = [
                "status" => 401,
                "message" => "Unauthorized",
            ];

            return response()->json($data, 401);
        }

        $postTags = PostTag::where("post_id", $post->id)->get()->pluck("tag_id")->toArray();

        $relatedPostIds = PostTag::whereIn("tag_id", $postTags)->get()->pluck("post_id")->toArray();

        $relatedPostIds = array_unique($relatedPostIds);

        $relatedPosts = Post::whereIn('id', $relatedPostIds)->orWhere('user_id', $post->user_id)
            ->where('id', '!=', $post->id)
            ->select('id', 'img_url', 'user_id')->inRandomOrder()->get();

        $relatedPosts = $relatedPosts->filter(function ($relatedPost) use ($post) {
            return $relatedPost->id != $post->id;
        });
        foreach ($relatedPosts as $relatedPost) {

            // get user info
            $user = User::find($relatedPost->user_id);
            $relatedPost->full_name = $user->first_name . " " . $user->last_name;
            $relatedPost->user_pf_img_url = $user->pf_img_url;
            $relatedPost->username = $user->username;

            // check if saved
            $isSaved = SavedPost::where("post_id", $relatedPost->id)->where("user_id", $userId)->first();
            if ($isSaved) {
                $relatedPost->is_saved = true;
            } else {
                $relatedPost->is_saved = false;
            }
        }

        //convert to array
        $relatedPostsArray = $relatedPosts->values()->all();



        $data = [
            "status" => 200,
            "relatedPosts" => $relatedPostsArray,
        ];

        return response()->json($data, 200);
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
            'tags' => 'required|string'
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

        $newTags = json_decode($request->tags);

        //delete old post tags
        PostTag::where("post_id", $post->id)->delete();

        //create new post tags
        for ($i = 0; $i < count($newTags); $i++) {
            $tag = Tag::find($newTags[$i]);

            if (!$tag)
                continue;

            //create post tag
            $postTag = new PostTag;
            $postTag->post_id = $post->id;
            $postTag->tag_id = $tag->id;
            $postTag->save();

        }

        $post->save();

        $data = [
            "status" => 200,
            "message" => "Post updated successfully",
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

        if (($post->user_id == $userId) || $user->role == "admin") {
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

        PostTag::where("post_id", $id)->delete();

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
