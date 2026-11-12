import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

const formatador = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

function GraficoRadarRegional({ dados }) {
  return (
    <div className="grafico-container grafico-radar">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">INDICADOR RELATIVO</span>
          <h3>Veículos por 100 habitantes</h3>
          <p>Compara a frota total e a circulante em relação à população</p>
        </div>
      </div>
      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={dados} cx="50%" cy="46%" outerRadius="66%">
            <PolarGrid stroke="#2d4148" />
            <PolarAngleAxis
              dataKey="regiao"
              tick={{ fill: "#b4c0c2", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              tick={{ fill: "#7f9299", fontSize: 10 }}
              tickFormatter={(valor) => formatador.format(valor)}
              axisLine={false}
            />
            <Radar
              name="Frota circulante"
              dataKey="frotaPor100Habitantes"
              stroke="#41c7b2"
              fill="#41c7b2"
              fillOpacity={0.24}
              strokeWidth={2}
            />
            <Radar
              name="Frota total"
              dataKey="frotaTotalPor100Habitantes"
              stroke="#e7b45c"
              fill="#e7b45c"
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(valor, nome) => [`${formatador.format(valor)} veículos`, `${nome} · por 100 habitantes`]}
              contentStyle={{ background: "#17282f", border: "1px solid #38505a", borderRadius: 8, color: "#f2f0e9" }}
              labelStyle={{ color: "#f2f0e9", fontWeight: 700 }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(valor) => <span className="grafico-legenda-texto">{valor}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoRadarRegional;
