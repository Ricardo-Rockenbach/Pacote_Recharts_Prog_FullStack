import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

import "./GraficoTopEstados.css";

const formatador = new Intl.NumberFormat("pt-BR");
const compacto = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

function GraficoTopEstados({ dados }) {
  return (
    <div className="grafico-container grafico-top-estados">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">RANKING ESTADUAL</span>
          <h3>Top 10 estados</h3>
          <p>Unidades federativas ordenadas pela frota circulante</p>
        </div>
        <span className="grafico-tipo">Barras horizontais</span>
      </div>
      <div className="grafico-area">
        {dados.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} layout="vertical" margin={{ top: 6, right: 62, left: 8, bottom: 4 }}>
              <CartesianGrid stroke="#2d4148" strokeDasharray="3 5" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#9eabb3", fontSize: 10 }}
                axisLine={{ stroke: "#49616a" }}
                tickLine={false}
                tickFormatter={(valor) => compacto.format(valor)}
              />
              <YAxis
                type="category"
                dataKey="uf"
                width={42}
                tick={{ fill: "#b4c0c2", fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#17282f", border: "1px solid #38505a", borderRadius: 8, color: "#f2f0e9" }}
                labelStyle={{ color: "#f2f0e9", fontWeight: 700 }}
                formatter={(valor) => [formatador.format(valor), "Frota circulante"]}
              />
              <Bar dataKey="frotaCirculante" name="Frota circulante" fill="#e7b45c" radius={[0, 5, 5, 0]} maxBarSize={24}>
                <LabelList dataKey="frotaCirculante" position="right" formatter={(valor) => compacto.format(valor)} fill="#c5d0d0" fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="grafico-vazio">Nenhum estado corresponde aos filtros.</div>}
      </div>
    </div>
  );
}

export default GraficoTopEstados;
