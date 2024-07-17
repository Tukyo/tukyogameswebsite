function randomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function createTrail(ball) {
    let trail = document.createElement('div');
    trail.classList.add('trail');
    trail.style.backgroundColor = randomColor();
    trail.style.width = trail.style.height = ball.clientWidth + 'px';
    trail.style.left = ball.style.left;
    trail.style.top = ball.style.top;
    document.body.appendChild(trail);

    let shrinkTrail = () => {
        let trailWidth = parseInt(trail.style.width);
        let trailHeight = parseInt(trail.style.height);

        if (trailWidth > 0 && trailHeight > 0) {
            trailWidth -= 2;
            trailHeight -= 2;
            trail.style.width = trailWidth + 'px';
            trail.style.height = trailHeight + 'px';

            setTimeout(shrinkTrail, 50);
        } else {
            document.body.removeChild(trail);
        }
    };

    setTimeout(shrinkTrail, 10);
}

function createBall(event) {
    let ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.backgroundColor = randomColor();
    ball.style.width = ball.style.height = '20px';
    let startX = Math.random() < 0.5 ? 0 : window.innerWidth - 20;
    ball.style.left = startX + 'px';
    ball.style.top = (Math.random() * window.innerHeight) + 'px';
    document.body.appendChild(ball);

    let targetX = event.clientX;
    let targetY = event.clientY;

    let dx = targetX - startX;
    let dy = targetY - parseInt(ball.style.top);
    let distance = Math.hypot(dx, dy);
    let speed = 5;

    let vx = (dx / distance) * speed;
    let vy = (dy / distance) * speed;

    function moveBall() {
        let currentX = parseInt(ball.style.left);
        let currentY = parseInt(ball.style.top);

        if (Math.hypot(targetX - currentX, targetY - currentY) <= speed) {
            explodeBall(ball, targetX, targetY);
        } else {
            ball.style.left = (currentX + vx) + 'px';
            ball.style.top = (currentY + vy) + 'px';
            createTrail(ball);
            requestAnimationFrame(moveBall);
        }
    }

    ball.addEventListener('mouseover', () => {
        explodeBall(ball, parseInt(ball.style.left), parseInt(ball.style.top));
    });

    moveBall();
}

function explodeBall(ball, x, y) {
    for (let j = 0; j < 5; j++) {
        let particle = document.createElement('div');
        particle.classList.add('ball');
        particle.style.backgroundColor = randomColor();
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);

        let vx = Math.random() * 20 - 10;
        let vy = Math.random() * 20 - 10;
        let vz = Math.random() * 20 - 10;
        let scale = Math.random() * 0.05 + 0.45;
        let size = Math.random() * 20 + 10;
        particle.style.transform = `translateZ(${vz}px) scale(${scale})`;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        let gravity = 0.15;

        function updateParticle() {
            vx *= 0.99;
            vy += gravity;
            vz *= 0.99;
            let px = parseInt(particle.style.left) + vx;
            let py = parseInt(particle.style.top) + vy;
            let pz = parseInt(particle.style.transform.match(/translateZ\((.*?)px\)/)[1]) + vz;
            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.transform = `translateZ(${pz}px) scale(${scale})`;

            if (py > window.innerHeight) {
                document.body.removeChild(particle);
            } else {
                requestAnimationFrame(updateParticle);
            }
        }

        updateParticle();
    }
    document.body.removeChild(ball);
}

document.addEventListener('click', createBall);
