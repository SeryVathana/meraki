<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("group_id")->nullable();
            $table->string("title")->nullable();
            $table->string("description")->nullable();
            $table->string("img_url");
            $table->string("status")->default("public");
            $table->boolean('is_highlighted')->default(false);
            $table->timestamps();
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
