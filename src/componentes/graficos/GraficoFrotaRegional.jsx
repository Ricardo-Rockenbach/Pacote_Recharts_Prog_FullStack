import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

const CORES_REGIOES = {
  NORTE: "#41c7b2",
  NORDESTE: "#e7b45c",
  "CENTRO-OESTE": "#8499e8",
  SUDESTE: "#ec8c70",
  SUL: "#b28ad9",
};
const formatador = new Intl.NumberFormat("pt-BR");
const compacto = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

function GraficoFrotaRegional({ dados }) {
  return (
    <div className="grafico-container grafico-regional">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">VOLUME ABSOLUTO</span>
          <h3>Frota circulante por região</h3>
          <p>Comparação direta entre as cinco regiões brasileiras</p>
        </div>
        <span className="grafico-tipo">Barras</span>
      </div>
      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 15, right: 18, left: 2, bottom: 4 }}>
            <CartesianGrid stroke="#2d4148" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="regiao"
              tick={{ fill: "#b4c0c2", fontSize: 10 }}
              axisLine={{ stroke: "#49616a" }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: "#9eabb3", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(valor) => compacto.format(valor)}
              width={48}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#17282f", border: "1px solid #38505a", borderRadius: 8, color: "#f2f0e9" }}
              labelStyle={{ color: "#f2f0e9", fontWeight: 700 }}
              formatter={(valor) => [formatador.format(valor), "Frota circulante"]}
            />
            <Bar dataKey="frotaCirculante" name="Frota circulante" radius={[5, 5, 0, 0]} maxBarSize={54}>
              {dados.map((item) => <Cell key={item.regiao} fill={CORES_REGIOES[item.regiao] || "#41c7b2"} />)}
              <LabelList dataKey="frotaCirculante" position="top" formatter={(valor) => compacto.format(valor)} fill="#c5d0d0" fontSize={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoFrotaRegional;
