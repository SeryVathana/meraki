<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::all();
        return response()->json([
            "status" => 200,
            "tags" => $tags
        ], 200);
    }

    // Get a single tag by ID
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

    // Create a new tag
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

    // Update an existing tag
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

    // Delete a tag
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
