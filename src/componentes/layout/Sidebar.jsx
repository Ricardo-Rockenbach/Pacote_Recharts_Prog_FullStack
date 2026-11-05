import { LayoutDashboard, BarChart3 } from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <BarChart3 size={24} />
        </div>

        <div>
          <h2>BR Analytics</h2>
          <span>Visualização de dados</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">NAVEGAÇÃO</span>

        <nav className="sidebar-nav">
          <button className="sidebar-item active" type="button">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>
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
