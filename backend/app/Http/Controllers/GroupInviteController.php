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
