
const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");
const tablaBody = document.querySelector("#tablaPasos tbody");

// Tamaño de escala
let escala = 20;
//se cambia a let para poder actualizar el valor 
//
function dibujarEscalas(ctx) {
            ctx.strokeStyle = "#ddd"; 
            ctx.fillStyle = "black";
            ctx.font = "10px Arial";

            for (let i = 0; i <= canvas.width; i += escala) {
                // Eje X
                ctx.fillText(i / escala, i + 2, canvas.height - 2);
                // Eje Y (Invertido), ya que no inicia desde 0
                ctx.fillText((canvas.height - i) / escala, 2, i - 2);

                // Líneas de las escalas
                ctx.beginPath();
                ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
                ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        }
    
    
// Llamada inicial para ver las escalas al cargar
dibujarEscalas(ctx);

//dibuja el punto de las coordenadas dadas y registra los valores en la tabla
function plot(x, y, err, paso) {
    // Rellenar pixel
    const yReal = canvas.height - (y * escala) - escala;
    ctx.fillStyle = "green";
    ctx.fillRect(x * escala, yReal, escala, escala);

    // Agregar la fila
    const fila = `<tr>
        <td>${paso}</td>
        <td>${x}</td>
        <td>${y}</td>
        <td>${err}</td>
    </tr>`;
    tablaBody.innerHTML += fila;
}

function bresenham(x0, y0, x1, y1) {
    // Distancia entre los puntos
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    let contadorPasos = 0;

    while (true) {
        // Dibujar el punto actual
        plot(x0, y0, err, contadorPasos);

        // Condición de finalización
        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;

        // Ajuste en el eje X
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        // Ajuste en el eje Y
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
        //Añadir contador de pasos
        contadorPasos++;
    }
}
function dibujar() {
    // 1. Obtener valores de los inputs
    const x0 = parseInt(document.getElementById("x0").value);
    const y0 = parseInt(document.getElementById("y0").value);
    const x1 = parseInt(document.getElementById("x1").value);
    const y1 = parseInt(document.getElementById("y1").value);

    // 2. Limpiar canvas y tabla
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tablaBody.innerHTML = "";

    // 3. Redibujar fondo y escalas
    dibujarEscalas(ctx);

    // 4. Ejecutar el algoritmo
    bresenham(x0, y0, x1, y1);
}
function actualizarEscala() {
    // 1. Obtener la opcion
    const nuevaEscala = parseInt(document.getElementById("selectEscala").value);
    
    //actualizar la escala
    escala = nuevaEscala; 

    //redibujar
    dibujar(); 
}

let puntosClickeados = 0; // añade un contador para saber si es el primer o segundo click

//captura las coordenadas y grafic
canvas.addEventListener("mousedown", function(e) {
    const rect = canvas.getBoundingClientRect();
    
    // Calcular coordenadas lógicas según la escala
    const xClic = Math.floor((e.clientX - rect.left) / escala);
    const yClic = Math.floor((canvas.height - (e.clientY - rect.top)) / escala);

    if (puntosClickeados === 0) {
        // PRIMER click establece x1 y y1
        document.getElementById("x0").value = xClic;
        document.getElementById("y0").value = yClic;
        
        // Dibujamos un pequeño punto temporal
        ctx.fillStyle = "red";
        const yReal = canvas.height - (yClic * escala) - escala;
        ctx.fillRect(xClic * escala, yReal, escala, escala);
        
        puntosClickeados = 1;
    } else {
        // SEGUNDO click establece x2, y2 y grafica
        document.getElementById("x1").value = xClic;
        document.getElementById("y1").value = yClic;
        
        puntosClickeados = 0; // reiniciar el contador
        dibujar(); // Llamamos a la función principal
    }
});
