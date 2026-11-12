import { useEffect, useMemo, useState } from "react";

import Layout from "../componentes/layout/Layout";
import GraficoEvolucaoFrota from "../componentes/graficos/GraficoEvolucaoFrota";
import GraficoFrotaRegional from "../componentes/graficos/GraficoFrotaRegional";
import GraficoTopMunicipios from "../componentes/graficos/GraficoTopMunicipios";
import GraficoTopEstados from "../componentes/graficos/GraficoTopEstados";
import GraficoTreemap from "../componentes/graficos/GraficoTreemap";
import { carregarDataset } from "../servicos/datasetService";

import "./Dashboard.css";

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor || 0);
}

function prepararDadosEvolucao(dados) {
  const anos = [
    ...new Set(dados.map((registro) => Number(registro.ano_referencia))),
  ].filter(Boolean);

  return anos
    .sort((a, b) => a - b)
    .map((ano) => {
      const dadosDoAno = dados.filter(
        (registro) => Number(registro.ano_referencia) === ano
      );

      const mesMaisRecente = dadosDoAno.reduce(
        (maior, registro) =>
          Math.max(maior, Number(registro.mes_referencia) || 0),
        0
      );

      const dadosReferencia = dadosDoAno.filter(
        (registro) => Number(registro.mes_referencia) === mesMaisRecente
      );

      const frotaCirculante = dadosReferencia.reduce(
        (total, registro) =>
          total + (Number(registro.frota_circulante) || 0),
        0
      );

      return {
        ano,
        frotaCirculante,
      };
    });
}

function prepararDadosRegionais(dados, ano, mes) {
  if (!ano || !mes) {
    return [];
  }

  const dadosReferencia = dados.filter(
    (registro) =>
      Number(registro.ano_referencia) === ano &&
      Number(registro.mes_referencia) === mes
  );

  const agrupamento = dadosReferencia.reduce((resultado, registro) => {
    const regiao = registro.regiao || "Não informada";

    if (!resultado[regiao]) {
      resultado[regiao] = 0;
    }

    resultado[regiao] += Number(registro.frota_circulante) || 0;

    return resultado;
  }, {});

  return Object.entries(agrupamento)
    .map(([regiao, frotaCirculante]) => ({
      regiao,
      frotaCirculante,
    }))
    .sort((a, b) => b.frotaCirculante - a.frotaCirculante);
}

function prepararTopMunicipios(dados, ano, mes, busca = "") {
  if (!ano || !mes) {
    return [];
  }

  const dadosReferencia = dados.filter(
    (registro) =>
      Number(registro.ano_referencia) === ano &&
      Number(registro.mes_referencia) === mes
  );

  const termo = busca.trim().toLocaleLowerCase("pt-BR");

  return dadosReferencia
    .filter((registro) => Number(registro.codigo_ibge) > 0)
    .filter((registro) => {
      if (!termo) return true;
      return `${registro.municipio || ""} ${registro.uf || ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(termo);
    })
    .map((registro) => ({
      municipio: registro.municipio,
      uf: registro.uf,
      frotaCirculante: Number(registro.frota_circulante) || 0,
    }))
    .sort((a, b) => b.frotaCirculante - a.frotaCirculante)
    .slice(0, 10)
    .map((registro) => ({
      ...registro,
      municipio: `${registro.municipio} - ${registro.uf}`,
    }));
}

function prepararTopEstados(dados, ano, mes) {
  if (!ano || !mes) {
    return [];
  }

  const dadosReferencia = dados.filter(
    (registro) =>
      Number(registro.ano_referencia) === ano &&
      Number(registro.mes_referencia) === mes
  );

  const agrupamento = dadosReferencia.reduce((resultado, registro) => {
    const uf = registro.uf || "Não informada";

    if (!resultado[uf]) {
      resultado[uf] = 0;
    }

    resultado[uf] += Number(registro.frota_circulante) || 0;

    return resultado;
  }, {});

  return Object.entries(agrupamento)
    .map(([uf, frotaCirculante]) => ({
      uf,
      frotaCirculante,
    }))
    .sort((a, b) => b.frotaCirculante - a.frotaCirculante)
    .slice(0, 10);
}

const CONFIG_PAGINAS = {
  geral: { titulo: "Visão geral", descricao: "Indicadores nacionais e panorama da frota brasileira." },
  regioes: { titulo: "Análise por regiões", descricao: "Distribuição e participação da frota nas cinco regiões do Brasil." },
  municipios: { titulo: "Análise por municípios", descricao: "Consulte e compare os municípios com maior frota circulante." },
  estados: { titulo: "Análise por estados", descricao: "Ranking dos estados com maior frota circulante." },
};

function Dashboard() {
  const [paginaAtiva, setPaginaAtiva] = useState("geral");
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDataset()
      .then((resultado) => {
        setDados(resultado);
      })
      .catch((erro) => {
        console.error("Erro ao carregar indicadores:", erro);
        setErro("Não foi possível carregar os dados do dataset.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const indicadores = useMemo(() => {
    if (dados.length === 0) {
      return {
        ano: null,
        mes: null,
        frotaCirculante: 0,
        frotaTotal: 0,
        populacao: 0,
        municipios: 0,
      };
    }

    const anoMaisRecente = dados.reduce(
      (maior, registro) =>
        Math.max(maior, Number(registro.ano_referencia) || 0),
      0
    );

    const dadosDoAno = dados.filter(
      (registro) => Number(registro.ano_referencia) === anoMaisRecente
    );

    const mesMaisRecente = dadosDoAno.reduce(
      (maior, registro) =>
        Math.max(maior, Number(registro.mes_referencia) || 0),
      0
    );

    const dadosReferencia = dadosDoAno.filter(
      (registro) => Number(registro.mes_referencia) === mesMaisRecente
    );

    const somar = (campo) =>
      dadosReferencia.reduce(
        (total, registro) => total + (Number(registro[campo]) || 0),
        0
      );

    const municipios = new Set(
      dadosReferencia
        .map((registro) => Number(registro.codigo_ibge))
        .filter((codigo) => codigo > 0)
    );

    return {
      ano: anoMaisRecente,
      mes: mesMaisRecente,
      frotaCirculante: somar("frota_circulante"),
      frotaTotal: somar("frota_total"),
      populacao: somar("qtde_habitantes"),
      municipios: municipios.size,
    };
  }, [dados]);

  const dadosEvolucao = useMemo(
    () => prepararDadosEvolucao(dados),
    [dados]
  );

  const dadosRegionais = useMemo(
    () =>
      prepararDadosRegionais(dados, indicadores.ano, indicadores.mes),
    [dados, indicadores.ano, indicadores.mes]
  );

  const dadosTopMunicipios = useMemo(
    () =>
      prepararTopMunicipios(dados, indicadores.ano, indicadores.mes, busca),
    [dados, indicadores.ano, indicadores.mes, busca]
  );

  const dadosTopEstados = useMemo(
    () => prepararTopEstados(dados, indicadores.ano, indicadores.mes),
    [dados, indicadores.ano, indicadores.mes]
  );

  const pagina = CONFIG_PAGINAS[paginaAtiva];
  const mostrarIndicadores = paginaAtiva === "geral";

  return (
    <Layout
      paginaAtiva={paginaAtiva}
      onNavegar={(pagina) => { setPaginaAtiva(pagina); setBusca(""); }}
      titulo={pagina.titulo}
      descricao={pagina.descricao}
      busca={busca}
      onBuscaChange={setBusca}
      mostrarBusca={paginaAtiva === "municipios"}
    >
      <section className="dashboard-welcome">
        <span className="welcome-label">DADOS ABERTOS · BRASIL</span>
        <h2>{paginaAtiva === "geral" ? <>Análise da frota <span>brasileira.</span></> : pagina.titulo}</h2>
        <p>Explore os dados da frota nacional com visualizações interativas desenvolvidas em Recharts.</p>
      </section>

      {mostrarIndicadores && (
        <section className="dashboard-indicadores">
          <div className="indicadores-cabecalho">
            <div><h3>Visão geral</h3><p>Principais indicadores da base nacional</p></div>
            {indicadores.ano && <span className="indicadores-periodo">Referência: {String(indicadores.mes).padStart(2, "0")}/{indicadores.ano}</span>}
          </div>
          {carregando && <p className="indicadores-mensagem">Carregando indicadores...</p>}
          {erro && <p className="indicadores-erro">{erro}</p>}
          {!carregando && !erro && (
            <div className="indicadores-grid">
              <div className="indicador-card"><span className="indicador-titulo">Frota circulante</span><strong>{formatarNumero(indicadores.frotaCirculante)}</strong><span className="indicador-descricao">Veículos em circulação</span></div>
              <div className="indicador-card"><span className="indicador-titulo">Frota total</span><strong>{formatarNumero(indicadores.frotaTotal)}</strong><span className="indicador-descricao">Total de veículos registrados</span></div>
              <div className="indicador-card"><span className="indicador-titulo">População</span><strong>{formatarNumero(indicadores.populacao)}</strong><span className="indicador-descricao">Habitantes dos municípios</span></div>
              <div className="indicador-card"><span className="indicador-titulo">Municípios</span><strong>{formatarNumero(indicadores.municipios)}</strong><span className="indicador-descricao">Municípios com código IBGE válido</span></div>
            </div>
          )}
        </section>
      )}

      {carregando && <p className="dashboard-status">Carregando base de dados...</p>}
      {erro && <p className="dashboard-status dashboard-status-erro">{erro}</p>}

      {!carregando && !erro && (
        <>
          {paginaAtiva === "geral" && (
            <section className="dashboard-graficos-grid">
              <GraficoEvolucaoFrota dados={dadosEvolucao} />
              <GraficoFrotaRegional dados={dadosRegionais} />
            </section>
          )}
          {paginaAtiva === "regioes" && (
            <section className="dashboard-graficos-grid dashboard-graficos-duplo">
              <GraficoFrotaRegional dados={dadosRegionais} />
              <GraficoTreemap dados={dadosRegionais} />
            </section>
          )}
          {paginaAtiva === "municipios" && (
            <section className="dashboard-graficos-grid dashboard-graficos-simples">
              <div className="dashboard-contexto-grafico">
                <strong>{dadosTopMunicipios.length ? `Exibindo ${dadosTopMunicipios.length} resultado(s)` : "Nenhum município encontrado"}</strong>
                <span>Referência: {String(indicadores.mes).padStart(2, "0")}/{indicadores.ano}. Pesquise pelo nome do município ou pela sigla da UF.</span>
              </div>
              <GraficoTopMunicipios dados={dadosTopMunicipios} />
            </section>
          )}
          {paginaAtiva === "estados" && (
            <section className="dashboard-graficos-grid dashboard-graficos-simples">
              <div className="dashboard-contexto-grafico">
                <strong>Os 10 estados com maior frota circulante</strong>
                <span>Valores agregados por UF no último mês disponível da base: {String(indicadores.mes).padStart(2, "0")}/{indicadores.ano}.</span>
              </div>
              <GraficoTopEstados dados={dadosTopEstados} />
            </section>
          )}
        </>
      )}
      {paginaAtiva === "geral" && !carregando && !erro && (
        <p className="dashboard-nota-metodologica">Nota: a evolução considera o último mês disponível de cada ano. Em 2023, a base termina em fevereiro; portanto, esse ponto não representa dezembro.</p>
      )}
    </Layout>
  );
}

export default Dashboard;
