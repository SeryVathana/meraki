<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupMember;
use App\Models\Post;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Validator;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $group = Group::where("status", "public")->get();
        $data = [
            'status' => 200,
            'group' => $group
        ];

        return response()->json($data, 200);
    }

    public function getUserGroups($id)
    {
        $group = Group::where('owner_id', $id)->get();

        // loop each group to get the members count
        foreach ($group as $g) {
            $members = GroupMember::where("group_id", $g->id)->get();
            $membersCount = $members->count();
            $g->members = $membersCount;
        }

        $data = [
            'status' => 200,
            'group' => $group
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
    public function store(StoreGroupRequest $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            "img_url" => "nullable|url",
            'status' => 'required',
        ]);



        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);

        } else {
            $group = new Group;

            $group->owner_id = $userId;
            $group->title = $request->title;
            $group->status = $request->status;
            $group->img_url = $request->img_url;

            $group->save();

            $owner = new GroupMember;

            $owner->group_id = $group->id;
            $owner->user_id = $userId;
            $owner->role = "admin";

            $owner->save();

            $data = [
                "status" => 200,
                "message" => "Group created successfully"
            ];

            return response()->json($data, 200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        $group = Group::find($id);

        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];

            return response()->json($data, 404);
        }

        $isMember = false;
        if ($group->owner_id == $user->id) {
            $isMember = true;
        } else {
            $member = GroupMember::where("group_id", $id)->where("user_id", $user->id)->first();
            if ($member) {
                $isMember = true;
            }
        }

        $isAdmin = false;
        if ($group->owner_id == $user->id) {
            $isAdmin = true;
        } else {
            $member = GroupMember::where("group_id", $id)->where("user_id", $user->id)->first();
            if ($member) {
                if ($member->role == "admin") {
                    $isAdmin = true;
                }
            }
        }

        $members = GroupMember::where("group_id", $id)->get();
        $membersCount = $members->count();

        $post = Post::where("group_id", $id)->get();



        $res = [
            "id" => $group->id,
            "title" => $group->title,
            "owner_id" => $group->owner_id,
            "img_url" => $group->img_url,
            "is_member" => $isMember,
            "is_admin" => $isAdmin,
            "status" => $group->status,
            "members" => $membersCount,
            "posts" => count($post),
            "created_at" => $group->created_at,
            "updated_at" => $group->updated_at,
        ];

        $data = [
            "status" => 200,
            "group" => $res,
        ];

        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;

        print ($userId);

        $group = Group::find($id);

        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group not found",
            ];

            return response()->json($data, 404);
        }


        if (!Gate::allows('update', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'status' => 'required',
            "img_url" => "nullable|url"
        ]);

        if ($validator->fails()) {
            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);
        }
        $group = Group::find($id);

        $group->title = $request->title;
        $group->status = $request->status;
        if ($request->img_url != "") {
            $group->img_url = $request->img_url;
        }

        $group->save();

        Post::where("group_id", "=", $group->id)->update(["status" => $request->status]);

        $data = [
            "status" => 200,
            "message" => "Group updated successfully"
        ];

        return response()->json($data, 200);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $group = Group::find($id);

        if (!$group) {
            $data = [
                "status" => 404,
                "message" => "Group with id: $id is not found",
            ];

            return response()->json($data, 404);
        }

        if (!Gate::allows('delete', $group)) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];

            return response()->json($data, 403);
        }


        $group->delete();

        $data = [
            "status" => 200,
            "message" => "Group deleted successfully",
        ];

        return response()->json($data, 200);

    }
}
