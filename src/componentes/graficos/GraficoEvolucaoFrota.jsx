import "./GraficoEvolucaoFrota.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor || 0);
}

function formatarCompacto(valor) {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(valor / 1000000)} mi`;
}

function GraficoEvolucaoFrota({ dados, descricao }) {
  return (
    <div className="grafico-container grafico-evolucao">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">SÉRIE HISTÓRICA</span>
          <h3>Evolução da frota circulante</h3>
          <p>{descricao}</p>
        </div>
        <span className="grafico-tipo">Área</span>
      </div>
      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dados} margin={{ top: 12, right: 18, left: 4, bottom: 2 }}>
            <defs>
              <linearGradient id="corFrotaArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#41c7b2" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#41c7b2" stopOpacity={0.015} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2d4148" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="periodo"
              tick={{ fill: "#9eabb3", fontSize: 11 }}
              axisLine={{ stroke: "#49616a" }}
              tickLine={false}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              tick={{ fill: "#9eabb3", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatarCompacto}
              width={48}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#17282f", border: "1px solid #38505a", borderRadius: 8, color: "#f2f0e9" }}
              labelStyle={{ color: "#f2f0e9", fontWeight: 700 }}
              formatter={(valor) => [formatarNumero(valor), "Frota circulante"]}
            />
            <Area
              type="monotone"
              dataKey="frotaCirculante"
              name="Frota circulante"
              stroke="#41c7b2"
              strokeWidth={2.7}
              fill="url(#corFrotaArea)"
              activeDot={{ r: 5, fill: "#f2f0e9", stroke: "#41c7b2", strokeWidth: 2 }}
              dot={{ r: 3, fill: "#41c7b2", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoEvolucaoFrota;
