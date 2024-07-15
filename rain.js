console.log("Rain Effect Loaded...");
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lineHeightVariation = 0.975;
const actualFontSize = 14;
const fps = 64;
const nextFrame = 1000 / fps;

let isAnimating = true;
let lastTime = 0;
let timer = 0;

class CyberRain {
    constructor(x, y, fontSize, canvasHeight) {
        this.characters =
            'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトホモヨョロヲゴゾドボポヴッン0123456789DESYPHEƎR';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
    }
    draw(context) {
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
        if (this.y * this.fontSize > this.canvasHeight && Math.random() > lineHeightVariation) {
            this.y = 0;
        } else {
            this.y += 1;
        }
    }
}

class Effect {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = actualFontSize;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
    #initialize() {
        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = new CyberRain(i, 0, this.fontSize, this.canvasHeight);
        }
    }
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

const effect = new Effect(canvas.width, canvas.height);

function animate(timeStamp) {
    if (!isAnimating) return;
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (timer > nextFrame) {
        // Function to generate a random color
        function getRandomColor() {
            const r = Math.floor(Math.random() * 256); // Random between 0-255
            const g = Math.floor(Math.random() * 256); // Random between 0-255
            const b = Math.floor(Math.random() * 256); // Random between 0-255
            return `rgba(${r}, ${g}, ${b}, 1)`; // Full opacity
        }

        // Generate a random color
        const randomColor = getRandomColor();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.textAlign = 'center';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Use the random color for fill and shadow
        ctx.fillStyle = randomColor;
        ctx.font = effect.fontSize + 'px monospace';

        ctx.shadowColor = randomColor;
        ctx.shadowBlur = 10;

        effect.symbols.forEach(symbol => {
            symbol.draw(ctx);
        });

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        timer = 0;
    } else {
        timer += deltaTime;
    }
    requestAnimationFrame(animate);
}
animate(0);

window.addEventListener('resize', updateCanvasSize);

function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight; // This adjusts height to the full document height
    effect.resize(canvas.width, canvas.height);
}
updateCanvasSize();