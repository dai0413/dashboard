import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { useAlert } from "../../../../context/alert-context";
import { useAuth } from "../../../../context/auth-context";
import { isDev } from "../../../../utils/env";
import { useModal } from "../../../../context/modal-context";

const CopyButton = () => {
  const { detail } = useModal();
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const { staffState } = useAuth();

  return (
    <>
      {(staffState.admin || isDev) && (
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 px-2 hover:cursor-pointer"
          title="id_copy"
          onClick={() => {
            if (!detail.id)
              return handleSetAlert({
                success: false,
                message: `${detail.modelType}のidコピーに失敗しました`,
              });
            navigator.clipboard.writeText(detail.id);
            handleSetAlert({
              success: true,
              message: `${detail.modelType}のidをコピーしました`,
            });
          }}
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default CopyButton;
