
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./GraficoEvolucaoFrota.css";

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor);
}

function GraficoEvolucaoFrota({ dados }) {
  const dadosGrafico = dados;

  return (
    <div className="grafico-container">
      <div className="grafico-cabecalho">
        <div>
          <h3>Evolução da frota circulante</h3>
          <p>Último mês disponível de cada ano · 2023: fevereiro</p>
        </div>
      </div>

      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dadosGrafico}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#293548"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="ano"
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

            <Line
              type="monotone"
              dataKey="frotaCirculante"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoEvolucaoFrota;
