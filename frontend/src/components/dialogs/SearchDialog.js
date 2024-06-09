import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Search } from "lucide-react";
import { useState } from "react";
import SearchResultContainer from "../SearchResultContainer";
export function SearchDialog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [result, setResult] = useState([]);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSearchDialog = () => {
        setOpenDialog(false);
    };
    return (_jsxs(Dialog, { open: openDialog, onOpenChange: () => setOpenDialog(!openDialog), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", children: _jsx(Search, { className: "w-5 h-5" }) }) }), _jsxs(DialogContent, { className: "max-w-screen-xl h-[90vh] flex flex-col", children: [_jsxs(DialogHeader, { className: "h-fit", children: [_jsxs("div", { className: "w-full relative mx-auto  sm:px-5", children: [_jsx(Input, { type: "text", className: "", placeholder: "Search", onChange: (e) => handleSearch(e) }), _jsx(Search, { className: " absolute right-3 sm:mr-5 top-1/2 w-5 h-5 cursor-pointer -translate-y-[50%] text-slate-500" })] }), _jsxs(DialogTitle, { className: "pt-5 text-start sm:px-5", children: ["Search: ", searchTerm] })] }), result.length !== 0 ? (_jsxs("div", { className: "h-[20vh] w-full flex flex-col justify-center items-center gap-2", children: [_jsx(LoaderCircle, { className: "w-10 h-10 text-gray-400 animate-spin" }), _jsx("p", { children: "Loading..." })] })) : (_jsx("div", { className: "overflow-auto w-full h-full px-1 sm:px-5", children: _jsx(SearchResultContainer, { searchQuery: searchTerm }) }))] })] }));
}
export default SearchDialog;
