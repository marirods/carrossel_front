class Slider {
	constructor() {
		this.currentSlide = 0
		this.slides = []
		this.autoInterval = null

		this.elements = {
			loading: document.getElementById('loading'),
			sliderWrapper: document.getElementById('sliderWrapper'),
			indicators: document.getElementById('indicators'),
			thumbnailPrev: document.getElementById('thumbnailPrev'),
			thumbnailNext: document.getElementById('thumbnailNext')
		}

		console.log(this.elements) // debug: veja se todos os elementos existem

		this.init()
	}

	async init() {
		try {
			await this.loadSlides()
			this.createSlides()
			this.createIndicators()
			this.setupEvents()
			this.showSlider()
			this.updateThumbnails()
			this.startAuto()
		} catch (error) {
			this.showError()
			console.error(error)
		}
	}

	async loadSlides() {
		const response = await fetch('http://localhost:3000/fotos')
		if (!response.ok) throw new Error('Erro ao carregar slides')
		this.slides = await response.json()
	}

	createSlides() {
		// limpa slides anteriores
		this.elements.sliderWrapper.innerHTML = ''

		this.slides.forEach((slide) => {
			const slideDiv = document.createElement('div')
			slideDiv.className = 'slide'
			slideDiv.style.backgroundImage = `url(${slide.imagem})`

			const content = document.createElement('div')
			content.className = 'slide-content'

			const legenda = document.createElement('p')
			legenda.textContent = slide.legenda

			const data = document.createElement('small')
			data.textContent = slide.data

			content.appendChild(legenda)
			content.appendChild(data)
			slideDiv.appendChild(content)

			this.elements.sliderWrapper.appendChild(slideDiv)
		})
	}

	createIndicators() {
		this.elements.indicators.innerHTML = ''

		this.slides.forEach((_, index) => {
			const indicator = document.createElement('div')
			indicator.className = `indicator ${index === 0 ? 'active' : ''}`
			indicator.addEventListener('click', () => this.goTo(index))
			this.elements.indicators.appendChild(indicator)
		})
	}

	setupEvents() {
		if (this.elements.thumbnailNext) {
			this.elements.thumbnailNext.addEventListener('click', () => {
				this.next()
				this.resetAuto()
			})
		}
		if (this.elements.thumbnailPrev) {
			this.elements.thumbnailPrev.addEventListener('click', () => {
				this.prev()
				this.resetAuto()
			})
		}

		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowRight') this.next()
			if (e.key === 'ArrowLeft') this.prev()
		})
	}

	showSlider() {
		if (this.elements.loading) this.elements.loading.style.display = 'none'
		if (this.elements.sliderWrapper) this.elements.sliderWrapper.classList.add('show')
	}

	showError() {
		if (this.elements.loading) this.elements.loading.textContent = 'Erro ao carregar imagens'
	}

	updateSlider() {
		const translateX = -this.currentSlide * 100
		if (this.elements.sliderWrapper) this.elements.sliderWrapper.style.transform = `translateX(${translateX}%)`

		document.querySelectorAll('.indicator').forEach((indicator, index) => {
			indicator.classList.toggle('active', index === this.currentSlide)
		})

		this.updateThumbnails()
	}

	updateThumbnails() {
		const totalSlides = this.slides.length
		if (totalSlides === 0) return

		const prevIndex = this.currentSlide === 0 ? totalSlides - 1 : this.currentSlide - 1
		const nextIndex = (this.currentSlide + 1) % totalSlides

		if (this.elements.thumbnailPrev) this.elements.thumbnailPrev.style.backgroundImage = `url(${this.slides[prevIndex].imagem})`
		if (this.elements.thumbnailNext) this.elements.thumbnailNext.style.backgroundImage = `url(${this.slides[nextIndex].imagem})`
	}

	next() {
		this.currentSlide = (this.currentSlide + 1) % this.slides.length
		this.updateSlider()
	}

	prev() {
		this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1
		this.updateSlider()
	}

	goTo(index) {
		this.currentSlide = index
		this.updateSlider()
		this.resetAuto()
	}

	startAuto() {
		this.autoInterval = setInterval(() => {
			this.next()
		}, 3000)
	}

	stopAuto() {
		clearInterval(this.autoInterval)
	}

	resetAuto() {
		this.stopAuto()
		this.startAuto()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Slider()
})
