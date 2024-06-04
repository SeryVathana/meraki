<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\GroupInvite;
use App\Http\Requests\StoreGroupInviteRequest;
use App\Http\Requests\UpdateGroupInviteRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Validator;


class GroupInviteController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     /**
     * @OA\Get(
     *     path="/api/group/invite/{id}",
     *     operationId="getGroupInviteById",
     *     tags={"UserGroupInvite"},
     *     summary="Get GroupInvite information",
     *     description="Returns GroupInvite data",
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
    public function index($id)
    {
        $group = Group::find($id);
        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];

            return response()->json($data, 404);
        }

        if (!Gate::allows('view_invite', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }

        $invites = GroupInvite::get();
        $data = [
            "status" => 200,
            "invite" => $invites
        ];

        return response()->json($data, 200);
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

     /**
     * @OA\Post(
     *     path="/api/group/invite/{id}",
     *     operationId="storeGroupInvite",
     *     tags={"UserGroupInvite"},
     *     summary="Create Group Invite",
     *     description="Creates a Group Invite",
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
     *             required={"group_id", "user_id"},
     *             @OA\Property(property="group_id", type="integer"),
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
    public function store(StoreGroupInviteRequest $request, $id)
    {
        $group = Group::find($id);

        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];

            return response()->json($data, 404);
        }

        if (!Gate::allows('create_invite', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
        ]);

        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);

        }

        $user = User::find($request->user_id);
        if (!$user) {
            $data = [
                "status" => 404,
                "message" => "User not found"
            ];

            return response()->json($data, 404);
        }

        $members = GroupMember::where("group_id", $group->id)->where("user_id", $request->user_id)->get();
        $membersCount = $members->count();
        if ($membersCount > 0 && $members[0] != null) {
            $data = [
                "status" => 400,
                "message" => "User already exist in group"
            ];

            return response()->json($data, 400);
        }

        $invites = GroupInvite::where("group_id", $group->id)->where("user_id", $request->user_id)->get();
        $invitesCount = $invites->count();
        if ($invitesCount > 0 && $invites[0] != null) {
            $data = [
                "status" => 400,
                "message" => "User already invited to group"
            ];

            return response()->json($data, 400);
        }

        $invite = new GroupInvite;

        $invite->user_id = $request->user_id;
        $invite->group_id = $group->id;

        $invite->save();

        $data = [
            "status" => 200,
            "message" => "Invite created successfully"
        ];

        return response()->json($data, 200);

    }

    /**
     * Display the specified resource.
     */
    public function show(GroupInvite $groupInvite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GroupInvite $groupInvite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * Update the specified resource in storage.
     * @OA\Put(
     *     path="/api/group/invite/accept/{id}",
     *     operationId="updateGroupInvite",
     *     tags={"UserGroupInvite"},
     *     summary="Update group Invite",
     *     description="Updates a specific group Invite",
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
     *             required={"group_id", "user_id", "role"},
     *             @OA\Property(property="group_id", type="integer"),
     *             @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="role", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Member updated successfully",
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
    public function update(UpdateGroupInviteRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $invite = GroupInvite::find($id);

        if (!$invite) {
            $data = [
                "status" => 404,
                "message" => "Invite not found",
            ];

            return response()->json($data, 404);
        }

        if ($invite->user_id != $userId) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized",
            ];

            return response()->json($data, 404);
        }

        $group = Group::find($invite->group_id);

        $newMember = new GroupMember;

        $newMember->group_id = $group->id;
        $newMember->user_id = $userId;
        $newMember->role = "member";

        $newMember->save();

        $invite->delete();

        $data = [
            "status" => 200,
            "message" => "Invite accepted successfully"
        ];

        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Remove the specified resource from storage.
     * @OA\Delete(
     *     path="/api/group/invite/{id}",
     *     operationId="deleteGroupInvite",
     *     tags={"UserGroupInvite"},
     *     summary="Delete group Invite",
     *     description="Deletes a specific group invite",
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
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="integer")
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

    public function destroy(UpdateGroupInviteRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $invite = GroupInvite::find($id);

        if (!$invite) {
            $data = [
                "status" => 404,
                "message" => "Invite not found",
            ];

            return response()->json($data, 404);
        }

        $group = Group::find($invite->group_id);

        $authorized = false;

        if ($userId == $group->owner_id) {
            $authorized = true;
        }

        if (GroupMember::where('group_id', $invite->group_id)->where('user_id', $userId)->where('role', "admin")->exists()) {
            $authorized = true;
        }

        if ($userId == $invite->user_id) {
            $authorized = true;
        }

        if ($authorized == true) {
            $invite->delete();

            $data = [
                "status" => 200,
                "message" => "Invite removed successfully"
            ];

            return response()->json($data, 200);

        } else {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }
    }
}
