const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Zwraca liczbę całkowitą z przedziału min max (Returns random integer number from min to max)

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

//Zwraca losowy kolor z palety hex (Returns random hex)

function color() {
    let hex = "#";
    for( let i=0; i<6; i++){
        let color = Math.floor(Math.random()*15);
        switch (color) {
            case 10:
                color = "A"
                break;
            case 11:
                color = "B"
                break;
            case 12:
                color = "C"
                break;
            case 13:
                color = "D"
                break;
            case 14:
                color = "E"
                break;
            case 15:
                color = "F"
                break;
            default:
                break;
        }
        hex += color;
    }
    return hex;
}
let colorArray = [];
for(let i=0; i<6; i++){
    let hex = color()
    colorArray.push(hex);
}
const mouse = {
    x: undefined,
    y: undefined,
    radius: ((canvas.width/80) * (canvas.height/80))
};

addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = ((canvas.width/80) * (canvas.height/80));
    
    init();
});

function Particle (x, y, dx, dy, radius, color){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    let col = this.color;

    this.update = () => {
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0){
            this.dy = -this.dy;
        }

        //Sprawdzanie odległości elementów od myszki (Check collision mouse-particle)

        let DistX = mouse.x - this.x;
        let DistY = mouse.y - this.y;
        let distance = Math.sqrt(Math.pow(DistX, 2) + Math.pow(DistY, 2));
        if(distance < mouse.radius + this.radius){
            if(mouse.x < this.x && this.x < canvas.width - this.radius * 10){
                this.x += 10;
            }
            if(mouse.x > this.x && this.x > this.radius * 10){
                this.x -= 10;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.radius * 10){
                this.y += 10;
            }
            if(mouse.y > this.y && this.y > this.radius * 10){
                this.y -= 10;
            }
        }
        this.x += this.dx;
        this.y += this.dy;


        this.draw();
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        setTimeout(() => {
            this.color = "#262626";
        }, 200);
        setTimeout(() => {
            this.color = col;
        },400);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

let particleArray;

function init() {
    particleArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;

    for(let i=0; i<200; i++){
        let radius = 3;
        let x = randomNumber(radius,(canvas.width - radius));
        let y = randomNumber(radius,(canvas.height - radius));
        let dx = randomNumber(-3, 3);
        let dy = randomNumber(-3, 3);
        let color = "#fff";
        particleArray.push(new Particle(x, y, dx, dy, radius, color));
    }
}

// Funkcja rysująca linie do elementów i myszki (function drawing lines to particles and mouse)

function connect(){
    let opacityValue = 1;
    for( let i=0; i<particleArray.length; i++){
        for(let j=i; j< particleArray.length; j++){
            let distance = (Math.pow((particleArray[i].x - particleArray[j].x),2) + Math.pow((particleArray[i].y - particleArray[j].y),2));
            if(distance < (canvas.width/7) * (canvas.height/7)){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(234, 234, 234,'+ opacityValue +')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.stroke();
            }
        }
    }
    for(let i=0; i< particleArray.length; i++){
        let dist = (Math.pow((particleArray[i].x - mouse.x),2)+Math.pow((particleArray[i].y - mouse.y),2));
        if(dist < (canvas.width/3) * (canvas.height/3)){
            opacityValue = 1 - (dist/200000);
            ctx.strokeStyle = 'rgba(234, 234, 234,'+ opacityValue +')';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillText('CANVAS', mouse.x, mouse.y);
     particleArray.forEach(particle => {
     particle.update();
    });
    connect();
}

init();
animate();