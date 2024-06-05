<?php

namespace App\Http\Controllers;

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
use OpenApi\Annotations as OA;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    /**
     * @OA\Get(
     *     path="/api/post",
     *     operationId="getPostsList",
     *     tags={"UserPost"},
     *     summary="Get list of posts",
     *     description="Returns list of posts",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items()
     *         ),
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     )
     * )
     */
    public function index(Request $request)
    {

        $loggedUser = Auth::user();
        $qTag = $request->tag;

        $posts = [];
        $tag = Tag::where('name', "ILIKE", $qTag)->first();
        $allPosts = Post::where("status", "public")->orderByDesc("created_at")->get();


        $posts = [];
        if ($tag) {
            for ($i = 0; $i < count($allPosts); $i++) {
                $postTag = json_decode($allPosts[$i]->tag);


                if (in_array($tag->id, $postTag)) {
                    array_push($posts, $allPosts[$i]);
                }
            }
        } else {
            $posts = $allPosts;
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

    /**
     * @OA\Get(
     *     path="/api/post/highlighted",
     *     operationId="getHighlightedPosts",
     *     tags={"UserPost"},
     *     summary="Get highlighted posts",
     *     description="Returns the highlighted post",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/api/post/latest",
     *     operationId="getLatestPosts",
     *     tags={"UserPost"},
     *     summary="Get latest posts",
     *     description="Returns the latest post",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function getLatestPosts()
    {
        $latestPost = Post::orderBy('created_at', 'desc')->first();

        return response()->json([
            'latest_post' => $latestPost,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/post/mypost",
     *     operationId="getMyPosts",
     *     tags={"UserPost"},
     *     summary="Get my posts",
     *     description="Returns the authenticated user's posts",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     )
     * )
     */
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
  
  /**
     * @OA\Get(
     *     path="/api/post/user/{id}",
     *     operationId="getUserPosts",
     *     tags={"UserPost"},
     *     summary="Get posts by user ID",
     *     description="Returns posts for a specific user",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/api/post/group/{id}",
     *     operationId="getGroupPosts",
     *     tags={"UserPost"},
     *     summary="Get posts by group ID",
     *     description="Returns posts for a specific group",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Group not found",
     *     )
     * )
     */
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
                "message" => "Unauthorized",
            ];

            return response()->json($data, 403);
        }
    }

    /**
     * Store a newly created resource in storage.
     */

    /**
     * @OA\Post(
     *     path="/api/post",
     *     operationId="storePost",
     *     tags={"UserPost"},
     *     summary="Create new post",
     *     description="Creates a new post",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"title", "status", "tag"},
     *             @OA\Property(property="group_id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="img_url", type="string"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="tag", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Post created successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request"
     *     )
     * )
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

            return response()->json($data, 400);
        }

        $post = new Post;

        if ($request->group_id != null) {
            $group1 = Group::find($request->group_id);
            if (!$group1) {
                $data = [
                    "status" => 404,
                    "message" => "Group not found"
                ];
                return response()->json($data, 404);
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
        $post->likes = '[]';
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

    /**
     * @OA\Get(
     *     path="/api/post/{id}",
     *     operationId="showPost",
     *     tags={"UserPost"},
     *     summary="Get post by ID",
     *     description="Returns a specific post by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     )
     * )
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
            return response()->json($data, 404);
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

        $saves = SavedPost::where("post_id", $post->id)->where("user_id", $userId)->get();

        $isSaved = false;
        if (count($saves) > 0) {
            $isSaved = true;
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
            "group_title" => "",
            "tags" => $tagDetails,
            "title" => $post->title,
            "description" => $post->description,
            "img_url" => $post->img_url,
            "status" => $post->status,
            "likes" => $likes,
            "like_count" => count($likes),
            "is_liked" => $isLiked,
            "is_saved" => $isSaved,
            "user_name" => $postOwner->first_name . " " . $postOwner->last_name,
            "user_pf_img_url" => $postOwner->pf_img_url,
            "created_at" => $post->created_at,
            "updated_at" => $post->updated_at
        ];

        if ($post->group_id != null) {
            $group = Group::find($post->group_id);
            $postData["group_title"] = $group->title;
        }



        $data = [
            "status" => 200,
            "post" => $postData,
        ];

        return response()->json($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/post/{id}/related",
     *     operationId="getRelatedPosts",
     *     tags={"UserPost"},
     *     summary="Get related posts",
     *     description="Returns related posts based on tag",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     )
     * )
     */
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

    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    /**
     * @OA\Put(
     *     path="/api/post/{id}",
     *     operationId="updatePost",
     *     tags={"UserPost"},
     *     summary="Update post",
     *     description="Updates a specific post",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"title", "status", "tags"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="img_url", type="string"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="integer"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post updated successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     )
     * )
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

        $tags = Tag::find($newTags)->pluck('id')->toArray();
        $post->tag = $newTags;

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

    /**
     * @OA\Delete(
     *     path="/api/post/{id}",
     *     operationId="deletePost",
     *     tags={"UserPost"},
     *     summary="Delete post",
     *     description="Deletes a specific post",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post deleted successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     )
     * )
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

        $data = [
            "status" => 200,
            "message" => "Post deleted successfully",
        ];

        return response()->json($data, 200);
    }

    /**
     * Post CRUD By Admin
     */

    /**
     * @OA\Get(
     *     path="/api/admin/post",
     *     operationId="adminGetPostsList",
     *     tags={"AdminPost"},
     *     summary="Get all posts for admin",
     *     description="Returns all posts for admin",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items()
     *         ),
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     )
     * )
     */
    public function adminIndex()
    {
        $posts = Post::all();
        return response()->json($posts);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/post/{id}",
     *     operationId="adminGetPostById",
     *     tags={"AdminPost"},
     *     summary="Get post by ID for admin",
     *     description="Returns a specific post by ID for admin",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     )
     * )
     */
    public function adminShow($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        return response()->json($post);
    }

   /**
     * @OA\Delete(
     *     path="/api/admin/post/{id}",
     *     operationId="adminDeletePost",
     *     tags={"AdminPost"},
     *     summary="Delete post for admin",
     *     description="Deletes a specific post for admin",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post deleted successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     )
     * )
     */
    public function adminDestroy($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }
}

