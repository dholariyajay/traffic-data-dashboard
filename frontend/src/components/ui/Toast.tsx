import { useEffect } from 'react';
import type { ToastMessage } from './Toast.types';

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export default function ToastStack({ toasts, onDismiss }: Props) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles =
    toast.tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-red-200 bg-red-50 text-red-900';

  return (
    <div
      className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${styles}`}
    >
      {toast.text}
    </div>
  );
}
