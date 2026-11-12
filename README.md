# BR Analytics — Demonstração do Recharts

Projeto acadêmico desenvolvido com React, Vite e Recharts. A aplicação usa uma base histórica de dados abertos sobre a frota de veículos dos municípios brasileiros para demonstrar diferentes formas de preparar, filtrar e apresentar informações.

## O que o projeto demonstra

A proposta principal é mostrar como o Recharts pode ser integrado a uma aplicação React, desde a preparação dos dados até a apresentação de gráficos interativos. O tema da frota brasileira funciona como cenário demonstrativo; a mesma estrutura pode ser adaptada para indicadores financeiros, vendas, estoques, saúde, logística e outras áreas.

## Navegação e filtros

A aplicação possui quatro áreas de exploração:

1. **Visão geral** — indicadores consolidados, evolução mensal dentro do ano selecionado e comparação regional. Ano e mês definem uma competência específica para os indicadores.
2. **Regiões** — comparação entre as cinco regiões por volume, participação e indicadores proporcionais na competência selecionada.
3. **Municípios** — ranking, pesquisa textual e comparação entre população e frota. Permite filtrar por ano, mês, região e UF, além de pesquisar por município.
4. **Estados** — ranking das UFs e relação entre população e frota. Permite filtrar por ano, mês e região.

A barra lateral pode ser expandida ou recolhida. Os filtros são contextuais: cada tela apresenta somente os controles que fazem sentido para sua análise. Ano e mês sempre selecionam uma competência existente na base. Nas dimensões geográficas, é possível manter todas as regiões ou UFs. O botão **Limpar filtros extras** remove apenas os recortes geográficos e a pesquisa, sem alterar o período selecionado.

## Tipos de gráficos apresentados

| Visualização | Aplicação demonstrada |
|---|---|
| `AreaChart` | Evolução de uma medida ao longo do tempo |
| `BarChart` | Comparação de categorias e rankings |
| `PieChart` (rosca) | Participação percentual de cada categoria |
| `Treemap` | Composição proporcional em áreas |
| `RadarChart` | Comparação de indicadores relativos em várias dimensões |
| `ScatterChart` | Relação entre duas variáveis numéricas |

Também são utilizados `ResponsiveContainer`, `Tooltip`, `Legend`, `LabelList`, eixos e grades para tornar as visualizações responsivas e facilitar a leitura dos valores.

## Tecnologias

- **React** — interface organizada em componentes.
- **Vite** — ambiente de desenvolvimento e build.
- **Recharts** — visualizações interativas.
- **PapaParse** — leitura do arquivo CSV.
- **Lucide React** — ícones da navegação e dos filtros.

## Dataset

Arquivo: `public/datasets/Localidade_DadosAbertos_20230613.csv`  
Separador: ponto e vírgula (`;`)  
Cabeçalho: sim  
Registros: 347.014  
Colunas: 12  
Período disponível: 2018 a fevereiro de 2023.

Campos utilizados: ano e mês de referência, região, UF, código IBGE, município, quantidade de habitantes, frota total e frota circulante.

### Cuidados metodológicos

- Os indicadores, rankings e comparações usam somente a competência mensal selecionada pelo usuário (ano + mês).
- O gráfico de evolução apresenta todos os meses disponíveis do ano selecionado. Cada mês é um ponto independente da série, calculado pela soma dos registros municipais daquela competência.
- A escolha do mês altera os indicadores e rankings, mas não elimina os demais meses da série histórica do ano; assim, a tela permite analisar uma fotografia mensal e, em paralelo, observar sua evolução ao longo do ano.
- Registros com `codigo_ibge = 0` são desconsiderados na contagem de municípios, nos rankings e na comparação municipal.
- O CSV contém fotografias mensais da frota e da população. Não se somam fotografias de meses diferentes para produzir um indicador pontual, pois isso contaria repetidamente os mesmos veículos. A soma é feita apenas entre municípios da mesma competência ou entre municípios de cada mês ao montar a série histórica.
- O radar apresenta a quantidade de veículos por 100 habitantes, permitindo comparar proporções e não somente volumes absolutos.
- A dispersão municipal considera até 50 municípios com maior frota no recorte; a dispersão estadual considera todas as UFs disponíveis.

Os dados são históricos e não representam indicadores em tempo real.

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
    graficos/       # componentes Recharts e tooltips
    layout/         # sidebar, header, layout e filtros
  paginas/          # dashboards e preparação dos dados
  servicos/         # carregamento do CSV com PapaParse
  styles/           # estilos globais
public/
  datasets/         # base CSV utilizada pela demonstração
Apresentacao/       # apresentação do projeto
```
