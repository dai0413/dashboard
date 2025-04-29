import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { APP_ROUTES } from "../../lib/appRoutes";

const Header = () => {
  const { accessToken, logout } = useAuth();

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
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

        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center gap-4">
          <Link to={APP_ROUTES.TRANSFER} className="hover:text-gray-900">
            移籍
          </Link>
          <Link to={APP_ROUTES.INJURY} className="hover:text-gray-900">
            怪我
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
      </div>
    </header>
  );
};

export default Header;
