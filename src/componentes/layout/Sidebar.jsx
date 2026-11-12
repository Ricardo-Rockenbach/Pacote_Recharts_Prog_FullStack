import { useState } from "react";
import {
  LayoutDashboard,
  MapPinned,
  Building2,
  Flag,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import "./Sidebar.css";

const paginas = [
  { id: "geral", label: "Visão geral", detalhe: "Panorama nacional", Icone: LayoutDashboard, numero: "01" },
  { id: "regioes", label: "Regiões", detalhe: "Comparação territorial", Icone: MapPinned, numero: "02" },
  { id: "municipios", label: "Municípios", detalhe: "Exploração local", Icone: Building2, numero: "03" },
  { id: "estados", label: "Estados", detalhe: "Ranking por UF", Icone: Flag, numero: "04" },
];

function Sidebar({ paginaAtiva, onNavegar }) {
  const [recolhida, setRecolhida] = useState(false);

  return (
    <aside className={`sidebar ${recolhida ? "sidebar-recolhida" : ""}`}>
      <div className="sidebar-topo">
        <div className="sidebar-logo">
          <div className="logo-icon"><BarChart3 size={22} strokeWidth={2.2} /></div>
          {!recolhida && (
            <div className="logo-texto">
              <h2>BR <span>Analytics</span></h2>
              <small>Dados que contam histórias</small>
            </div>
          )}
        </div>
        <button
          className="sidebar-recolher"
          type="button"
          onClick={() => setRecolhida((atual) => !atual)}
          aria-label={recolhida ? "Expandir navegação" : "Recolher navegação"}
          title={recolhida ? "Expandir navegação" : "Recolher navegação"}
        >
          {recolhida ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <div className="sidebar-section">
        {!recolhida && <span className="sidebar-label">EXPLORAR</span>}
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {paginas.map(({ id, label, detalhe, Icone, numero }) => (
            <button
              key={id}
              className={`sidebar-item ${paginaAtiva === id ? "active" : ""}`}
              type="button"
              onClick={() => onNavegar(id)}
              aria-current={paginaAtiva === id ? "page" : undefined}
              title={label}
            >
              <span className="sidebar-item-icone"><Icone size={18} strokeWidth={1.9} /></span>
              {!recolhida && (
                <span className="sidebar-item-texto">
                  <strong>{label}</strong>
                  <small>{detalhe}</small>
                </span>
              )}
              {!recolhida && <span className="sidebar-item-numero">{numero}</span>}
            </button>
          ))}
        </nav>
      </div>

      {!recolhida && (
        <div className="sidebar-nota">
          <span className="sidebar-nota-ponto" />
          <div><strong>Base demonstrativa</strong><small>Dados históricos · 2018—2023</small></div>
        </div>
      )}

      <div className="sidebar-footer">
        <span>RECHARTS · REACT</span>
        {!recolhida && <small>Projeto acadêmico · 2026</small>}
      </div>
    </aside>
  );
}

export default Sidebar;
