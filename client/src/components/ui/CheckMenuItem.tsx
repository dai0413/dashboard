type CheckMenuItemProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

const CheckMenuItem = ({ label, checked, onChange }: CheckMenuItemProps) => {
  return (
    <div
      onClick={onChange}
      className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      <span>{label}</span>
      <input type="checkbox" checked={checked} readOnly />
    </div>
  );
};

export default CheckMenuItem;
