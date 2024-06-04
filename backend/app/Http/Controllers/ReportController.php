<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    //For User 
    public function store(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'post_id' => 'nullable|max:255',
            'reason' => 'required',
        ]);
        if ($validator->fails()) {

            $data = [
                "status" => 400,
                "message" => $validator->messages()
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

    //For CRUD Admin
    //Get ALL Report
    public function adminIndex()
    {
        $reports = Report::all();
        return response()->json($reports);
    }

    //Get Report By postId
    public function adminShow($postId)
    {
        $report = Report::where('post_id', $postId)->get();
        if (!$report) {
            return response()->json(['error' => 'report not found'], 404);
        }

        return response()->json($report);
    }

    //Delete Report 
    public function adminDestroy($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['error' => 'report not found'], 404);
        }
        $report->delete();
        return response()->json(['message' => 'report deleted successfully']);
    }

}
