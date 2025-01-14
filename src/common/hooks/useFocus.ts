import { useEffect } from "react";

type Ref = React.MutableRefObject<HTMLInputElement | null>;

export default function useFocus(ref: Ref) {
  useEffect(() => {
    if (!ref.current) return;

    ref.current.focus();
  }, []);
}
