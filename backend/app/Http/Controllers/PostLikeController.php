<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostLikeController extends Controller
{
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

        $postLike = PostLike::where("user_id", $userId)->where("post_id", $post->id)->first();
        if ($postLike) {
            $data = [
                "status" => 400,
                "message" => "Post already liked",
            ];
            return response()->json($data, 400);
        }

        $like = new PostLike();
        $like->user_id = $userId;
        $like->post_id = $post->id;
        $like->save();

        $data = [
            "status" => 200,
            "message" => "Liked post successfully",
        ];
        return response()->json($data, 200);
    }

    public function unlikePost($id)
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

        $postLike = PostLike::where("user_id", $userId)->where("post_id", $post->id)->first();
        if (!$postLike) {
            $data = [
                "status" => 400,
                "message" => "Post not liked",
            ];
            return response()->json($data, 400);
        }

        $postLike->delete();

        $data = [
            "status" => 200,
            "message" => "Unliked post successfully",
        ];
        return response()->json($data, 200);
    }
}
