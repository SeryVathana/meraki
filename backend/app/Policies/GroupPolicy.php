<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\GroupMember;
use App\Models\GroupInvite;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GroupPolicy
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
    public function view(User $user, Group $group): bool
    {

    }

    public function view_invite(User $user, Group $group): bool
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
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function create_invite(User $user, Group $group): bool
    {
        $authorized = false;

        // print_r($user->id);
        
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

    public function update(User $user, Group $group): bool
    {
        $authorized = false;

        // print_r($user->id);
        
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

    public function update_member(User $user, Group $group): bool
    {
        $authorized = false;

        $member = GroupMember::where("group_id", $group->id)->where("user_id", $user->id)->first();
        
        if($user->role == "admin") {
            $authorized = true;
        }

        if ($member->role == "admin") {   
            $authorized = true;
        }


        return $authorized;
    }

    public function accept_request(User $user, Group $group): bool
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
    public function delete(User $user, Group $group): bool
    {
        $authorized = false;

        // print_r($user->id);
        
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

    public function delete_invite(User $user, Group $group): bool
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
    public function restore(User $user, Group $group): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Group $group): bool
    {
        //
    }
}
