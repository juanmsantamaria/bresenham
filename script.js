
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



/**
 * Implementación del algoritmo de líneas de Bresenham.
 * @param {number} x0 - Coordenada X inicial.
 * @param {number} y0 - Coordenada Y inicial.
 * @param {number} x1 - Coordenada X final.
 * @param {number} y1 - Coordenada Y final.
 * @param {Function} plot - Función para dibujar el píxel (x, y).
 */
function bresenham(x0, y0, x1, y1, plot) {
    // Cálculo de diferenciales y dirección del paso
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        // Dibujar el punto actual
        plot(x0, y0);

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
    }
}


