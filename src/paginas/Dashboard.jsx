import { useEffect, useMemo, useState } from "react";

import Layout from "../componentes/layout/Layout";
import FiltrosDashboard from "../componentes/layout/FiltrosDashboard";
import GraficoEvolucaoFrota from "../componentes/graficos/GraficoEvolucaoFrota";
import GraficoFrotaRegional from "../componentes/graficos/GraficoFrotaRegional";
import GraficoTopMunicipios from "../componentes/graficos/GraficoTopMunicipios";
import GraficoTopEstados from "../componentes/graficos/GraficoTopEstados";
import GraficoTreemap from "../componentes/graficos/GraficoTreemap";
import GraficoParticipacaoRegional from "../componentes/graficos/GraficoParticipacaoRegional";
import GraficoRadarRegional from "../componentes/graficos/GraficoRadarRegional";
import GraficoCorrelacao from "../componentes/graficos/GraficoCorrelacao";
import { carregarDataset } from "../servicos/datasetService";

import "./Dashboard.css";



const CONFIG_PAGINAS = {
  geral: {
    titulo: "Visão geral",
    descricao: "Um panorama dos principais números da frota brasileira.",
    introducao: "Indicadores nacionais, evolução histórica e distribuição por região.",
  },
  regioes: {
    titulo: "Análise por regiões",
    descricao: "Compare a distribuição e a participação da frota nas cinco regiões.",
    introducao: "A mesma informação pode ser lida por volume, proporção e indicadores relativos.",
  },
  municipios: {
    titulo: "Análise por municípios",
    descricao: "Explore os municípios com maior frota e compare população e veículos.",
    introducao: "Combine período, região, estado e pesquisa para encontrar localidades.",
  },
  estados: {
    titulo: "Análise por estados",
    descricao: "Compare o volume da frota e sua relação com a população por UF.",
    introducao: "O ranking mostra volume absoluto; a dispersão ajuda a observar relações entre variáveis.",
  },
};

const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const NOMES_MESES_CURTOS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const formatadorNumero = new Intl.NumberFormat("pt-BR");

function formatarNumero(valor) {
  return formatadorNumero.format(Number(valor) || 0);
}

function formatarNomeLocal(nome = "") {
  return String(nome)
    .toLocaleLowerCase("pt-BR")
    .replace(/(^|[\s'-])\p{L}/gu, (trecho) => trecho.toLocaleUpperCase("pt-BR"));
}

function obterReferenciaMaisRecente(dados) {
  return dados.reduce((maisRecente, registro) => {
    const ano = Number(registro.ano_referencia) || 0;
    const mes = Number(registro.mes_referencia) || 0;
    if (ano > maisRecente.ano || (ano === maisRecente.ano && mes > maisRecente.mes)) {
      return { ano, mes };
    }
    return maisRecente;
  }, { ano: 0, mes: 0 });
}

function prepararDadosEvolucao(dados) {
  const porAnoMes = new Map();

  dados.forEach((registro) => {
    const ano = Number(registro.ano_referencia) || 0;
    const mes = Number(registro.mes_referencia) || 0;
    if (!ano || !mes) return;

    const chave = `${ano}-${mes}`;
    porAnoMes.set(chave, (porAnoMes.get(chave) || 0) + (Number(registro.frota_circulante) || 0));
  });

  return [...porAnoMes.entries()]
    .map(([chave, frotaCirculante]) => {
      const [ano, mes] = chave.split("-").map(Number);
      return {
        ano,
        mes,
        frotaCirculante,
        periodo: NOMES_MESES_CURTOS[mes - 1] || String(mes),
      };
    })
    .sort((a, b) => a.ano - b.ano || a.mes - b.mes);
}

function prepararDadosRegionais(dados) {
  const agrupamento = dados.reduce((resultado, registro) => {
    const regiao = registro.regiao || "Não informada";
    if (!resultado[regiao]) {
      resultado[regiao] = { regiao, frotaCirculante: 0, frotaTotal: 0, populacao: 0 };
    }

    resultado[regiao].frotaCirculante += Number(registro.frota_circulante) || 0;
    resultado[regiao].frotaTotal += Number(registro.frota_total) || 0;
    resultado[regiao].populacao += Number(registro.qtde_habitantes) || 0;
    return resultado;
  }, {});

  return Object.values(agrupamento)
    .map((item) => ({
      ...item,
      frotaPor100Habitantes: item.populacao > 0 ? (item.frotaCirculante / item.populacao) * 100 : 0,
      frotaTotalPor100Habitantes: item.populacao > 0 ? (item.frotaTotal / item.populacao) * 100 : 0,
    }))
    .sort((a, b) => b.frotaCirculante - a.frotaCirculante);
}

function agruparMunicipios(dados) {
  const agrupamento = new Map();

  dados.forEach((registro) => {
    const codigo = Number(registro.codigo_ibge);
    if (!codigo || codigo <= 0) return;

    const item = agrupamento.get(codigo) || {
      codigo,
      nome: registro.municipio || "Município não informado",
      uf: registro.uf || "--",
      regiao: registro.regiao || "Não informada",
      populacao: 0,
      frotaCirculante: 0,
    };

    item.populacao += Number(registro.qtde_habitantes) || 0;
    item.frotaCirculante += Number(registro.frota_circulante) || 0;
    agrupamento.set(codigo, item);
  });

  return [...agrupamento.values()];
}

function prepararTopMunicipios(dados, busca) {
  const termo = busca.trim().toLocaleLowerCase("pt-BR");

  return agruparMunicipios(dados)
    .filter((registro) => {
      if (!termo) return true;
      return `${registro.nome} ${registro.uf}`.toLocaleLowerCase("pt-BR").includes(termo);
    })
    .sort((a, b) => b.frotaCirculante - a.frotaCirculante)
    .slice(0, 10)
    .map((registro) => ({
      ...registro,
      municipio: `${formatarNomeLocal(registro.nome)} - ${registro.uf}`,
    }));
}

function prepararCorrelacaoMunicipios(dados, busca) {
  const termo = busca.trim().toLocaleLowerCase("pt-BR");

  return agruparMunicipios(dados)
    .filter((registro) => registro.populacao > 0)
    .filter((registro) => {
      if (!termo) return true;
      return `${registro.nome} ${registro.uf}`.toLocaleLowerCase("pt-BR").includes(termo);
    })
    .sort((a, b) => b.frotaCirculante - a.frotaCirculante)
    .slice(0, 50)
    .map((registro) => ({
      ...registro,
      municipio: formatarNomeLocal(registro.nome),
    }));
}

function prepararDadosEstados(dados) {
  const agrupamento = dados.reduce((resultado, registro) => {
    const uf = registro.uf || "--";
    if (!resultado[uf]) {
      resultado[uf] = {
        uf,
        regiao: registro.regiao || "Não informada",
        populacao: 0,
        frotaCirculante: 0,
      };
    }

    resultado[uf].populacao += Number(registro.qtde_habitantes) || 0;
    resultado[uf].frotaCirculante += Number(registro.frota_circulante) || 0;
    return resultado;
  }, {});

  return Object.values(agrupamento).sort((a, b) => b.frotaCirculante - a.frotaCirculante);
}

function calcularIndicadores(dados) {
  const somar = (campo) => dados.reduce(
    (total, registro) => total + (Number(registro[campo]) || 0),
    0
  );
  const municipios = new Set(
    dados.map((registro) => Number(registro.codigo_ibge)).filter((codigo) => codigo > 0)
  );

  return {
    frotaCirculante: somar("frota_circulante"),
    frotaTotal: somar("frota_total"),
    populacao: somar("qtde_habitantes"),
    municipios: municipios.size,
  };
}

function Dashboard() {
  const [paginaAtiva, setPaginaAtiva] = useState("geral");
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [regiao, setRegiao] = useState("TODAS");
  const [uf, setUf] = useState("TODAS");

  useEffect(() => {
    carregarDataset()
      .then((resultado) => setDados(resultado))
      .catch((erroCarregamento) => {
        console.error("Erro ao carregar indicadores:", erroCarregamento);
        setErro("Não foi possível carregar os dados do dataset.");
      })
      .finally(() => setCarregando(false));
  }, []);

  const anosDisponiveis = useMemo(
    () => [...new Set(dados.map((registro) => Number(registro.ano_referencia)).filter(Boolean))].sort((a, b) => b - a),
    [dados]
  );

  useEffect(() => {
    if (dados.length && !ano) {
      const referencia = obterReferenciaMaisRecente(dados);
      setAno(String(referencia.ano));
      setMes(String(referencia.mes));
    }
  }, [dados, ano]);

  const mesesDisponiveis = useMemo(() => {
    return [...new Set(
      dados
        .filter((registro) => Number(registro.ano_referencia) === Number(ano))
        .map((registro) => Number(registro.mes_referencia))
        .filter(Boolean)
    )].sort((a, b) => a - b);
  }, [dados, ano]);

  // A competência selecionada é uma fotografia mensal. Os indicadores e rankings
  // usam apenas esse mês; a série histórica usa todos os meses do ano selecionado,
  // mantendo cada mês como um ponto separado (sem somar meses entre si).
  const dadosAnoSelecionado = useMemo(
    () => dados.filter((registro) => Number(registro.ano_referencia) === Number(ano)),
    [dados, ano]
  );

  const dadosReferencia = useMemo(
    () => dadosAnoSelecionado.filter((registro) => Number(registro.mes_referencia) === Number(mes)),
    [dadosAnoSelecionado, mes]
  );

  const referenciaSelecionada = useMemo(
    () => ({ ano: Number(ano) || 0, mes: Number(mes) || 0 }),
    [ano, mes]
  );

  const regioesDisponiveis = useMemo(
    () => [...new Set(dadosReferencia.map((registro) => registro.regiao).filter(Boolean))].sort(),
    [dadosReferencia]
  );

  const ufsDisponiveis = useMemo(
    () => [...new Set(
      dadosReferencia
        .filter((registro) => regiao === "TODAS" || registro.regiao === regiao)
        .map((registro) => registro.uf)
        .filter(Boolean)
    )].sort(),
    [dadosReferencia, regiao]
  );

  const dadosFiltrados = useMemo(
    () => dadosReferencia.filter((registro) =>
      (regiao === "TODAS" || registro.regiao === regiao) &&
      (uf === "TODAS" || registro.uf === uf)
    ),
    [dadosReferencia, regiao, uf]
  );

  const indicadores = useMemo(() => calcularIndicadores(dadosReferencia), [dadosReferencia]);
  const dadosEvolucao = useMemo(
    () => prepararDadosEvolucao(dadosAnoSelecionado),
    [dadosAnoSelecionado]
  );
  const dadosRegionais = useMemo(() => prepararDadosRegionais(dadosReferencia), [dadosReferencia]);
  const dadosTopMunicipios = useMemo(
    () => prepararTopMunicipios(dadosFiltrados, busca),
    [dadosFiltrados, busca]
  );
  const dadosCorrelacaoMunicipios = useMemo(
    () => prepararCorrelacaoMunicipios(dadosFiltrados, busca),
    [dadosFiltrados, busca]
  );
  const dadosEstados = useMemo(() => prepararDadosEstados(dadosFiltrados), [dadosFiltrados]);
  const dadosTopEstados = useMemo(() => dadosEstados.slice(0, 10), [dadosEstados]);

  const pagina = CONFIG_PAGINAS[paginaAtiva];
  const periodo = referenciaSelecionada.ano && referenciaSelecionada.mes
    ? `${String(referenciaSelecionada.mes).padStart(2, "0")}/${referenciaSelecionada.ano}`
    : "Sem dados";

  const descricaoEvolucao = `Evolução mensal de ${ano}; os indicadores usam a competência ${periodo}.`;

  function alterarAno(novoAno) {
    setAno(novoAno);

    const mesesDoAno = dados
      .filter((registro) => Number(registro.ano_referencia) === Number(novoAno))
      .map((registro) => Number(registro.mes_referencia))
      .filter(Boolean);

    if (mesesDoAno.length) setMes(String(Math.max(...mesesDoAno)));
  }

  function limparFiltros() {
    setRegiao("TODAS");
    setUf("TODAS");
    setBusca("");
  }

  function navegar(pagina) {
    setPaginaAtiva(pagina);
    setBusca("");
    setRegiao("TODAS");
    setUf("TODAS");
  }

  return (
    <Layout
      paginaAtiva={paginaAtiva}
      onNavegar={navegar}
      titulo={pagina.titulo}
      descricao={pagina.descricao}
      periodo={periodo}
    >
      <section className="dashboard-intro">
        <div>
          <span className="intro-index">EXPLORAÇÃO INTERATIVA</span>
          <p>{pagina.introducao}</p>
        </div>
        <span className="intro-source">BASE HISTÓRICA · 2018—FEV/2023</span>
      </section>

      {!carregando && !erro && (
        <FiltrosDashboard
          paginaAtiva={paginaAtiva}
          ano={ano}
          mes={mes}
          regiao={regiao}
          uf={uf}
          busca={busca}
          anos={anosDisponiveis}
          meses={mesesDisponiveis}
          regioes={regioesDisponiveis}
          ufs={ufsDisponiveis}
          periodoReferencia={periodo}
          onAnoChange={alterarAno}
          onMesChange={setMes}
          onRegiaoChange={(novaRegiao) => { setRegiao(novaRegiao); setUf("TODAS"); }}
          onUfChange={setUf}
          onBuscaChange={setBusca}
          onLimparFiltros={limparFiltros}
        />
      )}

      {carregando && <p className="dashboard-status"><span className="status-ponto" /> Lendo a base de dados...</p>}
      {erro && <p className="dashboard-status dashboard-status-erro">{erro}</p>}

      {!carregando && !erro && (
        <>
          {paginaAtiva === "geral" && (
            <>
              <section className="dashboard-indicadores">
                <div className="indicadores-cabecalho">
                  <div>
                    <h3>Números em destaque</h3>
                    <p>Indicadores consolidados na referência selecionada</p>
                  </div>
                  <span className="indicadores-periodo">{periodo}</span>
                </div>
                <div className="indicadores-grid">
                  <article className="indicador-card indicador-ciano">
                    <span className="indicador-sinal">01 / VOLUME</span>
                    <span className="indicador-titulo">Frota circulante</span>
                    <strong>{formatarNumero(indicadores.frotaCirculante)}</strong>
                    <span className="indicador-descricao">Veículos em circulação</span>
                  </article>
                  <article className="indicador-card indicador-ambar">
                    <span className="indicador-sinal">02 / REGISTROS</span>
                    <span className="indicador-titulo">Frota total</span>
                    <strong>{formatarNumero(indicadores.frotaTotal)}</strong>
                    <span className="indicador-descricao">Total de veículos registrados</span>
                  </article>
                  <article className="indicador-card indicador-violeta">
                    <span className="indicador-sinal">03 / CONTEXTO</span>
                    <span className="indicador-titulo">População</span>
                    <strong>{formatarNumero(indicadores.populacao)}</strong>
                    <span className="indicador-descricao">Habitantes somados na base</span>
                  </article>
                  <article className="indicador-card indicador-coral">
                    <span className="indicador-sinal">04 / COBERTURA</span>
                    <span className="indicador-titulo">Municípios</span>
                    <strong>{formatarNumero(indicadores.municipios)}</strong>
                    <span className="indicador-descricao">Códigos IBGE válidos</span>
                  </article>
                </div>
              </section>

              <div className="secao-graficos-titulo">
                <div><span>LEITURA DO CENÁRIO</span><h3>Como a frota se distribui no tempo e no território</h3></div>
                <small>Referência dos indicadores: {periodo}</small>
              </div>
              <section className="dashboard-graficos-grid">
                <GraficoEvolucaoFrota dados={dadosEvolucao} descricao={descricaoEvolucao} />
                <GraficoFrotaRegional dados={dadosRegionais} />
              </section>
              <p className="dashboard-nota-metodologica">
                A série apresenta os meses disponíveis de {ano}. Os indicadores e rankings usam somente a fotografia mensal de {periodo}; os valores de meses diferentes não são somados.
              </p>
            </>
          )}

          {paginaAtiva === "regioes" && (
            <>
              <div className="secao-graficos-titulo">
                <div><span>COMPARAÇÃO TERRITORIAL</span><h3>Quatro leituras para comparar as regiões</h3></div>
                <small>Referência: {periodo}</small>
              </div>
              <section className="dashboard-graficos-grid dashboard-graficos-regioes">
                <GraficoFrotaRegional dados={dadosRegionais} />
                <GraficoParticipacaoRegional dados={dadosRegionais} />
                <GraficoTreemap dados={dadosRegionais} />
                <GraficoRadarRegional dados={dadosRegionais} />
              </section>
            </>
          )}

          {paginaAtiva === "municipios" && (
            <>
              <div className="dashboard-contexto-grafico">
                <strong>{dadosTopMunicipios.length ? `${dadosTopMunicipios.length} municípios no ranking` : "Nenhum município encontrado"}</strong>
                <span>Os dois gráficos respeitam os filtros e a pesquisa. A dispersão considera até 50 municípios da seleção.</span>
              </div>
              <section className="dashboard-graficos-grid dashboard-graficos-comparacao">
                <GraficoTopMunicipios dados={dadosTopMunicipios} />
                <GraficoCorrelacao
                  titulo="População x frota"
                  descricao="Cada ponto representa um município entre os 50 maiores da seleção."
                  dados={dadosCorrelacaoMunicipios}
                  tipo="municipios"
                />
              </section>
            </>
          )}

          {paginaAtiva === "estados" && (
            <>
              <div className="dashboard-contexto-grafico">
                <strong>{dadosEstados.length} unidades federativas na seleção</strong>
                <span>O ranking destaca as 10 maiores frotas; a dispersão exibe todas as UFs disponíveis no recorte.</span>
              </div>
              <section className="dashboard-graficos-grid dashboard-graficos-comparacao">
                <GraficoTopEstados dados={dadosTopEstados} />
                <GraficoCorrelacao
                  titulo="População x frota por estado"
                  descricao="Observe como o tamanho da população se relaciona ao volume da frota."
                  dados={dadosEstados}
                  tipo="estados"
                />
              </section>
            </>
          )}
        </>
      )}
    </Layout>
  );
}

export default Dashboard;
