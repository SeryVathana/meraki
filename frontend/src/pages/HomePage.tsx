import { Button } from "@/components/ui/button.js";
import { data } from "../db/mock-post.js";
import { Pin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HomePage = () => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4 mt-10">
      {data.map((post, index) => {
        return (
          <div className="group relative">
            <img className=" rounded-xl w-full bg-gray-300" src={post.img_url} alt="" key={index} />
            <div className="hidden group-hover:flex">
              <div className="absolute top-0 left-0 w-full h-full rounded-xl opacity-50 bg-gray-900" />
              <Button variant={"default"} className="bg-red-500 px-3 py-2 absolute top-3 right-3">
                <Pin className="w-5 h-5" />
              </Button>

              <div className="absolute bottom-3 left-3 flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col text-white ">
                  <h1 className="font-medium">Sery Vathana</h1>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
