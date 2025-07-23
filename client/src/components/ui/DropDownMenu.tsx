import { ReactElement } from "react";

type DropDownMenuProps = {
  menuItems: (ReactElement | null)[];
};

const DropDownMenu = ({ menuItems }: DropDownMenuProps) => {
  const menuClassName = `block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer`;

  return (
    <div className="absolute right-0 top-full mt-2 z-15 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow-sm w-44">
      <ul className="py-2 text-sm text-gray-700">
        {menuItems
          .filter((item) => item)
          .map((item, index) => (
            <li key={index} className={menuClassName}>
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DropDownMenu;
