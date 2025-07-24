import { Loader2 } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
    </div>
  );
};

export default FullScreenLoader;
