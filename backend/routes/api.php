<?php
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\PostLikeController;
use App\Http\Controllers\SavedPostController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\UserFollowerController;
use App\Mail\SendMail;
use Illuminate\Support\Facades\Mail;
use App\Mail\TestEmail;
use App\Models\UserFollower;
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

Route::get('auth/{provider}', [SocialiteController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback']);

Route::group([
    'middleware' => ['auth:sanctum']
], function () {

    Route::get('/send-email', function () {
        $details = [
            'first_name' => 'John',
            'email' => 'znaaamz@gmail.com',
            'password' => 'generated_password123'
        ];

        Mail::to($details['email'])->send(new SendMail($details));

        return 'Admin notification email sent!';
    });

    Route::get("user", [UserController::class, "getUserData"]);
    Route::put('auth/logout', [UserController::class, 'logout']);
    Route::get('auth/logoutAll', [UserController::class, 'logoutAll']);
    Route::put('user/password', [UserController::class, 'updateUserPassword']);
    Route::get('user/mobile', [UserController::class, 'getUserDataMobile']);
    Route::put('user/edit', [UserController::class, 'editProfile']);
    Route::put('user/editMobile', [UserController::class, 'editProfileMobile']);
    Route::get('user/{id}', [UserController::class, 'getUserDataById']);
    Route::put('user/follow/{id}', [UserFollowerController::class, 'followUser']);
    Route::put('user/unfollow/{id}', [UserFollowerController::class, 'unfollowUser']);
    Route::put('user/updatepf', [UserController::class, 'updateUserPfImg']);
    Route::get('user/follower/{id}', [UserFollowerController::class, 'getUserFollowers']);
    Route::get('user/following/{id}', [UserFollowerController::class, 'getUserFollowings']);

    Route::get('post', [PostController::class, "index"]);
    Route::get('post/mypost', [PostController::class, "getMyPosts"]);
    Route::get('post/mypost/mobile', [PostController::class, "getMyPostsMobile"]);
    Route::get('post/user/{id}', [PostController::class, "getUserPosts"]); // $id = user id
    Route::get('post/group/{id}', [PostController::class, "getGroupPosts"]); // $id = group id
    Route::get('post/{id}', [PostController::class, "show"]);
    Route::post('post', [PostController::class, "store"]);
    Route::put('post/{id}', [PostController::class, "update"]);
    Route::get('post/related/{id}', [PostController::class, "related"]);
    Route::delete('post/{id}', [PostController::class, "destroy"]);
    Route::get('post/highlighted', [PostController::class, 'getHighlightedPosts']);
    Route::get('post/latest', [PostController::class, 'getLatestPosts']);
    Route::PUT('post/like/{id}', [PostLikeController::class, 'likePost']);
    Route::delete('post/like/{id}', [PostLikeController::class, 'unlikePost']);

    // Group 
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
    Route::put("group/demote/{id}", [GroupController::class, "demoteAdmin"]); // $id = group id


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

    // Advance search
    Route::get('post/advancesearch', [SearchController::class, "advancedsearch"]);

    //Search
    Route::get("search/user", [SearchController::class, "searchUsers"]);
    Route::get("search/group", [SearchController::class, "searchGroups"]);
    Route::get("search/post", [SearchController::class, "searchPosts"]);

    //Random
    Route::get("random/user", [SearchController::class, "getRandomUsers"]);
    Route::get("random/group", [SearchController::class, "getRandomGroups"]);
    Route::get("random/post", [SearchController::class, "getRandomPosts"]);

    Route::group([
        'middleware' => AdminRoleMiddleware::class
    ], function () {
        Route::get('admin/getTotalUsers', [DashboardController::class, 'getTotalUsers']);
        Route::get('admin/getTotalPosts', [DashboardController::class, 'getTotalPosts']);
        Route::get('admin/getTotalGroups', [DashboardController::class, 'getTotalGroups']);
        Route::get('admin/getWeeklyNewUsers', [DashboardController::class, 'getWeeklyNewUsers']);
        Route::get('admin/get10NewUsers', [DashboardController::class, 'get10NewUsers']);
        Route::get('admin/getTotalPostsOfLastSixMonths', [DashboardController::class, 'getTotalPostsOfLastSixMonths']);

        Route::get('admin/users', [DashboardController::class, 'getAllUsers']);
        Route::put('admin/user/{id}', [UserController::class, 'adminUpdateUserInfo']);
        Route::get('admin/admins', [DashboardController::class, 'getAllAdmins']);
        Route::post('admin/createAdmin', [UserController::class, 'createAdmin']);
        Route::put('admin/removeAdmin/{id}', [UserController::class, 'removeAdmin']);
        Route::delete('admin/deleteUser/{id}', [UserController::class, 'deleteUser']);
        //Group
        Route::get('admin/tag', [TagController::class, 'index']);
        Route::post('admin/tag', [TagController::class, "store"]);
        Route::put('admin/tag/{id}', [TagController::class, "update"]);
        Route::delete('admin/tag/{id}', [TagController::class, "destroy"]);

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
