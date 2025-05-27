import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        {onClose && (
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}

        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default Modal;
