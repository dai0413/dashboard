import { useEffect, useState } from "react";
import { ResponseStatus } from "../../types/types";

const Alert = ({ success, message }: ResponseStatus) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (success && message) {
      setIsOpen(true);

      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000); // 3秒後に閉じる

      return () => clearTimeout(timer); // クリーンアップ
    }

    if (!success && message) {
      setIsOpen(true); // エラーは自動で閉じずにユーザーが手動で閉じる
    }
  }, [success, message]);

  const renderMessage = (success: boolean, message: string) => {
    const bgColor = success ? "bg-green-100" : "bg-red-100";
    const borderColor = success ? "border-green-400" : "border-red-400";
    const textColor = success ? "text-green-700" : "text-red-700";
    const iconColor = success ? "text-green-500" : "text-red-500";

    return (
      <div
        className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative`}
        role="alert"
      >
        <strong className="font-bold">{message}</strong>
        <span
          className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className={`fill-current h-6 w-6 ${iconColor}`}
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    );
  };

  if (isOpen && success && message) return renderMessage(true, message);
  if (isOpen && !success && message) return renderMessage(false, message);

  return <></>;
};

export default Alert;
