
import {
  ResponsiveContainer,
  Treemap,
  Tooltip,
} from "recharts";

import "./GraficoTreemap.css";

const CORES_REGIOES = {
  SUDESTE: "#ec8c70",
  SUL: "#b28ad9",
  NORDESTE: "#e7b45c",
  "CENTRO-OESTE": "#8499e8",
  NORTE: "#41c7b2",
};

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor || 0);
}

function formatarCompacto(valor) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(valor || 0);
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toFixed(1).replace(".", ",")}%`;
}

function ConteudoTreemap(props) {
  const {
    x,
    y,
    width,
    height,
    name,
    value,
    payload,
  } = props;

  const regiao = String(
    name || payload?.regiao || ""
  ).toUpperCase();

  const frota =
    Number(value ?? payload?.frotaCirculante) || 0;

  const participacao =
    Number(payload?.participacao ?? props.participacao) || 0;

  const cor = CORES_REGIOES[regiao] || "#84999d";

  if (width < 55 || height < 40) {
    return null;
  }

  const mostrarValor = width > 145 && height > 75;
  const mostrarPercentual = width > 115 && height > 60;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={5}
        fill="#20363d"
        stroke="#17282f"
        strokeWidth={3}
      />

      <rect
        x={x + 1}
        y={y + 1}
        width={6}
        height={Math.max(0, height - 2)}
        rx={3}
        fill={cor}
      />

      <foreignObject
        x={x + 10}
        y={y + 8}
        width={Math.max(0, width - 18)}
        height={Math.max(0, height - 16)}
        style={{ pointerEvents: "none" }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="treemap-label"
        >
          {width > 75 && height > 35 && (
            <div className="treemap-label-regiao">
              {regiao}
            </div>
          )}

          {mostrarValor && (
            <div className="treemap-label-valor">
              {formatarCompacto(frota)} veículos
            </div>
          )}

          {mostrarPercentual && (
            <div
              className="treemap-label-percentual"
              style={{ color: cor }}
            >
              {formatarPercentual(participacao)}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
}

function TooltipTreemap({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  const regiao = item.regiao || item.name || "Região";

  const frota = Number(
    item.frotaCirculante ?? item.value ?? 0
  );

  const participacao = Number(item.participacao || 0);

  return (
    <div className="treemap-tooltip">
      <strong>{regiao}</strong>

      <span>
        {formatarNumero(frota)} veículos
      </span>

      <span className="treemap-tooltip-percentual">
        {formatarPercentual(participacao)} da frota nacional
      </span>
    </div>
  );
}

function GraficoTreemap({ dados }) {
  const totalFrota = dados.reduce(
    (total, item) =>
      total + (Number(item.frotaCirculante) || 0),
    0
  );

  const dadosTreemap = dados.map((item) => ({
    ...item,
    participacao:
      totalFrota > 0
        ? ((Number(item.frotaCirculante) || 0) / totalFrota) * 100
        : 0,
  }));

  return (
    <div className="grafico-container grafico-treemap">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">COMPOSIÇÃO</span>
          <h3>Composição da frota por região</h3>
          <p>
            Participação regional na frota circulante
          </p>
        </div>
      </div>

      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={dadosTreemap}
            dataKey="frotaCirculante"
            nameKey="regiao"
            aspectRatio={4 / 3}
            stroke="#17282f"
            content={<ConteudoTreemap />}
          >
            <Tooltip
              content={<TooltipTreemap />}
              cursor={false}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoTreemap;
