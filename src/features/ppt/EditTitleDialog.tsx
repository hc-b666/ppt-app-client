import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { useUpdateTitleMutation } from "./presentationService";
import { selectAuthorToken } from "./presentationsSlice";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { toast } from "@/common/hooks/use-toast";
import { Button } from "@/common/components/ui/button";
import { Pencil } from "lucide-react";

export default function EditTitleDialog({ title }: { title: string }) {
  const { id } = useParams();
  const authorToken = useAppSelector((state) => selectAuthorToken(state, id));
  const [newTitle, setNewTitle] = useState(title);
  const [updateTitle, { isLoading }] = useUpdateTitleMutation();

  const handleUpdate = async () => {
    if (!id || !authorToken) return;

    try {
      const res = await updateTitle({
        pptId: id,
        title: newTitle,
        authorToken,
      }).unwrap();
      toast({ description: res.message });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change title</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={() => handleUpdate()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
