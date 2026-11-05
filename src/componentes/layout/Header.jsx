
import { Search, Bell, CalendarDays } from "lucide-react";

import "./Header.css";

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>
          Visão geral da frota de veículos brasileira
        </p>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Buscar município..."
          />
        </div>

        <button className="header-icon">
          <Bell size={19} />
        </button>

        <div className="header-period">
          <CalendarDays size={17} />
          <span>2018 — 2023</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
