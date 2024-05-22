<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property int $post_id
 * @property int $folder_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\SavedPostFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost query()
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost whereFolderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SavedPost whereUserId($value)
 * @mixin \Eloquent
 */
class SavedPost extends Model
{
    use HasFactory;
}
