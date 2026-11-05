
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./GraficoFrotaRegional.css";

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor || 0);
}

function GraficoFrotaRegional({ dados }) {
  return (
    <div className="grafico-container">
      <div className="grafico-cabecalho">
        <div>
          <h3>Frota circulante por região</h3>
          <p>Comparativo entre as regiões brasileiras</p>
        </div>
      </div>

      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dados}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#293548"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="regiao"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(valor) =>
                `${(valor / 1000000).toFixed(0)} mi`
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#192332",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(valor) => [
                formatarNumero(valor),
                "Frota circulante",
              ]}
            />

            <Bar
              dataKey="frotaCirculante"
              fill="#3b82f6"
              radius={[5, 5, 0, 0]}
              maxBarSize={65}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoFrotaRegional;
