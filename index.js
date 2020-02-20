class Point {
    constructor(x, y){
        this.x = x;
        this.y = y
    }

    distance(otherPoint) {
        const xDiff = this.x - otherPoint.x;
        const yDiff = this.y - otherPoint.y;

        return Math.sqrt(xDiff ** 2 + yDiff ** 2);
    }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//中心
const centerPoint = new Point(250, 250);
ctx.fillRect(centerPoint.x - 5, centerPoint.y -5, 10, 10);

ctx.lineWidth = 5;
ctx.lineCap = "round";

let drawedPoints = [];
let mousedown = false;

onStart = e => {
    document.querySelector("#score").innerText = "";
    ctx.clearRect(0, 0, 500, 500);
    const centerPoint = new Point(250, 250);
    ctx.fillRect(centerPoint.x - 5, centerPoint.y -5, 10, 10);

    ctx.beginPath();
    ctx.strokeStyle = "Black";
    ctx.globalAlpha =  1;
    ctx.moveTo(e.offsetX, e.offsetY);
    drawedPoints.push(new Point(e.offsetX, e.offsetY));
    mousedown = true;
}

onMove = e => {
    if(mousedown) {
        ctx.lineTo(e.offsetX, e.offsetY);
        drawedPoints.push(new Point(e.offsetX, e.offsetY));
        ctx.stroke();
    }
}

onEnd = () => {
    mousedown = false;

    const distancesToCenter = drawedPoints.map(p => p.distance(centerPoint));
    const radius = distancesToCenter.reduce((prev, curr) => prev + curr, 0) / distancesToCenter.length;

    ctx.strokeStyle = "Red";
    ctx.globalAlpha =  0.5;
    ctx.beginPath();
    ctx.arc(centerPoint.x, centerPoint.y, radius, 0, 2 * Math.PI);
    ctx.stroke();

    const score = distancesToCenter.map(d => Math.abs(radius - d)).reduce((prev, curr) => prev + curr, 0) / distancesToCenter.length;
    document.querySelector("#score").innerText = Math.round(score * 100) / 100;

    drawedPoints = [];
}


canvas.addEventListener("mousedown", onStart)
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mouseup", onEnd);

canvas.addEventListener("touchstart", onStart)
canvas.addEventListener("touchmove", onMove);
canvas.addEventListener("touchend", onEnd);
