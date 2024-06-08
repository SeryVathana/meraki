<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    /**
     * @OA\Get(
     *     path="/api/comment",
     *     operationId="getComment",
     *     tags={"UserComment"},
     *     summary="Get list of Comments",
     *     description="Returns list of Comments",
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
    public function index($id)
    {
        $comments = Comment::whereNull('reply_cmt_id')->where("post_id", $id)->orderBy("created_at", 'desc')->get();

        $comments->map(function ($comment) {

            $user = User::find($comment->user_id);
            if ($user) {
                $comment->user_name = $user->first_name . ' ' . $user->last_name;
                $comment->user_pf_img_url = $user->pf_img_url;
            } else {
                $comment->user_name = 'Unknown';
                $comment->user_pf_img_url = '';
            }

            $arrCmt = Comment::where('reply_cmt_id', "=", $comment->id)->get();

            $comment->replies = $arrCmt;

            $comment->replies->map(function ($reply) {
                $user = User::find($reply->user_id);
                if ($user) {
                    $reply->user_name = $user->first_name . ' ' . $user->last_name;
                    $reply->user_pf_img_url = $user->pf_img_url;
                } else {
                    $reply->user_name = 'Unknown';
                    $reply->user_pf_img_url = '';
                }
            });
        });


        $data = [
            "status" => 200,
            "message" => "Comments retrieved successfully",
            "comments" => $comments
        ];

        return response()->json($data);
    }

    /**
     * @OA\Post(
     *     path="/api/comment",
     *     operationId="storeComment",
     *     tags={"UserComment"},
     *     summary="Create Comment ",
     *     description="Creates a Comment ",
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
     *             required={"reply_cmt_id", "comment", "post_id", "user_id"},
     *             @OA\Property(property="reply_cmt_id", type="integer"),
     *             @OA\Property(property="comment", type="string"),
     *             @OA\Property(property="post_id", type="integer"),
     *             @OA\Property(property="user_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Request created successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="User already in group or already requested",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Group not found",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id;
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'post_id' => 'required|exists:posts,id',
            'reply_cmt_id' => 'nullable|exists:comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $comment = new Comment();
        $comment->user_id = $userId;
        $comment->comment = $request->input('comment'); // Assuming 'body' is the field name for comment content
        $comment->post_id = $request->input('post_id'); // Assuming 'post_id' is the field name for post id
        $comment->reply_cmt_id = $request->input('reply_cmt_id'); // Assuming 'reply_cmt_id' is the field name for reply comment id
        $comment->save();

        $cmtInfo = [
            'user_id' => $userId,
            'user_name' => $user->first_name . ' ' . $user->last_name,
            'user_pf_img_url' => $user->pf_img_url,
            "comment" => $comment->comment,
            'post_id' => $comment->post_id,
            'reply_cmt_id' => $comment->reply_cmt_id,
            'created_at' => $comment->created_at,
            'updated_at' => $comment->updated_at
        ];

        $data = [
            'status' => 200,
            'message' => 'Comment created successfully',
            'comment' => $cmtInfo
        ];

        return response()->json($data, 200);

    }

    /**
     * @OA\Post(
     *     path="/api/comment/{id}/reply",
     *     operationId="storeReplyComment",
     *     tags={"UserComment"},
     *     summary="Create ReplyComment ",
     *     description="Creates a ReplyComment ",
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
     *             required={"reply_cmt_id", "comment", "post_id", "user_id"},
     *             @OA\Property(property="reply_cmt_id", type="integer"),
     *             @OA\Property(property="comment", type="string"),
     *             @OA\Property(property="post_id", type="integer"),
     *             @OA\Property(property="user_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Request created successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="User already in group or already requested",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Group not found",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function reply(Request $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $parentComment = Comment::findOrFail($id);

        $reply = new Comment();
        $reply->user_id = Auth::id();
        $reply->comment = $request->input('comment');
        $reply->post_id = $parentComment->post_id; // Ensure reply is associated with the same post
        $reply->reply_cmt_id = $parentComment->id;
        $reply->save();

        $cmtInfo = [
            'user_id' => $userId,
            'user_name' => $user->first_name . ' ' . $user->last_name,
            'user_pf_img_url' => $user->pf_img_url,
            "comment" => $reply->comment,
            'post_id' => $reply->post_id,
            'reply_cmt_id' => $reply->reply_cmt_id,
            'created_at' => $reply->created_at,
            'updated_at' => $reply->updated_at
        ];

        $data = [
            "status" => 200,
            'message' => 'Reply created successfully',
            "reply" => $cmtInfo
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        //
    }

    public function destroy(Comment $comment)
    {
        //
    }


    // For Role Admin CRUD Comments

    //Get ALL Comments

    /**
     * @OA\Get(
     *     path="/api/admin/comment",
     *     operationId="AdmingetComment",
     *     tags={"AdminComment"},
     *     summary="Get list of Comments",
     *     description="Returns list of Comments",
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
        $comments = Comment::all();
        return response()->json($comments);
    }

    //Get Comment By Id
    /**
     * @OA\Get(
     *     path="/api/admin/comment/{id}",
     *     operationId="AdmingetCommnetById",
     *     tags={"AdminCommnet"},
     *     summary="Get Commnet information",
     *     description="Returns Commnet data",
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
     *         description="GroupInvite not found",
     *     )
     * )
     */
    public function adminShow($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        return response()->json($comment);
    }

    //Delete Comments
    /**
     * Remove the specified resource from storage.
     */
    /**
     * Remove the specified resource from storage.
     * @OA\Delete(
     *     path="/api/admin/comment/{id}",
     *     operationId="AdmindeleteComment",
     *     tags={"AdminComment"},
     *     summary="Delete Comment ",
     *     description="Deletes a specific Comment ",
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
     *             type="object"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="GroupInvite deleted successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Group not found"
     *     )
     * )
     */
    public function adminDestroy($id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}


