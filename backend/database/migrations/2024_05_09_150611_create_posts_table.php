<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("group_id")->nullable();
            $table->string("title");
            $table->string("description");
            $table->string("img_url");
            $table->string("status");
            $table->string("tag");
            $table->json("likes");
            $table->timestamps();
            $table->boolean('is_highlighted')->default(false);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');

    }
};
