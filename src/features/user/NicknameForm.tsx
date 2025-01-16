import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store";
import { setNickname } from "./userSlice";
import useFocus from "@/common/hooks/useFocus";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";

export default function NicknameForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nicknameInputRef = useRef<HTMLInputElement | null>(null);

  useFocus(nicknameInputRef);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nicknameInputRef.current) return;

    if (!nicknameInputRef.current.value.trim()) {
      alert("Nickname should not be empty");
    }

    dispatch(setNickname(nicknameInputRef.current.value.trim()));

    navigate("/main");

    nicknameInputRef.current.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="w-[450px] flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          ref={nicknameInputRef}
          id="nickname"
          name="nickname"
          placeholder="Dave"
          required
        />
      </div>
      <Button type="submit">Enter</Button>
    </form>
  );
}
