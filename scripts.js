const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initPoints();
});

const noise = (x, y, z) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    return (Math.sin(X * 0.05 + Y * 0.05 + Z * 0.05) * 0.5 + 0.5) * 0.7;
};

class WavePoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.speed = 0.01 + Math.random() * 0.01;
        this.offset = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 100 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.001;
        this.size = Math.random() * 2 + 1;
    }

    update(time) {
        this.angle += this.angleSpeed;
        this.x = this.baseX + Math.cos(this.angle) * this.radius;
        this.y = this.baseY + Math.sin(this.angle) * this.radius;
        
        this.x += Math.sin(time * this.speed + this.offset) * 20;
        this.y += Math.cos(time * this.speed + this.offset) * 20;
    }
}

const points = [];
const spacing = 150;

function initPoints() {
    points.length = 0;
    for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
            points.push(new WavePoint(x, y));
        }
    }
}

initPoints();

let time = 0;
function animate() {
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color');
    ctx.fillRect(0, 0, width, height);

    points.forEach(point => point.update(time));

    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const p1 = points[i];
            const p2 = points[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < spacing * 1.5) {
                const opacity = (1 - distance / (spacing * 1.5)) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `${getComputedStyle(document.body).getPropertyValue('--text-color')}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.lineWidth = 0.5;
                
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                const offset = Math.sin(time * 0.001 + distance * 0.005) * 30;
                
                ctx.moveTo(p1.x, p1.y);
                ctx.quadraticCurveTo(
                    midX + offset, 
                    midY + offset, 
                    p2.x, p2.y
                );
                ctx.stroke();
            }
        }
    }

    points.forEach(point => {
        const baseColor = getComputedStyle(document.body).getPropertyValue('--text-color');
        
        const glowSize = point.size * (1 + Math.sin(time * 0.02 + point.offset) * 0.5);
        const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, glowSize * 4
        );
        gradient.addColorStop(0, `${baseColor}20`);
        gradient.addColorStop(1, `${baseColor}00`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(point.x, point.y, glowSize * 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = `${baseColor}40`;
        ctx.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
    });

    time += 0.5;
    requestAnimationFrame(animate);
}

animate();

const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('change', () => {
    document.body.setAttribute('data-theme', 
        themeSwitch.checked ? 'light' : 'dark');
});

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('resume-modal');
    const btn = document.getElementById('resume-button');
    const closeBtn = document.querySelector('.close-button');
    const modalHeader = document.querySelector('.modal-header');

    // Prevent the default action of the resume button
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Dragging functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    modalHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target === modalHeader || e.target.parentElement === modalHeader) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, modal);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
});
