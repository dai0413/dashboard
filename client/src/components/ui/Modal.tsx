import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children, header, footer }: ModalProps) => {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-start justify-center pt-[10vh]">
      <div className="relative bg-white rounded-lg shadow-lg w-[80%] max-w-2xl sm:w-full h-[80vh] flex flex-col">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}

        {/* Header */}
        {header && (
          <div className="flex-shrink-0 w-full p-4 border-dotted border-b border-gray-800">
            {header}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 w-full p-4 border-dotted border-t border-gray-800 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default Modal;
