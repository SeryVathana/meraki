<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupRequest;
use App\Models\GroupMember;
use App\Http\Requests\StoreGroupRequestRequest;
use App\Http\Requests\UpdateGroupRequestRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\JsonResponse;

class GroupRequestController extends Controller
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
     * @OA\Post(
     *     path="/api/group/request/{id}",
     *     operationId="storeGroupRequest",
     *     tags={"UserGroupRequest"},
     *     summary="Create Group Request",
     *     description="Creates a Group Request",
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
    public function store(StoreGroupRequestRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $existedMember = GroupMember::where("group_id", $id)->where("user_id", $userId)->first();
        if ($existedMember) {
            $data = [
                "status" => 400,
                "message" => "User already in group",
            ];

            return response()->json($data, 400);
        }

        $existedReq = GroupRequest::where("group_id", $id)->where("user_id", $userId)->first();
        if ($existedReq) {

            //delete request

            $existedReq->delete();

            $data = [
                "status" => 200,
                "message" => "Request deleted successfully",
            ];

            return response()->json($data, 200);
        }

        $group = Group::find($id);
        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];

            return response()->json($data, 404);
        }

        $groupReq = new GroupRequest;

        $groupReq->user_id = $userId;
        $groupReq->group_id = $group->id;

        $groupReq->save();

        $data = [
            "status" => 201,
            "message" => "Request created successfully"
        ];

        return response()->json($data, 201);
    }

    public function getPendingRequests($id)
    {
        $group = Group::find($id);
        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found"
            ];

            return response()->json($data, 404);
        }

        if (!Gate::allows('accept_request', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }

        $requests = GroupRequest::where("group_id", $id)->get();

        //get user info
        foreach ($requests as $req) {
            $user = User::find($req->user_id);
            $req->user_id = $user->id;
            $req->first_name = $user->first_name;
            $req->last_name = $user->last_name;
            $req->email = $user->email;
            $req->pf_img_url = $user->pf_img_url;
        }

        $data = [
            "status" => 200,
            "message" => "Requests",
            "data" => $requests
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(GroupRequest $groupRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GroupRequest $groupRequest)
    {
        //
    }

    /**
     * @OA\Put(
     *     path="/api/group/request/accept/{id}",
     *     operationId="updateGroupRequest",
     *     tags={"GroupRequest"},
     *     summary="Update Group Request",
     *     description="Updates a specific Group Request",
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
     *             required={"group_id","user_id", "role"},
     *             @OA\Property(property="group_id", type="integer"),
     * *           @OA\Property(property="user_id", type="integer"),
     *             @OA\Property(property="role", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Request accepted successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Request not found",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function update(UpdateGroupRequestRequest $request, $id)
    {
        $groupReq = GroupRequest::find($id);
        if (!$groupReq) {
            $data = [
                "status" => 404,
                "message" => "Request not found"
            ];

            return response()->json($data, 400);
        }

        $group = Group::find($groupReq->group_id);

        if (!Gate::allows('accept_request', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }

        $newMember = new GroupMember;

        $newMember->group_id = $group->id;
        $newMember->user_id = $groupReq->user_id;
        $newMember->role = "member";
        $newMember->save();
        $groupReq->delete();

        $data = [
            "status" => 200,
            "message" => "Request accepted successfully"
        ];

        return response()->json($data, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/group/request/{id}",
     *     operationId="deleteGroupRequest",
     *     tags={"UserGroupRequest"},
     *     summary="Delete Group Request",
     *     description="Deletes a specific Group Request",
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
     *         description="Request deleted successfully",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *         @OA\JsonContent()
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Request not found",
     *         @OA\JsonContent()
     *     )
     * )
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $groupReq = GroupRequest::find($id);
        if (!$groupReq) {
            $data = [
                "status" => 404,
                "message" => "Request not found"
            ];

            return response()->json($data, 400);
        }

        $authorized = false;

        if ($userId == $groupReq->user_id) {
            $authorized = true;
        } else {
            $group = Group::find($groupReq->group_id);

            if (!Gate::allows('accept_request', $group)) {
                $data = [
                    "status" => 403,
                    "message" => "Unauthorized"
                ];

                return response()->json($data, 403);
            }

            $authorized = true;
        }

        if ($authorized) {
            $groupReq->delete();
        }

        $data = [
            "status" => 200,
            "message" => "Request deleted successfully"
        ];

        return response()->json($data, 200);
    }
}
