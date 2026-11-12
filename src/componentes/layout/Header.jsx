import { CalendarDays } from "lucide-react";
import "./Header.css";

function Header({ titulo, descricao, periodo }) {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <span className="header-overline">BRASIL EM DADOS</span>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
      <div className="header-period">
        <CalendarDays size={16} />
        <span>Referência</span>
        <strong>{periodo}</strong>
      </div>
    </header>
  );
}

export default Header;
