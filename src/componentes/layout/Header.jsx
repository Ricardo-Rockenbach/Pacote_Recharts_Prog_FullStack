import { Search, CalendarDays } from "lucide-react";
import "./Header.css";

function Header({ titulo, descricao, busca, onBuscaChange, mostrarBusca }) {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>

      <div className="header-actions">
        {mostrarBusca && (
          <label className="header-search">
            <Search size={17} />
            <input
              type="search"
              value={busca}
              onChange={(evento) => onBuscaChange(evento.target.value)}
              placeholder="Buscar município ou UF..."
              aria-label="Buscar município ou UF"
            />
          </label>
        )}
        <div className="header-period">
          <CalendarDays size={17} />
          <span>2018 — 2023</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
