import { ReactElement } from "react";

type DropDownMenuProps = {
  menuItems: (ReactElement | null)[];
};

const DropDownMenu = ({ menuItems }: DropDownMenuProps) => {
  return (
    <div className="absolute right-0 top-full mt-2 z-15 bg-gray-200 rounded-lg shadow-sm w-44">
      <ul className="py-2 text-sm text-gray-700">
        {menuItems.filter(Boolean).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default DropDownMenu;
