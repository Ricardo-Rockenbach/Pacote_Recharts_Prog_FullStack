import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";

const CORES_REGIOES = {
  NORTE: "#41c7b2",
  NORDESTE: "#e7b45c",
  "CENTRO-OESTE": "#8499e8",
  SUDESTE: "#ec8c70",
  SUL: "#b28ad9",
};
const formatador = new Intl.NumberFormat("pt-BR");

function formatarCompacto(valor) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(valor || 0);
}

function TooltipParticipacao({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const percentual = total ? (Number(item.frotaCirculante) / total) * 100 : 0;

  return (
    <div className="grafico-tooltip">
      <strong>{item.regiao}</strong>
      <span>{formatador.format(item.frotaCirculante)} veículos</span>
      <em>{percentual.toFixed(1).replace(".", ",")}% do total exibido</em>
    </div>
  );
}

function GraficoParticipacaoRegional({ dados }) {
  const total = dados.reduce((soma, item) => soma + (Number(item.frotaCirculante) || 0), 0);

  return (
    <div className="grafico-container grafico-participacao">
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">PROPORÇÃO</span>
          <h3>Participação por região</h3>
          <p>Quanto cada região representa do total da frota</p>
        </div>
      </div>
      <div className="grafico-area">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="frotaCirculante"
              nameKey="regiao"
              innerRadius="58%"
              outerRadius="78%"
              paddingAngle={3}
              stroke="none"
            >
              {dados.map((item) => (
                <Cell key={item.regiao} fill={CORES_REGIOES[item.regiao] || "#84999d"} />
              ))}
              <Label
                value={formatarCompacto(total)}
                position="center"
                fill="#f2f0e9"
                fontSize={23}
                fontWeight={700}
              />
              <Label
                value="veículos"
                position="center"
                dy={23}
                fill="#9eabb3"
                fontSize={11}
              />
            </Pie>
            <Tooltip content={<TooltipParticipacao total={total} />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(valor) => <span className="grafico-legenda-texto">{valor}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoParticipacaoRegional;
