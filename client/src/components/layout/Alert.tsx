import { useEffect, useState } from "react";
import { useAlert } from "../../context/alert-context";

const Alert = () => {
  const { message, error } = useAlert();

  const [errMesDisplay, setErrMesDisplay] = useState<boolean>(false);
  const [sucMesDisplay, setSucMesDisplay] = useState<boolean>(false);

  useEffect(() => {
    console.log(message);
    if (message) {
      setSucMesDisplay(true);

      const timer = setTimeout(() => {
        setSucMesDisplay(false);
      }, 5000); // 10秒後に消える

      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [message]);

  useEffect(() => {
    console.log(error);
    if (error.error?.message) {
      setErrMesDisplay(true);
    }
  }, [error.error]);

  const renderMessage = (error: boolean, message: string) => {
    const color = error ? "red" : "green";
    const bgColor = `bg-${color}-100`;
    const borderColor = `border-${color}-400`;
    const textColor = `text-${color}-700`;
    const iconColor = `text-${color}-500`;

    return (
      <div
        className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative`}
        role="alert"
      >
        <strong className="font-bold">{message}</strong>
        <span
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => setErrMesDisplay(false)}
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

  if (error.error?.message && errMesDisplay)
    return renderMessage(true, error.error?.message);

  if (message && sucMesDisplay) return renderMessage(false, message);

  return <></>;
};

export default Alert;
