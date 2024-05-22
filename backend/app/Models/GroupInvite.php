<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property int $group_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\GroupInviteFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite query()
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite whereGroupId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupInvite whereUserId($value)
 * @mixin \Eloquent
 */
class GroupInvite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'group_id'
    ];
}
