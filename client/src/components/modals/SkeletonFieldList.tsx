export const SkeletonFieldList: React.FC<{ rows?: number }> = ({
  rows = 6,
}) => (
  <div className="space-y-2 text-sm text-gray-700 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex justify-between border-b py-1 items-center">
        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);
