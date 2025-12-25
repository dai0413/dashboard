import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconButton } from "../buttons";
import { SPMenuItems } from "../../constants/menuItems";
import { isDev } from "../../utils/env";

const Header = () => {
  const { accessToken, staffState, logout } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

  return (
    <>
      <header className="bg-white shadow-md overflow-visible z-50 h-16 sm:h-auto">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link
            to={APP_ROUTES.HOME}
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-green-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">DASHBOARD</span>
          </Link>

          <nav className="hidden sm:flex gap-4 items-center text-sm">
            {(staffState.admin || isDev) && (
              <Link to={APP_ROUTES.ADMIN} className="hover:text-gray-900">
                管理
              </Link>
            )}
            <Link to={APP_ROUTES.TRANSFER} className="hover:text-gray-900">
              移籍
            </Link>
            <Link to={APP_ROUTES.INJURY} className="hover:text-gray-900">
              怪我
            </Link>
            <Link
              to={`${APP_ROUTES.NATIONAL_SUMMARY}/${japan}`}
              className="hover:text-gray-900"
            >
              日本
            </Link>
            {accessToken ? (
              <>
                <Link to={APP_ROUTES.ME} className="hover:text-gray-900">
                  マイページ
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                to={APP_ROUTES.LOGIN}
                className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded"
              >
                ログイン
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </Link>
            )}
          </nav>

          <div className="relative">
            <button
              onClick={toggleMenu}
              className="sm:hidden text-gray-700 focus:outline-none cursor-pointer"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 flex flex-col items-center justify-center">
          {SPMenuItems.map(({ icon, text, to }, index) => (
            <IconButton
              key={index}
              icon={icon}
              text={text}
              to={to}
              color="gray"
              onClick={() => setIsOpen(false)}
              direction="horizontal"
              className={`flex justify-center text-xl text-gray-800 w-full text-center py-4 border-b border-gray-300`}
            />
          ))}
          {accessToken ? (
            <>
              <button
                onClick={logout}
                className={`flex justify-center text-xl text-gray-800 w-full text-center py-4 `}
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              onClick={() => setIsOpen(false)}
              to={APP_ROUTES.LOGIN}
              className={`flex justify-center text-xl text-gray-800 w-full text-center py-4 `}
            >
              ログイン
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
