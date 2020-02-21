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
ctx.beginPath();
const globalCenterPoint = new Point(250, 250);
ctx.fillRect(globalCenterPoint.x - 5, globalCenterPoint.y -5, 10, 10);

ctx.lineWidth = 5;
ctx.lineCap = "round";

let drawedPoints = [];
let mousedown = false;

onStart = point => {
    document.querySelector("#score").innerText = "";
    ctx.clearRect(0, 0, 500, 500);

    ctx.lineWidth = document.querySelector("#line-width").value;

    if(document.querySelector("#fix-center-point").checked) {
        const centerPoint = new Point(250, 250);
        ctx.fillRect(centerPoint.x - 5, centerPoint.y -5, 10, 10);
    }

    ctx.beginPath();
    ctx.strokeStyle = "Black";
    ctx.globalAlpha =  1;
    ctx.moveTo(point.x, point.y);
    drawedPoints.push(new Point(point.x, point.y));
    mousedown = true;
}

onMove = point => {
    if(mousedown) {
        ctx.lineTo(point.x, point.y);
        drawedPoints.push(new Point(point.x, point.y));
        ctx.stroke();
    }
}

onEnd = () => {
    mousedown = false;

    let centerPoint
    if(document.querySelector("#fix-center-point").checked) {
        centerPoint = globalCenterPoint;
    } else {
        centroidX = drawedPoints.reduce((prev, curr) => prev + curr.x, 0) / drawedPoints.length;
        centroidY = drawedPoints.reduce((prev, curr) => prev + curr.y, 0) / drawedPoints.length;
        centerPoint = new Point(centroidX, centroidY);
    }
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


canvas.addEventListener("mousedown", e => onStart(new Point(e.offsetX, e.offsetY)))
canvas.addEventListener("mousemove", e => onMove(new Point(e.offsetX, e.offsetY)));
canvas.addEventListener("mouseup", e => onEnd(new Point(e.offsetX, e.offsetY)));

canvas.addEventListener("touchstart", e => {
    const x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
    const y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
    onStart(new Point(x, y));
    e.preventDefault();
});
canvas.addEventListener("touchmove", e => {
    const x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
    const y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
    onMove(new Point(x, y));
    e.preventDefault();
});
canvas.addEventListener("touchend", e => {
    const x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
    const y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
    onEnd(new Point(x, y));
    e.preventDefault();
});
