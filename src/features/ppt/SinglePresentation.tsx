import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFindByIdQuery } from "./presentationService";
import useVerifyAuthor from "./useVerifyAuthor";
import { Skeleton } from "@/common/components/ui/skeleton";
import EditTitleDialog from "./EditTitleDialog";

export default function SinglePresentation() {
  const { id } = useParams();
  const { data, isLoading, isError, isSuccess, error } = useFindByIdQuery(id);
  const isAuthor = useVerifyAuthor();

  useEffect(() => {
    if (!isSuccess) return;
    document.title = `PPT App | ${data.title}`;
  }, [data, isSuccess]);

  if (isError) {
    console.log(error);
  }

  return (
    <div className="flex items-center justify-between">
      {isLoading && (
        <>
          <Skeleton className="w-80 h-12" />
          <Skeleton className="w-40 h-8" />
        </>
      )}
      {isSuccess && (
        <>
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-medium">{data.title}</h2>
            {isAuthor && <EditTitleDialog title={data.title} />}
          </div>
          <p>Author: {data.author}</p>
        </>
      )}
    </div>
  );
}
