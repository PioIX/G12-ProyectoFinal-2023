let resultElement
let mainContainer
let idLinea
let puntos_actuales = 0
let WORDS = []
async function traerPalabras() {
    try {
        const response = await fetch("/traerPalabras", {
          method: "GET", // or 'POST'
          headers: {
            "Content-Type": "application/json",
          },
        });
        //En result obtengo la respuesta
        const result = await response.json();
        console.log("Success:", result.palabras)
        for (let i = 0; i < result.palabras.length; i++) {
            WORDS.push(result.palabras[i].palabra.toUpperCase())
            
        }
        console.log(WORDS)
        rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
        console.log(rightGuessString)
        inicio()
        } 
    catch (error) {
    console.error("Error:", error);
      }
        
}

class Letra {
    constructor(letra) {
        this.letra = letra;
        this.colocada = false;
        this.colocadaCorrecta = false;
    }
}

let palabra
let palabraSepa
let letras = [];
let lineaNow

function inicio() {
    resultElement = document.querySelector('.result');
    mainContainer = document.querySelector('.main-container')
    idLinea = 1;

    palabra = rightGuessString;    
    palabraSepa = palabra.toUpperCase().split('');
    console.log(palabraSepa)
    
    for(let i = 0; i < palabraSepa.length; i++){
        letras[i] = new Letra(palabraSepa[i]);
    }
        

    lineaNow = document.querySelector('.rowAndy')

    drawSquares(lineaNow);
    listenInput(lineaNow)
    
    addfocus(lineaNow)
}


function wordCount(ggg) {
    let ContadorLetra = {}
    for (let u = 0; u < palabra.length; u++) {
        ggg = palabra[u]
        if (ContadorLetra[ggg]) {
            ContadorLetra[ggg] += 1;
        }
        else{
            ContadorLetra[ggg] = 1;
        }
    }
    console.log(ContadorLetra)
}
async function enviarPuntaje(data) {
    try {
        const response = await fetch("/traerpuntaje", {
          method: "PUT", // or 'POST'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        } 
    catch (error) {
    console.error("Error:", error);
      }
        
}
function enviarPuntos(){
    let data = {
        puntos_actuales: puntos_actuales
    }
    if (puntos_actuales>0){
        console.log(data)
        enviarPuntaje(data)
    }
  }




function listenInput(lineaNow){
    let squares = lineaNow.querySelectorAll('.square')
    squares= [...squares]
    
    let userInput = []
    
    squares.forEach(element =>{
        element.addEventListener('input', event=>{
            if (event.inputType !== 'deleteContentBackward') {
                userInput.push(event.target.value.toUpperCase())
                console.log(userInput)
                if (event.target.nextElementSibling) {
                    event.target.nextElementSibling.focus();    
                }else{
                    let squaresFilled = document.querySelectorAll('.square')
                    squaresFilled = [...squaresFilled]
                    let last5SquaresFilled = squaresFilled.slice(-palabra.length)
                    let finalUserInput = [];
                    last5SquaresFilled.forEach(element =>{
                        finalUserInput.push(element.value.toUpperCase())
                    })

                    for (let i = 0; i < letras.length; i++) {
                        letras[i].colocada = false;
                        letras[i].colocadaCorrecta = false;
                    }

                    console.log(letras)

                    for(let j = 0; j < finalUserInput.length; j++) {
                        if(letras[j].letra == finalUserInput[j] && letras[j].colocada == false) {
                            squares[j].classList.add('verde');
                            console.log("verde j ",j)
                            letras[j].colocadaCorrecta = true;
                        }
                    }    
                    

                    console.log(letras)
                    for(let j = 0; j < finalUserInput.length; j++) {
                        for(let i = 0; i < letras.length; i++) {
                            if(j != i) {
                                if(letras[i].colocadaCorrecta == false){
                                    if(letras[i].letra == finalUserInput[j] && letras[j].colocadaCorrecta == false && letras[i].colocada == false){
                                        squares[j].classList.add('amarillo');
                                            letras[i].colocada = true;
                                        console.log("amarillo j - i:  ",j,i)
                                        console.log(squares[j])
                                        console.log(letras[i])
                                    }
                                }    
                            }
                        }    
                    }


                    /*let posicionCorrecta = compareArrays(palabraSepa, finalUserInput)
                    posicionCorrecta.forEach(element => {
                        squares[element].classList.add('verde')
                    })
                    

                    let existePeroNo = existLetter(palabraSepa, finalUserInput)
                    existePeroNo.forEach(element => {
                        
                        squares[element].classList.add('amarillo');
                    })
                    console.log(posicionCorrecta)*/

                    let gane = true;
                    for(let i = 0; i < letras.length; i++) {
                        if(letras[i].letra != finalUserInput[i] || letras[i].colocadaCorrecta == false)
                            gane = false;
                    }
                   
                    if (gane == true) {
                        if (idLinea==1){
                            puntos_actuales=10
                            showResult('Ganaste pichichi')
                        }
                        if (idLinea==2){
                            puntos_actuales=8
                            showResult('Ganaste pichichi')
                        }
                        if (idLinea==3){
                            puntos_actuales=6
                            showResult('Ganaste pichichi')
                        }
                        if (idLinea==4){
                            puntos_actuales=4
                            showResult('Ganaste pichichi')
                        }
                        if (idLinea==5){
                            puntos_actuales=2
                            showResult('Ganaste pichichi')
                        }
                        console.log(puntos_actuales)
                        
                        return;
                    }
                    let lineaNow = createRow()
                    if (!lineaNow) {
                        return
                    }
                    drawSquares(lineaNow)
                    listenInput(lineaNow)
                    addfocus(lineaNow)
        
                    
        
                }
            }else{
                userInput.pop();
            }
            
            
        });
    })
}

function letterInWord() {
    
}

function compareArrays(array1, array2){
    let igualesIndex = []
    array1.forEach((element, index)=>{
        if (element == array2[index]){
            wordCount(array1)
            console.log(`EN la posicion ${index} si son igulaes`)
            igualesIndex.push(index);
        }else{
            console.log(`En la posicion ${index} no son iguales`)
        }
    })
    return igualesIndex
}

function existLetter(array1, array2){
    let existIndexArray = []
    let existLetterArray = []
    array2.forEach((element, index)=>{
        if(array1.includes(element)){
            existIndexArray.push(index)
            existLetterArray.push(element)
            console.log(existLetterArray)
        }
    });
    return existIndexArray
}

function createRow() {
    idLinea++
    if (idLinea <= 5){
        let newRow = document.createElement('div');
        newRow.classList.add('rowAndy')
        newRow.setAttribute('id', idLinea)
        mainContainer.appendChild(newRow)
        return newRow;
    }else{
        showResult('sos un burro perdiste rey')
    }
    
}

function drawSquares(lineaNow) {
    palabraSepa.forEach((item, index) =>{
        if (index === 0) {
            lineaNow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
        }else{
            lineaNow.innerHTML += `<input type="text" maxlength="1" class="square">`
        }
        
    })
}

function addfocus(lineaNow) {
    let focusElement = lineaNow.querySelector('.focus')
    focusElement.focus();
       
}

function showResult(textMsg) {
    resultElement.innerHTML = `
    <p> ${textMsg}</p>
    <button class="button">Reiniciar</button>
    <form action="/tabla" method="GET" class="container-sm">
        <div class="mb-3 form-group" id="klk"> 
            <div class="mb-3 form-check"></div>
            <input type="submit" class=" button" value="tabla">
        </div>
    </form>
    `
    let resetButton = document.querySelector('.button')
    resetButton.addEventListener('click', ()=>{
        location.reload();
    });
}