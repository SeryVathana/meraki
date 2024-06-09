import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, X } from "lucide-react";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
function TagDropDown({ selectedTags, setSelectedTags }) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/tag`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => res.json())
            .then((data) => {
            setTags(data.tags);
        });
    }, []);
    const handleSetTags = (selectedTag) => {
        // add new tag if it doesn't exist and remove if it does exist
        if (selectedTags.some((obj) => obj.id == selectedTag.id)) {
            setSelectedTags(selectedTags.filter((t) => t.id != selectedTag.id));
        }
        else {
            setSelectedTags([...selectedTags, selectedTag]);
        }
    };
    useEffect(() => { }, []);
    return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Label, { children: "Post Tags" }), selectedTags.length > 0 && (_jsx("div", { className: "flex gap-2 flex-wrap", children: selectedTags?.map((tag, i) => (_jsxs("div", { className: "flex items-center justify-center gap-1 mr-3 bg-gray-100 px-3 py-1 rounded-full", children: [_jsx("p", { className: "text-xs", children: capitalizeFirstLetter(tag.name) }), _jsx(X, { className: "h-4 w-4 cursor-pointer", onClick: () => setSelectedTags(selectedTags.filter((t) => t.id !== tag.id)) })] }, i))) })), _jsx("div", { className: "flex gap-5 ", children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { className: "w-fit", asChild: true, children: _jsxs(Button, { variant: "outline", className: "", children: ["Select Tags ", _jsx(ChevronDown, { className: "ml-2 h-4 w-4" })] }) }), _jsx(DropdownMenuContent, { className: "max-h-[200px] overflow-auto", children: tags.map((tag, i) => (_jsx(DropdownMenuCheckboxItem, { onClick: () => handleSetTags({ name: tag.name, id: tag.id }), checked: selectedTags.some((obj) => obj.id == tag.id), children: _jsx("div", { className: "flex items-center gap-2 mr-3", children: _jsx("p", { children: tag.name }) }) }, tag.id))) })] }) })] }));
}
export default TagDropDown;
