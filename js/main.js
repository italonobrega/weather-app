// ==========================================
// CONFIGURAÇÕES E SELETORES
// ==========================================
const API_KEY = 'e88422244b1aee48e6cdd7e4d45e33c2'; // <-- Cole sua chave do OpenWeatherMap aqui (mantenha as aspas)

const form = document.getElementById('form-busca');
const input = document.getElementById('input-cidade');
const climaResultado = document.getElementById('clima-resultado');
const erroDiv = document.getElementById('erro');

// ==========================================
// EVENTO DE BUSCA
// ==========================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const cidade = input.value.trim();
  if (!cidade) return;

  // Chama a função principal passando o nome da cidade
  await buscarClima(cidade);
});

// ==========================================
// FUNÇÃO PRINCIPAL (CONSOME A API)
// ==========================================
// O termo 'async' avisa ao navegador que esta função tem operações demoradas (como ir buscar dados noutro servidor)
async function buscarClima(cidade) {
  try {
    // 1. Limpa a tela antes de buscar
    climaResultado.classList.add('escondido');
    erroDiv.classList.add('escondido');

    // 2. Monta o link da API com a cidade, a sua chave, unidades em Celsius (metric) e idioma (pt_br)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;

    // 3. O 'await fetch' vai lá no servidor do clima e espera a resposta voltar
    const resposta = await fetch(url);

    // 4. Se a resposta não vier com status 200 (OK), significa que algo falhou (ex: cidade não existe)
    if (!resposta.ok) {
      throw new Error('Cidade não encontrada'); // Esse erro joga a execução direto para o bloco 'catch'
    }

    // 5. Transforma a resposta do servidor em um objeto JavaScript (JSON) legível
    const dados = await resposta.json();

    // 6. Mostra no console para analisarmos!
    console.log("DADOS RECEBIDOS DA API:", dados);

    // 7. Manda os dados para a função que desenha a tela
    mostrarClima(dados);

  } catch (erro) {
    // Se der qualquer problema (cidade errada, falha na internet, chave inválida), o código cai aqui
    console.error("Erro na busca:", erro);
    erroDiv.classList.remove('escondido');
  }
}

// ==========================================
// ATUALIZAR A INTERFACE (DOM)
// ==========================================
function mostrarClima(dados) {
  // Puxa os dados específicos de dentro do objeto JSON (a API devolve em inglês, mas nós traduzimos o formato)
  const nomeCidade = dados.name;
  const temperatura = Math.round(dados.main.temp); // Arredonda a temperatura (ex: 28.6 vira 29)
  const sensacao = Math.round(dados.main.feels_like);
  const umidade = dados.main.humidity;
  const velocidadeVento = (dados.wind.speed * 3.6).toFixed(1); // Converte de m/s para km/h
  const descricao = dados.weather[0].description;
  const iconeCode = dados.weather[0].icon;

  // Monta a URL do ícone oficial do OpenWeatherMap
  const iconeUrl = `https://openweathermap.org/img/wn/${iconeCode}@4x.png`;

  // Injeta os dados no HTML usando os IDs que criamos
  document.getElementById('cidade').textContent = nomeCidade;
  document.getElementById('temperatura').textContent = `${temperatura}°C`;
  document.getElementById('sensacao').textContent = `${sensacao}°C`;
  document.getElementById('umidade').textContent = `${umidade}%`;
  document.getElementById('vento').textContent = `${velocidadeVento} km/h`;
  document.getElementById('descricao').textContent = descricao;
  document.getElementById('icone-clima').setAttribute('src', iconeUrl);
  document.getElementById('icone-clima').setAttribute('alt', descricao);

  // Mostra a div do resultado na tela
  climaResultado.classList.remove('escondido');
}