<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\SavedPost;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\FolderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Folder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder query()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereUserId($value)
 * @mixin \Eloquent
 */
class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'description',
        'title',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function saveposts()
    {
        return $this->hasMany(SavedPost::class);
    }
}
