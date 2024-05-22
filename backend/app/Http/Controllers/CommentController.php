<?php

namespace App\Http\Controllers;

use App\Models\Comment;
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
    public function index()
    {
        $comments = Comment::with('replies', 'replies.replies')->whereNull('reply_cmt_id')->get();
        return response()->json($comments);
    }
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

        return response()->json($comment, 201);
    
    }
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

        return response()->json(['message' => 'Reply created successfully'], 201);
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
    public function adminIndex()
    {
        $comments = Comment::all();
        return response()->json($comments);
    }

    //Get Comment By Id
    public function adminShow($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        return response()->json($comment);
    }

    //Delete Comments
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


