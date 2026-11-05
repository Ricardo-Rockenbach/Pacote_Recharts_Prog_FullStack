
import Sidebar from "./Sidebar";
import Header from "./Header";

import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-main">
        <Header />

        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
