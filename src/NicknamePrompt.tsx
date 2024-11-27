import { useNavigate } from "react-router-dom";

function NicknamePrompt({
  nickname,
  setNickname,
}: {
  nickname: string;
  setNickname: (nickname: string) => void;
}) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      localStorage.setItem("nickname", nickname);
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Enter your nickname</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NicknamePrompt;
