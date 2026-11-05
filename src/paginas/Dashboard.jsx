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

function prepararTopMunicipios(dados, ano, mes) {
  if (!ano || !mes) {
    return [];
  }

  const dadosReferencia = dados.filter(
    (registro) =>
      Number(registro.ano_referencia) === ano &&
      Number(registro.mes_referencia) === mes
  );

  return dadosReferencia
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

function Dashboard() {
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
      dadosReferencia.map((registro) => registro.codigo_ibge)
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
      prepararTopMunicipios(dados, indicadores.ano, indicadores.mes),
    [dados, indicadores.ano, indicadores.mes]
  );

  const dadosTopEstados = useMemo(
    () => prepararTopEstados(dados, indicadores.ano, indicadores.mes),
    [dados, indicadores.ano, indicadores.mes]
  );

  return (
    <Layout>
      <section className="dashboard-welcome">
        <span className="welcome-label">DADOS ABERTOS · BRASIL</span>

        <h2>
          Análise da frota
          <span> brasileira.</span>
        </h2>

        <p>
          Explore os dados da frota nacional com visualizações interativas
          desenvolvidas em Recharts.
        </p>
      </section>

      <section className="dashboard-indicadores">
        <div className="indicadores-cabecalho">
          <div>
            <h3>Visão geral</h3>
            <p>Principais indicadores da base nacional</p>
          </div>

          {indicadores.ano && (
            <span className="indicadores-periodo">
              Referência: {indicadores.mes}/{indicadores.ano}
            </span>
          )}
        </div>

        {carregando && (
          <p className="indicadores-mensagem">Carregando indicadores...</p>
        )}

        {erro && <p className="indicadores-erro">{erro}</p>}

        {!carregando && !erro && (
          <div className="indicadores-grid">
            <div className="indicador-card">
              <span className="indicador-titulo">Frota circulante</span>
              <strong>{formatarNumero(indicadores.frotaCirculante)}</strong>
              <span className="indicador-descricao">
                Veículos em circulação
              </span>
            </div>

            <div className="indicador-card">
              <span className="indicador-titulo">Frota total</span>
              <strong>{formatarNumero(indicadores.frotaTotal)}</strong>
              <span className="indicador-descricao">
                Total de veículos registrados
              </span>
            </div>

            <div className="indicador-card">
              <span className="indicador-titulo">População</span>
              <strong>{formatarNumero(indicadores.populacao)}</strong>
              <span className="indicador-descricao">
                Habitantes dos municípios
              </span>
            </div>

            <div className="indicador-card">
              <span className="indicador-titulo">Municípios</span>
              <strong>{formatarNumero(indicadores.municipios)}</strong>
              <span className="indicador-descricao">
                Municípios contemplados
              </span>
            </div>
          </div>
        )}
      </section>

      {!carregando && !erro && (
        <section className="dashboard-graficos-grid">
          <GraficoEvolucaoFrota dados={dadosEvolucao} />

          <GraficoFrotaRegional dados={dadosRegionais} />

          <GraficoTopMunicipios dados={dadosTopMunicipios} />

          <GraficoTopEstados dados={dadosTopEstados} />

          <GraficoTreemap dados={dadosRegionais} />
        </section>
      )}
    </Layout>
  );
}

export default Dashboard;
