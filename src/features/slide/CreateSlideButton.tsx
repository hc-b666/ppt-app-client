import { Button } from "@/common/components/ui/button";
import { useCreateSlideMutation } from "./slideService";
import { useParams } from "react-router-dom";
import { toast } from "@/common/hooks/use-toast";
import { useAppSelector } from "@/app/store";
import { selectAuthorToken } from "../ppt/presentationsSlice";

export default function CreateSlideButton() {
  const { id } = useParams();
  const [createSlide, { isLoading }] = useCreateSlideMutation();
  const authorToken = useAppSelector((state) => selectAuthorToken(state, id));

  const handleAddSlide = async () => {
    if (!authorToken || !id) return;

    try {
      const res = await createSlide({ pptId: id, authorToken }).unwrap();
      toast({ description: res.message });
    } catch (err) {
      toast({ description: "Something went wrong while adding slide" });
      console.log(err);
    }
  };

  return (
    <Button onClick={handleAddSlide} disabled={isLoading}>
      Add Slide
    </Button>
  );
}
