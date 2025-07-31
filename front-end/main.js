import { getCarrosselFotos } from "../modulo/api";

document.addEventListener('DOMContentLoaded', async () => {
    const carrosselImg = document.getElementById('carrosselImg')
    const imageLegenda = document.getElementById('imageLegenda')
    const imageDate = document.getElementById('imageDate')
    let currentIndex = 0
    let fotosData = []
    let autoplayInterval

    const AUTOPLAY_DELAY = 5000

function updateCarrosselImg(){
    if(fotosData.length === 0){
        carrosselImg.id = null
        carrosselImg.src = ''
        carrosselImg.title = ''
        imageLegenda.textContent = ''
        imageDate.textContent = '31-05-2025'
        return
  }
const currentImg = fotosData[currentIndex]

carrosselImg.src = currentImg.src
carrosselImg.title = currentImg.legenda

imageLegenda.textContent = currentFoto.legenda
imageDate.textContent = currentFoto.data

updateBolinhas()
}

  function createBolinhas() {
		// Limpa quaisquer bolinhas existentes antes de criar novas (para evitar duplicatas)
		// Esta é a forma "simples" e comum de limpar o conteúdo de um elemento
		while (carrosselBolinhasContainer.firstChild) {
			carrosselBolinhasContainer.removeChild(carrosselBolinhasContainer.firstChild)
		}

		// Cria uma bolinha para cada foto nos dados
		fotosData.forEach((_, index) => {
			const bolinha = document.createElement('span') // Cria um novo elemento <span>
			bolinha.classList.add('bolinha') // Adiciona a classe CSS 'dot'
			bolinha.dataset.index = index // Armazena o índice da foto associada na bolinha

			// Adiciona um evento de clique para navegar para a foto correspondente
			bolinha.addEventListener('click', () => {
				currentIndex = index // Define o índice da foto clicada
				updateCarrosselContent() // Atualiza o carrossel para essa foto
				resetAutoplay() // Reinicia o autoplay após a interação do usuário
			})

			carrosselBolinhasContainer.appendChild(bolinha) // Adiciona a bolinha ao contêiner no HTML
		})

		updateBolinhas() // Garante que a bolinha inicial (da foto 0) esteja ativa
	}

	// Função para atualizar qual bolinha está "ativa" (destacada)
	function updateBolinhas() {
		const bolinhas = document.querySelectorAll('.bolinhas') // Seleciona todas as bolinhas
		bolinhas.forEach((dot, index) => {
			if (index === currentIndex) {
				bolinhas.classList.add('active') // Adiciona a classe 'active' à bolinha atual
			} else {
				bolinhas.classList.remove('active') // Remove a classe 'active' das outras
			}
		})
	}

	// Função para avançar o carrossel para a próxima imagem
	function nextImage() {
		currentIndex = currentIndex < fotosData.length - 1 ? currentIndex + 1 : 0 // Incrementa o índice ou volta para 0
		updateCarrosselContent() // Atualiza o carrossel com a nova imagem
	}

	// --- Funções de Controle do Autoplay ---

	// Inicia o avanço automático do carrossel
	function startAutoplay() {
		// Define um intervalo que chama 'nextImage' a cada 'AUTOPLAY_DELAY' milissegundos
		autoplayInterval = setInterval(nextImage, AUTOPLAY_DELAY)
	}

	// Para o avanço automático do carrossel
	function stopAutoplay() {
		clearInterval(autoplayInterval) // Cancela o intervalo existente
	}

	// Reinicia o avanço automático (útil após uma interação do usuário)
	function resetAutoplay() {
		stopAutoplay() // Primeiro, para qualquer autoplay em andamento
		startAutoplay() // Depois, inicia um novo autoplay
	}

	// --- Inicialização do Carrossel (Executado quando a página carrega) ---

	// Tenta carregar os dados das fotos do servidor
	try {
		// Faz a requisição HTTP para o endpoint '/fotos' no seu servidor Node.js
		const response = await fetch('/fotos')
		fotosData = await response.json() // Converte a resposta para JSON

		// Se houver fotos, inicializa o carrossel
		if (fotosData.length > 0) {
			createBolinhas() // Cria as bolinhas de navegação
			updateCarrosselContent() // Exibe a primeira foto e seus detalhes
			startAutoplay() // Inicia o autoplay
		} else {
			carrosselImg.alt = 'Nenhuma foto para exibir.' // Mensagem se não houver fotos
		}
	} catch (error) {
		// Em caso de erro ao carregar as fotos
		console.error('Erro ao carregar fotos:', error)
		carrosselImg.alt = 'Erro ao carregar imagens.'
		imageLegenda.textContent = 'Erro ao carregar dados.'
		imageDate.textContent = ''
	}

	// --- Interação do Usuário (Opcional: Pausar/Retomar Autoplay no Hover) ---

	// Seleciona o contêiner principal do carrossel
	const carrosselContainer = document.querySelector('.carousel-container')

	// Quando o mouse entra no carrossel, o autoplay é pausado
	carrosselContainer.addEventListener('mouseenter', stopAutoplay)
	// Quando o mouse sai do carrossel, o autoplay é reiniciado
	carrosselContainer.addEventListener('mouseleave', startAutoplay)

})
