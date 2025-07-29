import { BottomMenuItems } from "../../constants/menuItems";
import { IconButton } from "../buttons";

const Footer = () => {
  return (
    <>
      {/* PC 用フッター（md以上で表示） */}
      <footer className="hidden md:block text-gray-600 body-font">
        <div className="container px-5 py-4 mx-auto flex items-center">
          <p className="text-sm text-gray-500">
            © 2025 DASHBOARD —
            <a
              href="https://github.com/dai0413/"
              className="text-gray-600 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              @dai0413
            </a>
          </p>
        </div>
      </footer>

      <div className="block md:hidden h-16 sm:h-auto" />
      <footer>
        <div className="block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
            {BottomMenuItems.map(({ to, icon, text }) => (
              <IconButton
                key={text}
                icon={icon}
                text={text}
                color="gray"
                to={to}
                direction="vertical"
                className="hover:text-green-500"
              />
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
