<?php

namespace App\Policies;

use App\Models\GroupInvite;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GroupInvitePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, GroupInvite $groupInvite): bool
    {
        
        $authorized = false;
        
        $member = GroupMember::where("group_id", $group->id)->where("user_id", $user->id)->get();
        $memberCount = $member->count();

        if($user->role == "admin") {
            $authorized = true;
        }

        if ($memberCount > 0 && $member[0]->role == "admin") {   
            $authorized = true;
        }


        return $authorized;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        $authorized = false;
        
        $member = GroupMember::where("group_id", $group->id)->where("user_id", $user->id)->get();
        $memberCount = $member->count();

        if($user->role == "admin") {
            $authorized = true;
        }

        if ($memberCount > 0 && $member[0]->role == "admin") {   
            $authorized = true;
        }


        return $authorized;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, GroupInvite $groupInvite): bool
    {
        $authorized = false;
        
        $member = GroupMember::where("group_id", $group->id)->where("user_id", $user->id)->get();
        $memberCount = $member->count();

        if($user->role == "admin") {
            $authorized = true;
        }

        if ($memberCount > 0 && $member[0]->role == "admin") {   
            $authorized = true;
        }


        return $authorized;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, GroupInvite $groupInvite): bool
    {
        $authorized = false;
        
        $member = GroupMember::where("group_id", $group->id)->where("user_id", $user->id)->get();
        $memberCount = $member->count();

        if($user->role == "admin") {
            $authorized = true;
        }

        if ($memberCount > 0 && $member[0]->role == "admin") {   
            $authorized = true;
        }


        return $authorized;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, GroupInvite $groupInvite): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, GroupInvite $groupInvite): bool
    {
        //
    }
}
