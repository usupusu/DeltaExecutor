const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const count = 200;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < count; i++) {
    particles.push(new Particle());
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
}

animate();

const dot = document.getElementById('dot');
let isOnline = true;
let isFlickering = false;

function updateDot() {
    if (isOnline) {
        dot.classList.remove('offline');
    } else {
        dot.classList.add('offline');
    }
}

function startFlicker() {
    if (isFlickering) return;
    isFlickering = true;
    dot.classList.add('flicker-superfast');
    const stopTime = 1000 + Math.random() * 2000;
    setTimeout(() => {
        dot.classList.remove('flicker-superfast');
        isFlickering = false;
        if (Math.random() < 0.3) {
            isOnline = !isOnline;
            updateDot();
        }
        scheduleFlicker();
    }, stopTime);
}

function scheduleFlicker() {
    const delay = 500 + Math.random() * 2500;
    setTimeout(() => { startFlicker(); }, delay);
}

document.querySelector('.status-dot').addEventListener('click', function() {
    if (isFlickering) {
        dot.classList.remove('flicker-superfast');
        isFlickering = false;
    }
    startFlicker();
});

scheduleFlicker();

function downloadFile(type) {
    const links = {
        'ios': 'itms-services://?action=download-manifest&url=https://delta.bz/manifest.plist',
        'apk': 'https://delta.filenetwork.vip/android.html'
    };
    window.open(links[type], '_blank');
}

window.downloadFile = downloadFile;

function copyScript(btn) {
    const codeEl = btn.parentElement.querySelector('.code');
    const text = codeEl.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            const original = btn.textContent;
            btn.textContent = '✅ Copied!';
            btn.style.background = '#fff';
            btn.style.color = '#000';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '#111';
                btn.style.color = '#666';
            }, 1500);
        }).catch(() => {
            fallbackCopy(text, btn);
        });
    } else {
        fallbackCopy(text, btn);
    }
}

function fallbackCopy(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    const original = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = original; }, 1500);
}

window.copyScript = copyScript;

console.log('Delta Executor Loaded');
