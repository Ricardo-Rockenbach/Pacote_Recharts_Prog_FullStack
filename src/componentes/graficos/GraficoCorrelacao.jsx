import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

function TooltipCorrelacao({ active, payload, tipo }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const nome = tipo === "estados" ? `UF ${item.uf}` : `${item.municipio} - ${item.uf}`;

  return (
    <div className="grafico-tooltip">
      <strong>{nome}</strong>
      {tipo === "estados" && <span>{item.regiao}</span>}
      <span>População: {formatador.format(item.populacao)}</span>
      <em>Frota circulante: {formatador.format(item.frotaCirculante)}</em>
    </div>
  );
}

function GraficoCorrelacao({ titulo, descricao, dados, tipo }) {
  const porRegiao = tipo === "estados"
    ? [...new Set(dados.map((item) => item.regiao))].filter(Boolean)
    : [];

  return (
    <div className={`grafico-container grafico-correlacao grafico-correlacao-${tipo}`}>
      <div className="grafico-cabecalho">
        <div>
          <span className="grafico-etiqueta">RELAÇÃO ENTRE VARIÁVEIS</span>
          <h3>{titulo}</h3>
          <p>{descricao}</p>
        </div>
      </div>
      <div className="grafico-area">
        {dados.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 14, right: 22, bottom: 18, left: 8 }}>
            <CartesianGrid stroke="#2d4148" strokeDasharray="3 5" />
            <XAxis
              type="number"
              dataKey="populacao"
              name="População"
              tick={{ fill: "#9eabb3", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#49616a" }}
              tickFormatter={(valor) => compacto.format(valor)}
              label={{ value: "População", position: "insideBottom", offset: -10, fill: "#81949a", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="frotaCirculante"
              name="Frota circulante"
              tick={{ fill: "#9eabb3", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(valor) => compacto.format(valor)}
              width={55}
            />
            <Tooltip content={<TooltipCorrelacao tipo={tipo} />} cursor={{ strokeDasharray: "4 4", stroke: "#70858c" }} />
            {tipo === "estados" ? (
              <>
                {porRegiao.map((nome) => (
                  <Scatter
                    key={nome}
                    name={nome}
                    data={dados.filter((item) => item.regiao === nome)}
                    fill={CORES_REGIOES[nome] || "#41c7b2"}
                    fillOpacity={0.82}
                  />
                ))}
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  formatter={(valor) => <span className="grafico-legenda-texto">{valor}</span>}
                />
              </>
            ) : (
              <Scatter name="Municípios" data={dados} fill="#41c7b2" fillOpacity={0.72} />
            )}
            </ScatterChart>
          </ResponsiveContainer>
        ) : <div className="grafico-vazio">Sem pontos para exibir com os filtros atuais.</div>}
      </div>
      <div className="grafico-rodape">Cada ponto representa uma localidade. Passe o cursor para consultar os valores.</div>
    </div>
  );
}

export default GraficoCorrelacao;
