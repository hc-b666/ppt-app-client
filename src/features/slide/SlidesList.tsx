import { useParams } from "react-router-dom";
import { useFindAllSlidesQuery } from "./slideService";
import CreateSlideButton from "./CreateSlideButton";
import useVerifyAuthor from "../ppt/useVerifyAuthor";

export default function SlidesList() {
  const { id } = useParams();
  const { data, isLoading, isError, isSuccess, error } =
    useFindAllSlidesQuery(id);
  const isAuthor = useVerifyAuthor();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error);
  }

  return (
    <div className="col-span-1 flex flex-col gap-3">
      {isSuccess &&
        data.map((slide) => (
          <div className="p-4 border rounded-md h-32" key={slide.id}>
            {slide.order}
          </div>
        ))}
      {isAuthor && <CreateSlideButton />}
    </div>
  );
}
