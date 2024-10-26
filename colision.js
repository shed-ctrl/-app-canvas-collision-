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
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = -Math.abs(this.speed); // Siempre hacia arriba inicialmente
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
        if (this.posY - this.radius < 0) { // Rebotar si llegan al borde superior
            this.dy = -this.dy;
        }
    }

    detectCollision(otherCircle) {
        const distX = this.posX - otherCircle.posX;
        const distY = this.posY - otherCircle.posY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance < this.radius + otherCircle.radius;
    }

    changeColorOnCollision(isColliding) {
        this.color = isColliding ? "#0000FF" : this.originalColor; // Azul si hay colisión, original si no
    }

    isClicked(mouseX, mouseY) {
        const distX = mouseX - this.posX;
        const distY = mouseY - this.posY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < this.radius; // Verifica si el clic está dentro del círculo
    }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios desde el borde inferior
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = window_height - radius; // Justo antes del margen inferior
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
        let isColliding = false;

        for (let j = i + 1; j < circles.length; j++) {
            let circleB = circles[j];

            if (circleA.detectCollision(circleB)) {
                isColliding = true;
                circleB.changeColorOnCollision(true);
            } else {
                circleB.changeColorOnCollision(false);
            }
        }

        circleA.changeColorOnCollision(isColliding);
    }
}

// Eliminar un círculo si se hace clic en él
canvas.addEventListener("click", function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    circles = circles.filter(circle => !circle.isClicked(mouseX, mouseY)); // Eliminar círculo clickeado
});

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
