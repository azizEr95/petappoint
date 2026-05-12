import React, { useEffect } from "react";
import "@/styles/components/SuccessNotificationToast.scss";

type SuccessNotificationToastProps = {
  message: string;
  duration?: number; // ms
  onClose: () => void;
};

export const SuccessNotificationToast: React.FC<SuccessNotificationToastProps> = ({
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const id = setTimeout(() => onClose(), duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  return (
    <div className="success-notification-toast" role="status" aria-live="polite">
      <span className="toast-icon"><i className="bi bi-calendar-check"></i></span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Benachrichtigung schließen"
      ><i className="bi bi-x"></i></button>
    </div>
  );
};
