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
  const [openAddAlert, setOpenAddAlert] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddError, setIsAddError] = useState<boolean>(false);
  const [addErrMsg, setAddErrMsg] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        } else {
          if (data.message == "Tag already exists") {
            setIsAddError(true);
            setAddErrMsg("Category already exists");
          } else {
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

  return (
    <main className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <div className="w-auto flex gap-3 items-center">
          <Input
            type="text"
            placeholder="Search by name"
            className="w-[500px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="button" variant={"secondary"} onClick={handleFetchCategories}>
            <div className="flex items-center gap-1">
              <Search className="w-4 mr-2" />
              Search
            </div>
          </Button>
        </div>
        <Dialog open={openAddAlert} onOpenChange={setOpenAddAlert}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Enter new category information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description">Category Name</Label>
                <div className="relative col-span-3">
                  <Input
                    id="description"
                    placeholder="category name"
                    className=""
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  {isAddError && <p className="absolute text-sm text-destructive pt-1">{addErrMsg}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant="secondary" onClick={() => setOpenAddAlert(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => handleAddCategory()}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="py-4">
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">index</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead className="hidden md:table-cell">Updated at</TableHead>
                <TableHead>
                  <span className="">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category, index) => (
                <CategoryItem key={index} category={category} index={index} handleFetchCategories={handleFetchCategories} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing
            <strong>1-10</strong> of <strong>32</strong>
            products
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

const CategoryItem = ({ category, index, handleFetchCategories }) => {
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [openRemoveAlert, setOpenRemoveAlert] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [name, setName] = useState<string>(category.name);
  const [isEditError, setIsEditError] = useState<boolean>(false);
  const [editErrMsg, setEditErrMsg] = useState<string>("");

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
        } else {
          if (data.message == "Tag already exists") {
            setIsEditError(true);
            setEditErrMsg("Category already exists");
          } else {
            setIsEditError(true);
            setEditErrMsg("Something went wrong. Please try again");
          }
        }
      });
  };
  return (
    <TableRow className="">
      <TableCell className="hidden sm:table-cell">{index + 1}</TableCell>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell className="hidden md:table-cell">{format(new Date(category.created_at), "Pp")}</TableCell>
      <TableCell className="hidden md:table-cell">{format(new Date(category.updated_at), "Pp")}</TableCell>
      <TableCell>
        <DropdownMenu open={openDropDown} onOpenChange={setOpenDropDown}>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <div className="flex items-center gap-2">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog open={openEditDialog} onOpenChange={() => setOpenEditDialog(!openEditDialog)}>
              <DialogTrigger asChild>
                <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
                  <span>Edit</span>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Edit Category</DialogTitle>
                <div className="space-y-10">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description">Category Name</Label>
                    <div className="col-span-3">
                      <Input id="description" placeholder={category.name} value={name} onChange={(e) => setName(e.target.value)} />
                      {isEditError && <p className="absolute text-sm text-destructive pt-1">{editErrMsg}</p>}
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setName(category.name);
                        setOpenEditDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="default" onClick={() => handleEditCategory()}>
                      Save change
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={openRemoveAlert} onOpenChange={() => setOpenRemoveAlert(!openRemoveAlert)}>
              <DialogTrigger asChild>
                <div className="flex gap-2 justify-start items-center py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm">
                  <span>Delete</span>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>Are you sure you want to delete this category? This action cannot be undone.</DialogDescription>
                <div className="flex gap-5 justify-end">
                  <Button variant="outline" onClick={() => setOpenRemoveAlert(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => handleRemoveCategory()}>
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default DashboardCategoriesPage;
