# BR Analytics — Pacote Recharts

Projeto acadêmico desenvolvido com React, Vite e Recharts para demonstrar a leitura, preparação e visualização de dados abertos sobre a frota de veículos dos municípios brasileiros.

## Objetivo

Apresentar diferentes formas de visualização de dados usando componentes do Recharts, mantendo uma base única de dados e uma interface com navegação entre quatro dashboards.

## Dashboards

1. **Visão geral** — indicadores nacionais e evolução anual da frota circulante, além do comparativo regional.
2. **Regiões** — comparação da frota circulante nas cinco regiões e participação de cada região por meio de Treemap.
3. **Municípios** — ranking dos dez municípios com maior frota circulante, com pesquisa por nome ou UF.
4. **Estados** — ranking dos dez estados com maior frota circulante.

## Tecnologias

- React — construção da interface por componentes.
- Vite — servidor de desenvolvimento e build.
- Recharts — gráficos interativos e responsivos.
- PapaParse — leitura do arquivo CSV.
- Lucide React — ícones da navegação e interface.

## Dataset

Arquivo: `public/datasets/Localidade_DadosAbertos_20230613.csv`  
Separador: ponto e vírgula (`;`)  
Cabeçalho: sim  
Registros: 347.014  
Colunas: 12  
Período disponível: 2018 a fevereiro de 2023.

Campos utilizados: ano e mês de referência, região, UF, código IBGE, município, quantidade de habitantes, frota total e frota circulante.

### Cuidados metodológicos

- Os indicadores da visão geral usam a referência mais recente disponível na base: fevereiro de 2023.
- A evolução anual considera o último mês disponível de cada ano. Para 2018 a 2022, o mês é dezembro; para 2023, é fevereiro. Portanto, o ponto de 2023 não deve ser interpretado como um fechamento anual.
- Registros com `codigo_ibge = 0` representam localidade não informada e são desconsiderados na contagem de municípios e no ranking municipal.
- Os valores de população e frota são somados para a referência selecionada.

## Executar localmente

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

O Vite exibirá o endereço local no terminal.

## Gerar build de produção

```bash
npm run build
npm run preview
```

## Estrutura principal

```text
src/
  componentes/
    graficos/       # componentes Recharts
    layout/         # sidebar, header e layout
  paginas/          # dashboards e preparação dos dados
  servicos/         # carregamento do CSV com PapaParse
  styles/           # estilos globais
public/
  datasets/         # dataset CSV utilizado pelo projeto
Apresentacao/       # apresentação do projeto
```

## Componentes Recharts demonstrados

- `LineChart` / `Line`: evolução temporal.
- `BarChart` / `Bar`: comparação entre categorias e rankings.
- `Treemap`: composição proporcional por região.
- `ResponsiveContainer`: adaptação dos gráficos ao espaço disponível.
- `Tooltip`, `XAxis`, `YAxis` e `CartesianGrid`: contexto e leitura dos dados.

## Observação

O projeto é uma demonstração acadêmica de visualização e exploração de dados. Os números representam o conteúdo do CSV fornecido e não devem ser tratados como indicadores atuais em tempo real.
