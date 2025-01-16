import { useAppSelector } from "@/app/store";
import { useParams } from "react-router-dom";

export default function useVerifyAuthor(): boolean {
  const { id } = useParams();

  const isAuthor = useAppSelector((state) => {
    if (!id) return false;
    return state.presentations.presentations.some(
      (ppt) => ppt.presentationId === id
    );
  });

  return isAuthor;
}
