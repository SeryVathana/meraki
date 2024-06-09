import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getToken } from "@/utils/HelperFunctions";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
const UserSearchPage = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
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
    return (_jsxs("div", { children: [_jsx("input", { value: searchQuery, onChange: (e) => setSearchParams(new URLSearchParams({ search: e.target.value })) }), _jsx("button", { onClick: searchUsers, children: "Search" }), _jsx("ul", { children: users?.map((user) => (_jsx("li", { children: user.first_name }, user.id))) })] }));
};
export default UserSearchPage;
