<?php
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\SavedPostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupInviteController;
use App\Http\Controllers\GroupMemberController;
use App\Http\Controllers\GroupRequestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ReportController;
use App\Http\Middleware\AdminRoleMiddleware;
use App\Http\Middleware\Cors;
use App\Models\Comment;

Route::get('post/getall', [PostController::class, "getAllPosts"]);
Route::get("post/search", [PostController::class, "searchPostByTitle"]);
Route::post('post/create', [PostController::class, "createMobilePost"]);
Route::post("auth/register-mobile", [UserController::class, "createUserMobile"]);

Route::post('auth/register', [UserController::class, 'createUser']);
Route::post('auth/login', [UserController::class, 'loginUser']);

Route::group([
    'middleware' => ['auth:sanctum']
], function () {
    Route::get("user", [UserController::class, "getUserData"]);
    Route::put('auth/logout', [UserController::class, 'logout']);
    Route::get('auth/logoutAll', [UserController::class, 'logoutAll']);
    Route::put('user/password', [UserController::class, 'updateUserPassword']);
    Route::get('user/mobile', [UserController::class, 'getUserDataMobile']);
    Route::put('user/edit', [UserController::class, 'editProfile']);
    Route::put('user/editMobile', [UserController::class, 'editProfileMobile']);
    Route::get('user/{id}', [UserController::class, 'getUserDataById']);
    Route::put('user/follow/{id}', [UserController::class, 'followUser']);
    Route::put('user/unfollow/{id}', [UserController::class, 'unfollowUser']);
    Route::put('user/updatepf', [UserController::class, 'updateUserPfImg']);
    Route::get('user/follower/{id}', [UserController::class, 'getUserFollowers']);
    Route::get('user/following/{id}', [UserController::class, 'getUserFollowings']);

    Route::get('post', [PostController::class, "index"]);
    Route::get('post/mypost', [PostController::class, "getMyPosts"]);
    Route::get('post/mypost/mobile', [PostController::class, "getMyPostsMobile"]);
    Route::get('post/user/{id}', [PostController::class, "getUserPosts"]); // $id = user id
    Route::get('post/group/{id}', [PostController::class, "getGroupPosts"]); // $id = group id
    Route::get('post/{id}', [PostController::class, "show"]);
    Route::post('post', [PostController::class, "store"]);
    Route::put('post/{id}', [PostController::class, "update"]);
    Route::get('post/{id}/related', [PostController::class, "related"]);
    Route::delete('post/{id}', [PostController::class, "destroy"]);
    Route::get('post/highlighted', [PostController::class, 'getHighlightedPosts']);
    Route::get('post/latest', [PostController::class, 'getLatestPosts']);
    Route::PUT('post/like/{id}', [PostController::class, 'likePost']);

    Route::get('group', [GroupController::class, "index"]);
    Route::get("group/user/{id}", [GroupController::class, "getUserGroups"]);
    Route::get("group/mygroups", [GroupController::class, "getMyGroups"]);
    Route::get('group/{id}', [GroupController::class, "show"]);
    Route::post('group', [GroupController::class, "store"]);
    Route::put('group/{id}', [GroupController::class, "update"]);
    Route::delete('group/{id}', [GroupController::class, "destroy"]);

    // Group member
    Route::put("group/public/join/{id}", [GroupController::class, "joinPublicGroup"]); // $id = group id
    Route::put("group/leave/{id}", [GroupController::class, "leaveGroup"]); // $id = group id

    Route::get("group/notmember/{id}", [GroupMemberController::class, "getNotMembers"]); // $id = group id
    Route::get('group/member/{id}', [GroupMemberController::class, "show"]); // $id = group id
    Route::put('group/member/{id}', [GroupMemberController::class, "update"]); // $id = group id
    Route::delete('group/member/{id}', [GroupMemberController::class, "destroy"]); // $id = group id
    Route::put("group/promote/{id}", [GroupController::class, "promoteToAdmin"]); // $id = group id


    // Group invite
    Route::get('group/invite/{id}', [GroupInviteController::class, "index"]); //$id = group id
    Route::post('group/invite/{id}', [GroupInviteController::class, "store"]); //$id = group id
    Route::delete('group/invite/{id}', [GroupInviteController::class, "destroy"]); //$id = invite id
    Route::put('group/invite/accept/{id}', [GroupInviteController::class, "update"]); //$id = invite id
    Route::get("group/pending/invite", [GroupInviteController::class, "getPendingInvites"]);
    //Group request
    Route::post('group/request/{id}', [GroupRequestController::class, "store"]); //$id = group id
    Route::put('group/request/accept/{id}', [GroupRequestController::class, "update"]); //$id = group id
    Route::delete('group/request/{id}', [GroupRequestController::class, "destroy"]); //$id = group id
    Route::get("group/request/pending/{id}", [GroupRequestController::class, "getPendingRequests"]); //$id = group id

    //Folder
    Route::get('folder', [FolderController::class, "index"]);
    Route::get("folder/{id}", [FolderController::class, "show"]);
    Route::post('folder', [FolderController::class, "store"]);
    Route::put('folder/{id}', [FolderController::class, "update"]);
    Route::delete('folder/{id}', [FolderController::class, "destroy"]);
    Route::get("folder/post/{id}", [FolderController::class, "getFoldersByPostId"]);

    //Comment with multi level
    Route::get('/comment/{id}', [CommentController::class, 'index']);
    Route::post('/comment', [CommentController::class, 'store']);
    Route::post('/comment/{id}/reply', [CommentController::class, 'reply']);

    //Saved Post
    Route::post('post/savepost', [SavedPostController::class, 'store']);
    Route::get('post/savedPosts/{id}', [SavedPostController::class, 'getSavedPosts']);

    //Report 
    Route::post('report', [ReportController::class, 'store']);


    //Tag
    Route::get('tag', [TagController::class, "index"]);
    Route::get('tag/{id}', [TagController::class, "show"]);



    Route::group([
        'middleware' => AdminRoleMiddleware::class
    ], function () {
        //Group
        Route::post('tag', [TagController::class, "store"]);
        Route::put('tag/{id}', [TagController::class, "update"]);
        Route::delete('tag/{id}', [TagController::class, "destroy"]);
        Route::get('admin/group', [GroupController::class, 'index']);


        //comment
        Route::get('admin/comment', [CommentController::class, 'adminIndex']);
        Route::get('admin/comment/{id}', [CommentController::class, 'adminShow']);
        Route::delete('admin/comment/{id}', [CommentController::class, 'adminDestroy']);

        //post
        Route::get('admin/post', [PostController::class, 'adminIndex']);
        Route::get('admin/post/{id}', [PostController::class, 'adminShow']);
        Route::delete('admin/post/{id}', [PostController::class, 'adminDestroy']);

        //report 
        Route::get('admin/report', [ReportController::class, 'adminIndex']);
        Route::get('admin/postId/{id}', [ReportController::class, 'adminShow']);
        Route::delete('admin/report/{id}', [ReportController::class, 'adminDestroy']);

    });
});
