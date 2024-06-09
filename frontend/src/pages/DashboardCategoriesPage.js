import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Import your Dialog components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getToken } from "@/utils/HelperFunctions";
import { format } from "date-fns";
import { MoreHorizontalIcon, PlusCircleIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
const DashboardCategoriesPage = () => {
    const [openAddAlert, setOpenAddAlert] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [isAddError, setIsAddError] = useState(false);
    const [addErrMsg, setAddErrMsg] = useState("");
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const handleFetchCategories = async () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tag?` + new URLSearchParams({ q: searchQuery }), {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        })
            .then((response) => response.json())
            .then((data) => setCategories(data.tags));
    };
    const handleAddCategory = () => {
        if (newCategory.trim() === "") {
            setIsAddError(true);
            setAddErrMsg("Category name is required");
            return;
        }
        const reqBody = {
            name: newCategory.trim(),
        };
        fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tag`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(reqBody),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                handleFetchCategories();
                setOpenAddAlert(false);
                setNewCategory("");
            }
            else {
                if (data.message == "Tag already exists") {
                    setIsAddError(true);
                    setAddErrMsg("Category already exists");
                }
                else {
                    setIsAddError(true);
                    setAddErrMsg("Something went wrong. Please try again");
                }
            }
        });
    };
    useEffect(() => {
        if (searchQuery.length >= 1) {
            return;
        }
        handleFetchCategories();
    }, [searchQuery]);
    return (_jsxs("main", { className: "grid flex-1 items-start gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "w-auto flex gap-3 items-center", children: [_jsx(Input, { type: "text", placeholder: "Search by name", className: "w-[500px]", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Button, { type: "button", variant: "secondary", onClick: handleFetchCategories, children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Search, { className: "w-4 mr-2" }), "Search"] }) })] }), _jsxs(Dialog, { open: openAddAlert, onOpenChange: setOpenAddAlert, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "gap-1", children: [_jsx(PlusCircleIcon, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Add Category" })] }) }), _jsxs(DialogContent, { className: "sm:max-w-[625px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Add New Category" }), _jsx(DialogDescription, { children: "Enter new category information" })] }), _jsx("div", { className: "grid gap-4 py-4", children: _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", children: "Category Name" }), _jsxs("div", { className: "relative col-span-3", children: [_jsx(Input, { id: "description", placeholder: "category name", className: "", value: newCategory, onChange: (e) => setNewCategory(e.target.value) }), isAddError && _jsx("p", { className: "absolute text-sm text-destructive pt-1", children: addErrMsg })] })] }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "submit", variant: "secondary", onClick: () => setOpenAddAlert(false), children: "Cancel" }), _jsx(Button, { type: "submit", onClick: () => handleAddCategory(), children: "Add" })] })] })] })] }), _jsxs(Card, { "x-chunk": "dashboard-06-chunk-0", children: [_jsx(CardHeader, { className: "py-4", children: _jsx(CardTitle, { children: "Categories" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "hidden w-[100px] sm:table-cell", children: _jsx("span", { className: "sr-only", children: "index" }) }), _jsx(TableHead, { children: "Name" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Created at" }), _jsx(TableHead, { className: "hidden md:table-cell", children: "Updated at" }), _jsx(TableHead, { children: _jsx("span", { className: "", children: "Actions" }) })] }) }), _jsx(TableBody, { children: categories?.map((category, index) => (_jsx(CategoryItem, { category: category, index: index, handleFetchCategories: handleFetchCategories }, index))) })] }) }), _jsx(CardFooter, { children: _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Showing", _jsx("strong", { children: "1-10" }), " of ", _jsx("strong", { children: "32" }), "products"] }) })] })] }));
};
const CategoryItem = ({ category, index, handleFetchCategories }) => {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openRemoveAlert, setOpenRemoveAlert] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [name, setName] = useState(category.name);
    const [isEditError, setIsEditError] = useState(false);
    const [editErrMsg, setEditErrMsg] = useState("");
    const handleRemoveCategory = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tag/${category.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                handleFetchCategories();
                setOpenRemoveAlert(false);
                setOpenDropDown(false);
            }
        });
    };
    const handleEditCategory = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/admin/tag/${category.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ name: name, id: category.id }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status == 200) {
                handleFetchCategories();
                setOpenEditDialog(false);
                setOpenDropDown(false);
            }
            else {
                if (data.message == "Tag already exists") {
                    setIsEditError(true);
                    setEditErrMsg("Category already exists");
                }
                else {
                    setIsEditError(true);
                    setEditErrMsg("Something went wrong. Please try again");
                }
            }
        });
    };
    return (_jsxs(TableRow, { className: "", children: [_jsx(TableCell, { className: "hidden sm:table-cell", children: index + 1 }), _jsx(TableCell, { className: "font-medium", children: category.name }), _jsx(TableCell, { className: "hidden md:table-cell", children: format(new Date(category.created_at), "Pp") }), _jsx(TableCell, { className: "hidden md:table-cell", children: format(new Date(category.updated_at), "Pp") }), _jsx(TableCell, { children: _jsxs(DropdownMenu, { open: openDropDown, onOpenChange: setOpenDropDown, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { "aria-haspopup": "true", size: "icon", variant: "ghost", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MoreHorizontalIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Toggle menu" })] }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsxs(Dialog, { open: openEditDialog, onOpenChange: () => setOpenEditDialog(!openEditDialog), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: _jsx("span", { children: "Edit" }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Edit Category" }), _jsxs("div", { className: "space-y-10", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", children: "Category Name" }), _jsxs("div", { className: "col-span-3", children: [_jsx(Input, { id: "description", placeholder: category.name, value: name, onChange: (e) => setName(e.target.value) }), isEditError && _jsx("p", { className: "absolute text-sm text-destructive pt-1", children: editErrMsg })] })] }), _jsxs("div", { className: "flex gap-4 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                                                        setName(category.name);
                                                                        setOpenEditDialog(false);
                                                                    }, children: "Cancel" }), _jsx(Button, { variant: "default", onClick: () => handleEditCategory(), children: "Save change" })] })] })] })] }), _jsxs(Dialog, { open: openRemoveAlert, onOpenChange: () => setOpenRemoveAlert(!openRemoveAlert), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("div", { className: "flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm", children: _jsx("span", { children: "Delete" }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Delete Category" }), _jsx(DialogDescription, { children: "Are you sure you want to delete this category? This action cannot be undone." }), _jsxs("div", { className: "flex gap-5 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => setOpenRemoveAlert(false), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => handleRemoveCategory(), children: "Delete" })] })] })] })] })] }) })] }));
};
export default DashboardCategoriesPage;
