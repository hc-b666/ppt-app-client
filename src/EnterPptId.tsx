import socket from "./socket";

type PptId = {
  presentationId: string;
};

export default function EnterPptId({}: {}) {
  const nickname = localStorage.getItem("nickname");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as PptId;

    socket.emit("joinPresentation", data.presentationId, nickname);

    socket.on("presentationJoined", (res) => {
      if (res.success) {
        console.log(res);
        console.log("Presentation joined successfully:", res.presentation);
        localStorage.setItem("pptId", res.presentation._id);
      } else {
        console.error("Error joining presentation:", res.error);
      }
    });
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
