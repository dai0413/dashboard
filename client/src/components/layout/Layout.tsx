import Header from "./Header";
import Footer from "./Footer";
import Alert from "./Alert";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Alert />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
