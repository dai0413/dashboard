import { Link } from "react-router-dom";

type HomeCardProps = {
  to?: string;
  title: string;
  children: React.ReactNode;
};

const HomeCard = ({ to, title, children }: HomeCardProps) => (
  <div className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h3 className="text-lg font-bold text-gray-800">
        {to ? (
          <Link to={to} className="transition-colors hover:text-green-700">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>

      {to ? (
        <Link
          to={to}
          className="text-sm font-medium text-green-700 transition-colors hover:text-green-800 hover:underline"
        >
          詳細 →
        </Link>
      ) : (
        <></>
      )}
    </div>

    <div className="p-3">{children}</div>
  </div>
);

export default HomeCard;
