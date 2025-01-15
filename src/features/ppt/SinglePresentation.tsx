import { useParams } from "react-router-dom";
import { useFindByIdQuery } from "./presentationService";
import useJoinPresentation from "./useJoinPresentation";

export default function SinglePresentation() {
  const { id } = useParams();

  const { status, users } = useJoinPresentation({ pptId: id });

  const { data, isLoading, isError, isSuccess, error } = useFindByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error);
  }

  console.log(users);

  return (
    <div>
      <p>{id}</p>
      <p>{status}</p>
      <div className="py-10">
        <h1>Online users</h1>
        {users.map((u) => (
          <p key={u.socketId}>{u.nickname}</p>
        ))}
      </div>
      {isSuccess && (
        <div>
          <h1>{data.title}</h1>
          <p>{data.author}</p>
        </div>
      )}
    </div>
  );
}
