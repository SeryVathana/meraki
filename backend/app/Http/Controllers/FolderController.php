<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use Illuminate\Support\Facades\Auth;
use Validator;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        $folders = Folder::where("user_id", $userId)->get();
        $data = [
            "status" => 200,
            "folders" => $folders,
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
    public function store(StoreFolderRequest $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'nullable|max:255',
            'status' => 'required',
        ]);

        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);

        }

        if ($request->status != "public" && $request->status != "private") {
            $data = [
                "status" => 400,
                "message" => "Invalid input"
            ];

            return response()->json($data, 400);
        }

        $folder = new Folder;
        $folder->user_id = $userId;
        $folder->title = $request->title;
        $folder->description = $request->description;
        $folder->status = $request->status;
        $folder->save();

        $data = [
            "status" => 200,
            "message" => "Folder created successfully",
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, $id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'nullable|max:255',
            'status' => 'required',
        ]);

        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);

        }

        $folder = Folder::find($id);
        if (!$folder) {
            $data = [
                "status" => 404,
                "message" => "Folder not found"
            ];
            return response()->json($data, 404);
        }

        if ($folder->user_id != $userId) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        if ($request->status != "public" && $request->status != "private") {
            $data = [
                "status" => 400,
                "message" => "Invalid input"
            ];

            return response()->json($data, 400);
        }

        $folder->title = $request->title;
        $folder->description = $request->description;
        $folder->status = $request->status;
        $folder->save();
        $data = [
            "status" => 200,
            "message" => "Folder updated successfully"
        ];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $userId = $user->id;

        $folder = Folder::find($id);
        if (!$folder) {
            $data = [
                "status" => 404,
                "message" => "Folder not found"
            ];
            return response()->json($data, 404);
        }

        if ($folder->user_id != $userId) {
            $data = [
                "status" => 403,
                "message" => "Unauthorized"
            ];
            return response()->json($data, 403);
        }

        $folder->delete();

        $data = [
            "status" => 200,
            "message" => "Folder deleted successfully"
        ];
        return response()->json($data, 200);
    }
}
