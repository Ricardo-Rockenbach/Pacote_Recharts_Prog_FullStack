import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import "./FiltrosDashboard.css";

const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function CampoFiltro({ label, value, onChange, children }) {
  return (
    <label className="filtro-campo">
      <span>{label}</span>
      <select value={value} onChange={(evento) => onChange(evento.target.value)}>
        {children}
      </select>
    </label>
  );
}

function FiltrosDashboard({
  paginaAtiva,
  ano,
  mes,
  regiao,
  uf,
  busca,
  anos,
  meses,
  regioes,
  ufs,
  periodoReferencia,
  onAnoChange,
  onMesChange,
  onRegiaoChange,
  onUfChange,
  onBuscaChange,
  onLimparFiltros,
}) {
  const mostrarRegiao = paginaAtiva === "municipios" || paginaAtiva === "estados";
  const mostrarUf = paginaAtiva === "municipios";

  return (
    <section className="filtros-dashboard" aria-label="Filtros da visualização">
      <div className="filtros-identificacao">
        <span className="filtros-icone"><SlidersHorizontal size={17} /></span>
        <div><strong>Refinar dados</strong><small>Atualize o recorte da análise</small></div>
      </div>

      <div className="filtros-controles">
        <CampoFiltro label="Ano de referência" value={ano} onChange={onAnoChange}>
          {anos.map((item) => <option key={item} value={String(item)}>{item}</option>)}
        </CampoFiltro>

        <CampoFiltro label="Mês de referência" value={mes} onChange={onMesChange}>
          {meses.map((item) => (
            <option key={item} value={String(item)}>{NOMES_MESES[item - 1] || String(item).padStart(2, "0")}</option>
          ))}
        </CampoFiltro>

        {mostrarRegiao && (
          <CampoFiltro label="Região" value={regiao} onChange={onRegiaoChange}>
            <option value="TODAS">Todas as regiões</option>
            {regioes.map((item) => <option key={item} value={item}>{item}</option>)}
          </CampoFiltro>
        )}

        {mostrarUf && (
          <CampoFiltro label="Estado (UF)" value={uf} onChange={onUfChange}>
            <option value="TODAS">Todas as UFs</option>
            {ufs.map((item) => <option key={item} value={item}>{item}</option>)}
          </CampoFiltro>
        )}

        {paginaAtiva === "municipios" && (
          <label className="filtro-pesquisa">
            <span>Município</span>
            <div className="filtro-pesquisa-campo">
              <Search size={16} />
              <input
                type="search"
                value={busca}
                onChange={(evento) => onBuscaChange(evento.target.value)}
                placeholder="Todos os municípios"
                aria-label="Pesquisar município ou UF"
              />
            </div>
          </label>
        )}

        {(mostrarRegiao || mostrarUf || paginaAtiva === "municipios") && (
          <button className="filtro-limpar" type="button" onClick={onLimparFiltros}>
            <RotateCcw size={14} />
            <span>Limpar filtros extras</span>
          </button>
        )}
      </div>

      <p className="filtros-resumo">
        <strong>Competência:</strong> {periodoReferencia}. Indicadores e rankings usam essa fotografia mensal; a evolução mostra os meses disponíveis do ano selecionado, sem somar meses diferentes.
      </p>
    </section>
  );
}

export default FiltrosDashboard;
