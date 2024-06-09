import { User } from "@/redux/slices/authSlice";
import { getToken } from "@/utils/HelperFunctions";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const UserSearchPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);

  const searchQuery = searchParams.get("search");

  const searchUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/search/user?term=${searchQuery}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();
    setUsers(data.users);
  };

  useEffect(() => {
    //set search query to url

    searchUsers();
  }, [searchQuery]);

  return (
    <div>
      <input value={searchQuery} onChange={(e) => setSearchParams(new URLSearchParams({ search: e.target.value }))} />
      <button onClick={searchUsers}>Search</button>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.first_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchPage;
