const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color; // Guardamos el color original
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Dirección aleatoria en X
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Dirección aleatoria en Y
        this.isFlashing = false; // Para controlar el "flash" de color
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        // Actualizar la posición X
        this.posX += this.dx;
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Actualizar la posición Y
        this.posY += this.dy;
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Cambiar color de vuelta al original si no está flasheando
        if (!this.isFlashing) {
            this.color = this.originalColor;
        }
    }

    detectCollision(otherCircle) {
        const distX = this.posX - otherCircle.posX;
        const distY = this.posY - otherCircle.posY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + otherCircle.radius;
    }

    changeColorOnCollision() {
        this.isFlashing = true; // Activar el estado de flash
        this.color = "#0000FF"; // Azul si hay colisión
        setTimeout(() => {
            this.isFlashing = false; // Desactivar el estado de flash
        }, 100); // Duración del flash
    }

    reverseDirection() {
        this.dx = -this.dx;
        this.dy = -this.dy;
    }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para detectar colisiones entre todos los círculos
function detectCollisions() {
    for (let i = 0; i < circles.length; i++) {
        let circleA = circles[i];

        for (let j = i + 1; j < circles.length; j++) {
            let circleB = circles[j];

            if (circleA.detectCollision(circleB)) {
                circleA.reverseDirection(); // Revertir dirección A
                circleB.reverseDirection(); // Revertir dirección B
                circleA.changeColorOnCollision(); // Cambiar color A
                circleB.changeColorOnCollision(); // Cambiar color B
            }
        }
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
    circles.forEach(circle => {
        circle.update(ctx); // Actualizar cada círculo
    });
    detectCollisions(); // Detectar colisiones
    requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();
