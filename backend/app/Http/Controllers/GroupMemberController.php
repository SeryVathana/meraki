<?php

namespace App\Http\Controllers;

use App\Models\GroupMember;
use App\Models\Group;
use App\Http\Requests\StoreGroupMemberRequest;
use App\Http\Requests\UpdateGroupMemberRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Validator;

class GroupMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreGroupMemberRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $group = Group::find($id);

        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];

            return response()->json($data, 404);
        }

        $members = GroupMember::where("group_id", $id)->get();

        $data = [
            'status' => 200,
            'member' => $members
        ];

        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GroupMember $groupMember)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupMemberRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;
        $group = Group::find($id);
        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];
            return response()->json($data, 404);
        }

        if (!Gate::allows('update_member', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'role' => 'required',
        ]);

        if ($validator->fails()) {
            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];
            return response()->json($data, 400);
        }

        if ($userId == $request->user_id) {
            $data = [
                "status" => 403,
                "message" => "You can't change your self"
            ];
            return response()->json($data, 403);
        }

        $member = GroupMember::where("group_id", $id)->where("user_id", $request->user_id)->first();
        if (!$member) {
            $data = [
                "status" => 400,
                "message" => "Member not found"
            ];
            return response()->json($data, 400);
        }

        if ($user->role != "admin" && $member->role == "admin") {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        $member->role = $request->role;
        $member->save();

        $data = [
            'status' => 200,
            'message' => "Member updated successfully"
        ];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UpdateGroupMemberRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;
        $group = Group::find($id);
        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];
            return response()->json($data, 404);
        }

        if (!Gate::allows('update_member', $group)) {
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

        $member = GroupMember::where("group_id", $id)->where("user_id", $request->user_id)->first();
        if (!$member) {
            $data = [
                "status" => 400,
                "message" => "Member not found"
            ];
            return response()->json($data, 400);
        }

        if ($user->role != "admin" && $member->role == "admin" && $userId != $request->user_id) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        $member->delete();

        $data = [
            'status' => 200,
            'message' => "Member removed successfully"
        ];
        return response()->json($data, 200);
    }
}
