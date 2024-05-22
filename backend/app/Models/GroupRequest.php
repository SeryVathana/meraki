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
 * @method static \Database\Factories\GroupRequestFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest whereGroupId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GroupRequest whereUserId($value)
 * @mixin \Eloquent
 */
class GroupRequest extends Model
{
    use HasFactory;
}
