<?php

namespace App\Http\Controllers;

use App\Models\SavedPost;
use App\Http\Requests\StoreSavedPostRequest;
use App\Http\Requests\UpdateSavedPostRequest;

class SavedPostController extends Controller
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
     * Store a newly created resource in storage.
     */
    public function store(StoreSavedPostRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SavedPost $savedPost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SavedPost $savedPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSavedPostRequest $request, SavedPost $savedPost)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SavedPost $savedPost)
    {
        //
    }
}
