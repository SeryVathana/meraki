<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/tag",
     *     operationId="getTagsList",
     *     tags={"UserTag"},
     *     summary="Get list of tags",
     *     description="Returns list of tags",
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
    public function index(Request $request)
    {
        $searchQuery = $request->query("q");



        $tags = Tag::orderBy("name")->where("name", "iLike", "%" . $searchQuery . "%")->get();
        return response()->json([
            "status" => 200,
            "tags" => $tags
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/tag/{id}",
     *     operationId="getTagById",
     *     tags={"UserTag"},
     *     summary="Get tag information",
     *     description="Returns tag data",
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
     *         description="Tag not found",
     *     )
     * )
     */
    public function show($id)
    {
        $tag = Tag::find($id);
        if (!$tag) {
            return response()->json([
                "status" => 404,
                "message" => "Tag not found"
            ], 404);
        }

        return response()->json([
            "status" => 200,
            "tag" => $tag
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/tag",
     *     operationId="createTag",
     *     tags={"UserTag"},
     *     summary="Create new tag",
     *     description="Returns the created tag",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"name"},
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Tag created successfully",
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
     *         response=422,
     *         description="Unprocessable Entity",
     *     )
     * )
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];
            return response()->json($data, 400);
        }

        $existedTag = Tag::where('name', $request->name)->first();
        if ($existedTag) {
            return response()->json([
                'status' => 400,
                'message' => 'Tag already exists',
            ], 400);
        }

        $tag = new Tag;
        $tag->name = $request->name;
        $tag->save();

        return response()->json([
            'status' => 200,
            'message' => 'Tag created successfully',
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/api/tag/{id}",
     *     operationId="updateTag",
     *     tags={"UserTag"},
     *     summary="Update existing tag",
     *     description="Returns the updated tag",
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
     *             required={"name"},
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tag
     *  updated successfully",
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
     *         description="Tag not found",
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Unprocessable Entity",
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $tag = Tag::find($id);

        if (!$tag) {
            return response()->json([
                'status' => 404,
                'message' => 'Tag not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];
            return response()->json($data, 400);
        }


        $existedTag = Tag::where("name", $request->name)->first();
        if ($existedTag && $existedTag->id != $id && $existedTag->name == $request->name) {
            return response()->json([
                'status' => 400,
                'message' => 'Tag already exists',
            ], 400);
        }

        $tag->name = $request->name;
        $tag->save();
        return response()->json([
            'status' => 200,
            'message' => 'Tag updated successfully'
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/tag/{id}",
     *     operationId="deleteTag",
     *     tags={"UserTag"},
     *     summary="Delete a tag",
     *     description="Deletes a tag and returns no content",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
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
     *         description="Tag not found",
     *     )
     * )
     */
    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Tag deleted successfully'
        ], 200);
    }
}
