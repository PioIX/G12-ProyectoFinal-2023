const cuadrados = document.querySelectorAll('.cuadrado')
const bosco = document.querySelector('.bosco')
const tiempoGastado = document.querySelector('#tiempoGastado')
const puntaje = document.querySelector('#puntaje')

let resultado = 0
let posicion
let tiempo = 60
let temporizador = null

function alelatorioCuadrado() {
  cuadrados.forEach(cuadrado => {
    cuadrado.classList.remove('bosco')
  })

  let alelatorioCuadrado = cuadrados[Math.floor(Math.random() * 9)]
  console.log(Math.floor(Math.random() * 9))
  alelatorioCuadrado.classList.add('bosco')
  console.log(alelatorioCuadrado)
  posicion = alelatorioCuadrado.id
}

alelatorioCuadrado()

cuadrados.forEach(cuadrado => {
  cuadrado.addEventListener('mousedown', () => {
    if (cuadrado.id == posicion) {
      resultado++
      puntaje.textContent = resultado
      posicion = null
    }
  })
})

function moverBosco() {
  if (resultado<=8) {
    temporizador = setInterval(alelatorioCuadrado, 600)
  }else{
  temporizador = setInterval(alelatorioCuadrado, 100)
  } 
}

moverBosco()

function contador() {
 tiempo--
 tiempoGastado.textContent = tiempo

 if (tiempo == 0) {
   clearInterval(contadortimbero)
   clearInterval(temporizador)
   alert('¡Terminaste! tu resultado es  ' + resultado)
 }

}

let contadortimbero = setInterval(contador, 1000)


