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

import "./GraficoTopMunicipios.css";

const formatador = new Intl.NumberFormat("pt-BR");
const compacto = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

function GraficoTopMunicipios({ dados }) {
  return (
    <div className="grafico-container grafico-top-municipios">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">RANKING MUNICIPAL</span>
          <h3>Municípios com maior frota</h3>
          <p>Os dez maiores volumes dentro do recorte selecionado</p>
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
                dataKey="municipio"
                width={132}
                tick={{ fill: "#b4c0c2", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#17282f", border: "1px solid #38505a", borderRadius: 8, color: "#f2f0e9" }}
                labelStyle={{ color: "#f2f0e9", fontWeight: 700 }}
                formatter={(valor, nome) => [formatador.format(valor), nome === "frotaCirculante" ? "Frota circulante" : nome]}
              />
              <Bar dataKey="frotaCirculante" name="Frota circulante" fill="#8499e8" radius={[0, 5, 5, 0]} maxBarSize={25}>
                <LabelList dataKey="frotaCirculante" position="right" formatter={(valor) => compacto.format(valor)} fill="#c5d0d0" fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="grafico-vazio">Nenhum município corresponde aos filtros.</div>}
      </div>
    </div>
  );
}

export default GraficoTopMunicipios;
