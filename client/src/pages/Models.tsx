import { Link } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { IconButton } from "../components/buttons";
import { Icon } from "../components/buttons/IconButton";

const models: {
  model: string;
  desc: string;
  link: string;
  icon: Icon;
}[] = [
  {
    model: "Team",
    desc: "チーム",
    link: APP_ROUTES.TEAM,
    icon: "team",
  },
  {
    model: "Player",
    desc: "選手",
    link: APP_ROUTES.PLAYER,
    icon: "player",
  },
  {
    model: "Transfer",
    desc: "移籍",
    link: APP_ROUTES.TRANSFER,
    icon: "transfer",
  },
  {
    model: "Injury",
    desc: "怪我",
    link: APP_ROUTES.INJURY,
    icon: "injury",
  },
  {
    model: "Country",
    desc: "国",
    link: APP_ROUTES.COUNTRY,
    icon: "injury",
  },
  {
    model: "NationalMatchSeries",
    desc: "代表試合シリーズ",
    link: APP_ROUTES.NATIONAL_MATCH_SERIES,
    icon: "series",
  },
  {
    model: "NationalCallUp",
    desc: "代表招集リスト",
    link: APP_ROUTES.NATIONAL_CALLUP,
    icon: "callup",
  },
];

const Models = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {models.map((m) => (
        <Link key={m.model} to={m.link}>
          <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
            <IconButton icon={m.icon} />
            <h2 className="text-lg font-bold mb-2">{m.desc}</h2>
            <p className="text-gray-500 text-sm">{m.model}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Models;
