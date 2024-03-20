import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useState } from "react";
import PostsContainer from "../PostsContainer";

export function SearchDialog() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl h-[90vh]">
        <DialogHeader>
          <div className="w-[500px] relative mx-auto">
            <Input type="text" placeholder="Search" onChange={(e) => handleSearch(e)} />
            <Search className=" absolute right-3 top-1/2 w-5 h-5 cursor-pointer -translate-y-[50%] text-slate-500" />
          </div>
          <DialogTitle>Search: {searchTerm}</DialogTitle>
        </DialogHeader>

        <div className="overflow-auto w-full h-full px-5">
          <PostsContainer />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
