import { ChevronDown, X } from "lucide-react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter, getToken } from "@/utils/HelperFunctions";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export type Tag = {
  id: number;
  name: string;
};

function TagDropDown({ selectedTags, setSelectedTags }: { selectedTags: any[]; setSelectedTags: any }) {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/tag", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTags(data.tags);
      });
  }, []);

  const handleSetTags = (selectedTag: Tag) => {
    // add new tag if it doesn't exist and remove if it does exist
    if (selectedTags.some((obj) => obj.id == selectedTag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id != selectedTag.id));
    } else {
      setSelectedTags([...selectedTags, selectedTag]);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col gap-3">
      <Label>Post Tags</Label>

      {selectedTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedTags?.map((tag, i) => (
            <div key={i} className="flex items-center justify-center gap-1 mr-3 bg-gray-100 px-3 py-1 rounded-full">
              <p className="text-xs">{capitalizeFirstLetter(tag.name)}</p>
              <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))} />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-fit" asChild>
            <Button variant="outline" className="">
              Select Tags <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {tags.map((tag, i) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                onClick={() => handleSetTags({ name: tag.name, id: tag.id })}
                checked={selectedTags.some((obj) => obj.id == tag.id)}
              >
                <div className="flex items-center gap-2 mr-3">
                  <p>{tag.name}</p>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TagDropDown;
