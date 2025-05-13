import Header from "./Header";
import Footer from "./Footer";
import Alert from "./Alert";
import { useAlert } from "../../context/alert-context";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { message, error } = useAlert();
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Alert message={message} error={error} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
