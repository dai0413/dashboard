import { Link } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { IconButton } from "../components/buttons";
import { useModal } from "../context/modal-context";
import { useForm } from "../context/form-context";
import {
  models,
  d_pcItems,
  d_scItems,
  matchRelatedItems,
} from "./AdminDashboard/data";

const AdminDashboard = () => {
  const {
    form: { open },
  } = useModal();
  const {
    formOperator: { startForm },
  } = useForm();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">管理画面</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4">
          試合関連更新
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 hover:cursor-pointer">
          {matchRelatedItems.map((m) => (
            <div
              key={m.model}
              onClick={() => {
                startForm({
                  ...m.startFormArgs,
                });
                open(m.startFormArgs.modelType);
              }}
            >
              <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
                <IconButton icon={m.icon} />
                <h2 className="text-lg font-bold mb-2">{m.desc}</h2>
                <p className="text-gray-500 text-sm">{m.model}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4">
          D_PC
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 hover:cursor-pointer">
          {d_pcItems.map((m) => (
            <div
              key={m.model}
              onClick={() => {
                startForm({
                  ...m.startFormArgs,
                });
                open(m.startFormArgs.modelType);
              }}
            >
              <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
                <IconButton icon={m.icon} />
                <h2 className="text-lg font-bold mb-2">{m.desc}</h2>
                <p className="text-gray-500 text-sm">{m.model}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4">
          D_SC
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 hover:cursor-pointer">
          {d_scItems.map((m) => (
            <div
              key={m.model}
              onClick={() => {
                startForm({
                  ...m.startFormArgs,
                });
                open(m.startFormArgs.modelType);
              }}
            >
              <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
                <IconButton icon={m.icon} />
                <h2 className="text-lg font-bold mb-2">{m.desc}</h2>
                <p className="text-gray-500 text-sm">{m.model}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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
