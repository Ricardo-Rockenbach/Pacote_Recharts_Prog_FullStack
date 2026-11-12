import {
  LayoutDashboard,
  MapPinned,
  Building2,
  Flag,
  BarChart3,
} from "lucide-react";

import "./Sidebar.css";

const paginas = [
  { id: "geral", label: "Visão geral", Icone: LayoutDashboard },
  { id: "regioes", label: "Regiões", Icone: MapPinned },
  { id: "municipios", label: "Municípios", Icone: Building2 },
  { id: "estados", label: "Estados", Icone: Flag },
];

function Sidebar({ paginaAtiva, onNavegar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><BarChart3 size={24} /></div>
        <div>
          <h2>BR Analytics</h2>
          <span>Visualização de dados</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">NAVEGAÇÃO</span>
        <nav className="sidebar-nav">
          {paginas.map(({ id, label, Icone }) => (
            <button
              key={id}
              className={`sidebar-item ${paginaAtiva === id ? "active" : ""}`}
              type="button"
              onClick={() => onNavegar(id)}
              aria-current={paginaAtiva === id ? "page" : undefined}
            >
              <Icone size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <span>BR Analytics</span>
        <span>Projeto acadêmico · 2026</span>
      </div>
    </aside>
  );
}

export default Sidebar;
