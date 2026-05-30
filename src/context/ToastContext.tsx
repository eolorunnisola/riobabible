import React, { createContext, useCallback, useContext, useState } from 'react';
import { Toast } from '@/src/components/ui/Toast';

type ToastMessage = { id: number; text: string };

type ToastContextValue = {
  showToast: (text: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string) => {
    setMessage({ id: Date.now(), text });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <Toast
          key={message.id}
          message={message.text}
          onHide={() => setMessage(null)}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
