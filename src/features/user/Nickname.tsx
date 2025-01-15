import { useAppSelector } from "@/app/store";
import { selectNickname } from "./userSlice";

export default function Nickname() {
  const nickname = useAppSelector((state) => selectNickname(state));

  return <p>{nickname}</p>;
}
