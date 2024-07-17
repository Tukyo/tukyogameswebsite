const backgroundCanvas = document.getElementById('backgroundcanvas');
const context = backgroundCanvas.getContext('2d');

backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

// On window resize, redraw the canvas with the new width and height
window.addEventListener('resize', () => {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
});

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

const circles = [];
const rows = 34;
const columns = 38;
const circleRadius = 5;
const gap = 50;
const forceMagnitude = 15;
const maxDistMultiplier = 30;

for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
        const x = gap * i + circleRadius + gap / 2;
        const y = gap * j + circleRadius + gap / 2;
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        circles.push(new Circle(x, y, circleRadius, color));
    }
}

const mouse = { x: null, y: null };

backgroundCanvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

backgroundCanvas.addEventListener('mousedown', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;

    circles.forEach((circle) => {
        // Change the color of the circle
        const newCircleColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        circle.color = newCircleColor;

        const dx = circle.x - clickX;
        const dy = circle.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / dist;
        const forceDirectionY = dy / dist;

        const directionX = forceDirectionX * forceMagnitude;
        const directionY = forceDirectionY * forceMagnitude;

        circle.x += directionX;
        circle.y += directionY;
    });
});

function animate() {
    context.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    circles.forEach((circle) => {
        const dx = circle.x - mouse.x;
        const dy = circle.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / dist;
        const forceDirectionY = dy / dist;

        const maxDist = circle.radius * maxDistMultiplier;
        const force = (maxDist - dist) / maxDist;
        const directionX = forceDirectionX * force;
        const directionY = forceDirectionY * force;

        // Limit the movement of the circles
        const maxMoveDist = 50; // You can adjust this value to control the maximum movement distance
        const movedX = circle.x - circle.originX;
        const movedY = circle.y - circle.originY;
        const movedDist = Math.sqrt(movedX * movedX + movedY * movedY);

        if (movedDist > maxMoveDist) {
            circle.x = circle.originX + (movedX / movedDist) * maxMoveDist;
            circle.y = circle.originY + (movedY / movedDist) * maxMoveDist;
        }

        circle.x += directionX;
        circle.y += directionY;

        // Collision detection and bouncing
        circles.forEach((otherCircle) => {
            if (circle === otherCircle) return;

            const dx = otherCircle.x - circle.x;
            const dy = otherCircle.y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = otherCircle.radius + circle.radius;

            if (distance < minDist) {
                const angle = Math.atan2(dy, dx);
                const targetX = circle.x + Math.cos(angle) * minDist;
                const targetY = circle.y + Math.sin(angle) * minDist;
                const ax = (targetX - otherCircle.x) * 0.5;
                const ay = (targetY - otherCircle.y) * 0.5;

                circle.x -= ax;
                circle.y -= ay;
                otherCircle.x += ax;
                otherCircle.y += ay;
            }
        });

        circle.draw();
    });

    requestAnimationFrame(animate);
}

animate();