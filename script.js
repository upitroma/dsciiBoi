//canvas setup
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//load assets
var blueGlowingRing = new Image();
blueGlowingRing.src = "assets/blueGlowingRing.png"

var disc = {
    x: 50,
    y: 50,
    radius: 50,
    angle: .1, //radians
    speed: 10
}


function drawBackground(){
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawDisc(){
    r=disc.radius
    ctx.drawImage(blueGlowingRing, disc.x-r, disc.y-r, disc.radius*2, disc.radius*2);
}



//update loop
//runs every frame
function update(deltatime){

    //clear the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawBackground()
    drawDisc()
}
  
//tick
//makes the update function run every frame
var lastTick = performance.now()
function tick(nowish) {
    var delta = nowish - lastTick
    lastTick = nowish
    delta/=1000 //ms to s
    update(delta)
    window.requestAnimationFrame(tick)
}
window.requestAnimationFrame(tick)