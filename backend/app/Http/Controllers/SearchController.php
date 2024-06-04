<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function advancedsearch(Request $request)
    {
        $title = $request->input('title');
        $description = $request->input('description');

        $query = Post::table('posts');

        if ($title) {
            $query->where('title', 'LIKE', "%{$title}%");
        }

        if ($description) {
            $query->where('description', 'LIKE', "%{$description}%");
        }

        $posts = $query->paginate(10);

        return response()->json($posts); 
    }
}
