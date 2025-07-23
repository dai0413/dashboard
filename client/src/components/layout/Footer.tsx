import {
  HomeIcon,
  UserCircleIcon,
  QueueListIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const iconClass = "w-6 h-6 group-hover:text-blue-600";

  const BottomMenuItems = [
    {
      to: APP_ROUTES.PLAYER,
      icon: <HomeIcon className={iconClass} />,
      text: "ホーム",
    },
    {
      to: APP_ROUTES.TRANSFER,
      icon: <QueueListIcon className={iconClass} />,
      text: "移籍",
    },
    {
      to: APP_ROUTES.INJURY,
      icon: <TableCellsIcon className={iconClass} />,
      text: "怪我",
    },
    {
      to: APP_ROUTES.ME,
      icon: <UserCircleIcon className={iconClass} />,
      text: "プロフィール",
    },
  ];

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

      <footer>
        <div className="block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
            {BottomMenuItems.map(({ to, icon, text }) => (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                className="inline-flex flex-col items-center justify-center px-5 group cursor-pointer"
              >
                {icon}
                <span className="text-sm text-gray-500 group-hover:text-blue-600">
                  {text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
