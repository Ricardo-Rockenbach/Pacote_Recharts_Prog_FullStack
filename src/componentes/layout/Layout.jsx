import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

function Layout({ children, paginaAtiva, onNavegar, titulo, descricao, periodo }) {
  return (
    <div className="app-layout">
      <Sidebar paginaAtiva={paginaAtiva} onNavegar={onNavegar} />
      <main className="app-main">
        <Header titulo={titulo} descricao={descricao} periodo={periodo} />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
