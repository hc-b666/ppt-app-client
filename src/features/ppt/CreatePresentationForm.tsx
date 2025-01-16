import { useNavigate } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "@/app/store";
import { useCreatePresentationMutation } from "./presentationService";
import { toast } from "@/common/hooks/use-toast";
import { Label } from "@/common/components/ui/label";
import { Input } from "@/common/components/ui/input";
import { Textarea } from "@/common/components/ui/textarea";
import { Button } from "@/common/components/ui/button";

interface CreatePresentationBody {
  title: string;
  description?: string;
}

export default function CreatePresentationForm() {
  const navigate = useNavigate();
  const nickname = useAppSelector((state) => state.user.nickname);
  const [create, { isLoading }] = useCreatePresentationMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePresentationBody>();

  const onSubmit: SubmitHandler<CreatePresentationBody> = async (data) => {
    if (!nickname) {
      toast({ description: "You have to set nickname to create presentation" });
      return;
    }

    try {
      const res = await create({
        title: data.title,
        description: data.description,
        author: nickname,
      }).unwrap();
      navigate(
        `/main/presentations/${res.data.presentationId}?authorToken=${res.data.authorToken}`
      );
      toast({ description: res.message });
    } catch (err) {
      console.log("CreatePresentationForm onSubmit()", err);
      toast({ variant: "destructive", description: "Something went wrong" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[450px] flex flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Presentation title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title?.message && (
          <span className="text-xs text-red-500">{errors.title.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Presentation description"
          {...register("description")}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating" : "Create Presentation"}
      </Button>
    </form>
  );
}
