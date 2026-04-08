
const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");
const tablaBody = document.querySelector("#tablaPasos tbody");

// Tamaño de escala
const escala = 20;

//
function dibujarEscalas(ctx) {
            ctx.strokeStyle = "#ddd"; 
            ctx.fillStyle = "black";
            ctx.font = "10px Arial";

            for (let i = 0; i <= canvas.width; i += escala) {
                // Eje X
                ctx.fillText(i / escala, i + 2, canvas.height - 2);
                // Eje Y (Invertido)
                ctx.fillText((canvas.height - i) / escala, 2, i - 2);

                // Líneas de rejilla
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
    ctx.fillStyle = "blue";
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
    // Cálculo de diferenciales y dirección del paso
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