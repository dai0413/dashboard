import { useAuth } from "../../context/auth-context";
import { APP_ROUTES } from "../../lib/appRoutes";
import { isDev } from "../../utils/env";
import { IconButton } from "../buttons";
import { MenuItems } from "../../types/menu/IconButton";
const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

export const BottomMenuItems: MenuItems[] = [
  {
    to: APP_ROUTES.TRANSFER,
    key: "transfer",
    icon: "transfer",
    text: "移籍",
  },
  {
    to: APP_ROUTES.INJURY,
    icon: "injury",
    key: "injury",
    text: "怪我",
  },
  {
    to: APP_ROUTES.HOME,
    icon: "home",
    key: "home",
    text: "ホーム",
  },
  {
    icon: "series",
    key: "series",
    to: `${APP_ROUTES.NATIONAL_SUMMARY}/${japan}`,
    text: "日本",
  },
];

const Footer = () => {
  const { staffState } = useAuth();

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

      <div className="block md:hidden h-13 sm:h-auto" />
      <footer>
        <div className="block md:hidden fixed bottom-0 left-0 z-50 w-full h-13 bg-white border-t border-gray-200">
          <div
            className={`grid h-full max-w-lg mx-auto font-medium ${
              staffState.admin || isDev ? "grid-cols-4" : "grid-cols-4"
            }`}
          >
            {BottomMenuItems.map(({ key, to, icon, text }) => (
              <IconButton
                key={key}
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
