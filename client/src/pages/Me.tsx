import { useAuth } from "../context/auth-context";

const Me = () => {
  const { staffState } = useAuth();
  console.log(staffState);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <div className="text-lg">
        <p>👤 管理者: {staffState.admin ? "Yes" : "No"}</p>
        <p>🧑 スタッフ: {staffState.is_staff ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

export default Me;
