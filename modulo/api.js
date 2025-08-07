export const getCarrosselFotos = async () => {
	const url = 'https://slider-back-end.onrender.com/fotos'
	const response = await fetch(url)
	const data = await response.json()
	console.log(data)
}
