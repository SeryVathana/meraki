<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/report",
     *     operationId="createReport",
     *     tags={"UserReport"},
     *     summary="Create new report",
     *     description="Returns the created report",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"reason"},
     *             @OA\Property(property="reason", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Report created successfully",
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
    // For User 
    public function store(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'post_id' => 'nullable|max:255',
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            $data = [
                "status" => 400,
                "message" => $validator->messages()
            ];

            return response()->json($data, 400);
        }

        if ($request->has('status') && $request->status != "public" && $request->status != "private") {
            $data = [
                "status" => 400,
                "message" => "Invalid input"
            ];

            return response()->json($data, 400);
        }

        $report = new Report;
        $report->user_id = $userId;
        $report->post_id = $request->post_id;
        $report->reason = $request->reason;
        $report->save();

        $data = [
            "status" => 200,
            "message" => "Report created successfully",
        ];

        return response()->json($data, 200);
    }

    // For CRUD Admin
    // Get ALL Report
    /**
     * @OA\Get(
     *     path="/api/report",
     *     operationId="getReportsList",
     *     tags={"AdminReport"},
     *     summary="Get list of reports",
     *     description="Returns list of reports",
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
    public function adminIndex()
    {
        $reports = Report::all();
        return response()->json($reports);
    }

    // Get Report By postId
    /**
     * @OA\Get(
     *     path="/api/report/{postId}",
     *     operationId="getReportById",
     *     tags={"AdminReport"},
     *     summary="Get report information",
     *     description="Returns report data",
     *     @OA\Parameter(
     *         name="postId",
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
     *         description="Report not found",
     *     )
     * )
     */
    public function adminShow($postId)
    {
        $report = Report::where('post_id', $postId)->first();
        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }

        return response()->json($report);
    }

    // Delete Report 
    /**
     * @OA\Delete(
     *     path="/api/report/{id}",
     *     operationId="deleteReport",
     *     tags={"AdminReport"},
     *     summary="Delete a report",
     *     description="Deletes a report and returns no content",
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
     *         description="Report not found",
     *     )
     * )
     */
    public function adminDestroy($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }
        $report->delete();
        return response()->json(['message' => 'Report deleted successfully'], 204);
    }
}
