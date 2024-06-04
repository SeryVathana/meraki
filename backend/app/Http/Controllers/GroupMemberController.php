<?php

namespace App\Http\Controllers;

use App\Models\GroupMember;
use App\Models\Group;
use App\Http\Requests\StoreGroupMemberRequest;
use App\Http\Requests\UpdateGroupMemberRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Validator;

class GroupMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Implementation here
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Implementation here
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupMemberRequest $request)
    {
        // Implementation here
    }

    /**
     * Display the specified resource.
     * @OA\Get(
     *     path="/api/group/member/{id}",
     *     operationId="getGroupMember",
     *     tags={"UserGroupMember"},
     *     summary="Get group member",
     *     description="Returns group member based on group",
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
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Group not found"
     *     )
     * )
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
            'members' => $members
        ];

        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GroupMember $groupMember)
    {
        // Implementation here
    }

    /**
     * Update the specified resource in storage.
     * @OA\Put(
     *     path="/api/group/member/{id}",
     *     operationId="updateGroupMember",
     *     tags={"UserGroupMember"},
     *     summary="Update group member",
     *     description="Updates a specific group member",
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
     *             required={"user_id", "role"},
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
            'user_id' => 'required|integer',
            'role' => 'required|string',
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
                "message" => "You can't change yourself"
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
     * @OA\Delete(
     *     path="/api/group/member/{id}",
     *     operationId="deleteGroupMember",
     *     tags={"UserGroupMember"},
     *     summary="Delete group member",
     *     description="Deletes a specific group member",
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
     *         description="Member deleted successfully",
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
    public function destroy(Request $request, $id)
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
            'user_id' => 'required|integer',
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