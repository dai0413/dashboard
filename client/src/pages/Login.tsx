import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

type form = {
  userName: string;
  email: string;
  password: string;
};

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState<form>({
    userName: "",
    email: "",
    password: "",
  });

  const loginColor =
    mode === "login"
      ? "text-indigo-500 border-b-2 border-indigo-500"
      : "border-b-2 border-gray-300";

  const registerColor =
    mode === "register"
      ? "text-indigo-500 border-b-2 border-indigo-500"
      : "border-b-2 border-gray-300";

  const handleChangeForm = (key: keyof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nav = async (fn: () => Promise<boolean>, to: string) => {
    const result = await fn();
    if (result) {
      navigate(to);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await login(form.email, form.password);

      if (result) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async () => {
    const result = await register(form.userName, form.email, form.password);

    if (result) {
      navigate("/");
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            {mode === "login" ? "ログイン" : "ユーザー登録"}
          </h1>
          <p className="leading-relaxed mt-4">
            {mode === "login"
              ? "ユーザー名とパスワードを入力してログインしてください。"
              : "ユーザー登録することでデータを閲覧することができます。ユーザー名・メールアドレス・パスワードを入力して、新規登録ボタンをクリックしてください。"}
          </p>
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <div className="flex mb-4">
            <a
              className={`flex-grow py-2 text-lg px-1 text-center ${loginColor}`}
              onClick={() => setMode("login")}
            >
              登録済みの方
            </a>
            <a
              className={`flex-grow py-2 text-lg px-1 text-center ${registerColor}`}
              onClick={() => setMode("register")}
            >
              初めての方
            </a>
          </div>
          {mode === "register" && (
            <div className="relative mb-4">
              <label
                htmlFor="user-name"
                className="leading-7 text-sm text-gray-600"
              >
                ユーザー名：user-name
              </label>
              <input
                type="text"
                id="user-name"
                name="user-name"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={form.userName}
                onChange={(e) => handleChangeForm("userName", e.target.value)}
              />
            </div>
          )}
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              メールアドレス：email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={form.email}
              onChange={(e) => handleChangeForm("email", e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              パスワード：password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={form.password}
              onChange={(e) => handleChangeForm("password", e.target.value)}
            />
          </div>
          {mode === "login" && (
            <button
              type="button"
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={() => handleLogin()}
            >
              ログイン
            </button>
          )}

          {mode === "register" && (
            <button
              type="button"
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={() => handleRegister()}
            >
              新規登録
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
