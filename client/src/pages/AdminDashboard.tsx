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
    model: "Competition",
    desc: "大会",
    link: APP_ROUTES.COMPETITION,
    icon: "competition",
  },
  {
    model: "CompetitionStage",
    desc: "大会ステージ",
    link: APP_ROUTES.COMPETITION_STAGE,
    icon: "competition",
  },
  {
    model: "Season",
    desc: "シーズン",
    link: APP_ROUTES.SEASON,
    icon: "competition",
  },
  {
    model: "Match",
    desc: "試合",
    link: APP_ROUTES.MATCH,
    icon: "match",
  },
  {
    model: "TeamCompetitionSeason",
    desc: "チームの大会参加記録",
    link: APP_ROUTES.TEAM_COMPETITION_SEASON,
    icon: "transfer",
  },
  {
    model: "PlayerRegistration",
    desc: "選手の大会参加記録",
    link: APP_ROUTES.PLAYER_REGISTRATION,
    icon: "transfer",
  },
  {
    model: "Referee",
    desc: "審判",
    link: APP_ROUTES.REFEREE,
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
    model: "Stadium",
    desc: "スタジアム",
    link: APP_ROUTES.STADIUM,
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
  {
    model: "MatchFormat",
    desc: "試合フォーマット",
    link: APP_ROUTES.MATCH_FORMAT,
    icon: "setting",
  },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">管理画面</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4">
          データモデル
        </h2>
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
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4">
          定期確認
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to={APP_ROUTES.NO_NUMBER}>
            <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
              <h2 className="text-lg font-bold mb-2">移籍</h2>
              <p className="text-gray-500 text-sm">背番号が未登録</p>
            </div>
          </Link>
          <Link to={APP_ROUTES.NO_CALLUP}>
            <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
              <h2 className="text-lg font-bold mb-2">代表試合シリーズ</h2>
              <p className="text-gray-500 text-sm">招集メンバーが0人</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
