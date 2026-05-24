import { useCallback, useRef, useState } from 'react';
import type { ToastMessage, ToastTone } from '../components/ui/Toast.types';

export function useToast() {
  const idRef = useRef(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((text: string, tone: ToastTone = 'success') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, text, tone }]);
    return id;
  }, []);

  return { toasts, push, dismiss };
}
