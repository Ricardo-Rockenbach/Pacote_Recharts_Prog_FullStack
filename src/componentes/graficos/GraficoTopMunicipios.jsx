
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./GraficoTopMunicipios.css";

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor || 0);
}

function GraficoTopMunicipios({ dados }) {
  return (
    <div className="grafico-container grafico-top-municipios">
      <div className="grafico-cabecalho">
        <div>
          <h3>Top 10 municípios</h3>
          <p>Municípios com maior frota circulante</p>
        </div>
      </div>

      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dados}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              stroke="#293548"
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(valor) =>
                `${(valor / 1000000).toFixed(1)} mi`
              }
            />

            <YAxis
              type="category"
              dataKey="municipio"
              width={110}
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#192332",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              formatter={(valor) => [
                formatarNumero(valor),
                "Frota circulante",
              ]}
            />

            <Bar
              dataKey="frotaCirculante"
              fill="#8b5cf6"
              radius={[0, 5, 5, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoTopMunicipios;
