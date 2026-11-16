import React from 'react';

interface ToastProps {
  mensaje: string | null;
  onCerrar?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ mensaje }) => {
  if (!mensaje) return null;

  return (
    <div className="toast-notificacion" role="status" aria-live="polite">
      <span>☕</span>
      <span>{mensaje}</span>
    </div>
  );
};
