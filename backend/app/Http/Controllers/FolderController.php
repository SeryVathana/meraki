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

     /**
     * @OA\Get(
     *     path="/api/folder",
     *     operationId="getFolder",
     *     tags={"UserFolder"},
     *     summary="Get list of Folders",
     *     description="Returns list of Folders",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items()
     *         ),
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *     )
     * )
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

       /**
     * @OA\Post(
     *     path="/api/folder",
     *     operationId="storeFolder",
     *     tags={"UserFolder"},
     *     summary="Create Folder ",
     *     description="Creates a Folder ",
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
     *             required={"description", "title", "status", "user_id"},
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="status", type="string"),
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

     /**
     * Update the specified resource in storage.
     * @OA\Put(
     *     path="/api/folder/{id}",
     *     operationId="updateFolder",
     *     tags={"UserFolder"},
     *     summary="Update Folder ",
     *     description="Updates a specific Folder ",
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
     *             required={"description", "title", "status"},
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="status", type="string")
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
     /**
     * Remove the specified resource from storage.
     * @OA\Delete(
     *     path="/api/folder/{id}",
     *     operationId="deleteFolder",
     *     tags={"UserFolder"},
     *     summary="Delete Folder ",
     *     description="Deletes a specific Folder ",
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
