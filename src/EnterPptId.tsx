type PptId = {
  presentationId: string;
};

export default function EnterPptId({
  handleEnterPresentation,
}: {
  handleEnterPresentation: (presentationId: string) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as PptId;

    handleEnterPresentation(data.presentationId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="presentationId"
          type="text"
          placeholder="Enter presentation ID"
        />
        <button>Enter</button>
      </form>
    </div>
  );
}
