
import Papa from "papaparse";

const CAMINHO_DATASET =
  "/datasets/Localidade_DadosAbertos_20230613.csv";

export function carregarDataset() {
  console.log("Iniciando carregamento do CSV...");

  return new Promise((resolve, reject) => {
    Papa.parse(CAMINHO_DATASET, {
      download: true,
      header: true,
      delimiter: ";",
      dynamicTyping: true,
      skipEmptyLines: true,

      complete: (resultado) => {
        console.log("CSV processado!");
        console.log("Total de registros:", resultado.data.length);
        console.log("Erros:", resultado.errors);

        resolve(resultado.data);
      },

      error: (erro) => {
        console.error("Erro ao carregar CSV:", erro);
        reject(erro);
      },
    });
  });
}
