import { useState, useCallback } from "react";

export default function useVisibleState(status?: boolean) {
  const [isVisible, setIsVisible] = useState(status || false);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    visible: isVisible,
    show,
    hide,
  };
}
