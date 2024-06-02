import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Search } from "lucide-react";
import { useState } from "react";
import SearchResultContainer from "../SearchResultContainer";

export function SearchDialog() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [result, setResult] = useState<any[]>([]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl h-[90vh]">
        <DialogHeader>
          <div className="w-full relative mx-auto  sm:px-5">
            <Input type="text" className="" placeholder="Search" onChange={(e) => handleSearch(e)} />
            <Search className=" absolute right-3 sm:mr-5 top-1/2 w-5 h-5 cursor-pointer -translate-y-[50%] text-slate-500" />
          </div>
          <DialogTitle className="pt-5 text-start sm:px-5">Search: {searchTerm}</DialogTitle>
        </DialogHeader>

        {result.length === 0 ? (
          <div className="h-[20vh] w-full flex flex-col justify-center items-center gap-2">
            <LoaderCircle className="w-10 h-10 text-gray-400 animate-spin" />
            <p>Loading...</p>
          </div>
        ) : (
          <div className="overflow-auto w-full h-full px-1 sm:px-5">
            <SearchResultContainer handleSearchDialog={handleSearchDialog} />
          </div>
        )}
        <div className="overflow-auto w-full h-full px-1 sm:px-5">{/* <SearchResultContainer handleSearchDialog={handleSearchDialog} /> */}</div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
