//canvas setup
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//load assets
var blueGlowingRing = new Image();
blueGlowingRing.src = "assets/blueGlowingRing.png"

//make a disc object
var disc = {
    x: 50,
    y: 50,
    radius: 50,

    // pixels/second
    xVelo: 400,
    yVelo: 600
}

//resize the canvas when the window is resized
window.addEventListener("resize", resizeWindow);
function resizeWindow(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawBackground(){
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawDisc(){
    r=disc.radius
    ctx.drawImage(blueGlowingRing, disc.x-r, disc.y-r, disc.radius*2, disc.radius*2);
}

function moveDisc(deltatime){
    disc.x+=disc.xVelo*deltatime;
    disc.y+=disc.yVelo*deltatime;
}

function checkDiscCollision(){
    if(disc.x>canvas.width || disc.x<0){
        disc.xVelo*=-1;
        disc.x=Math.min(Math.max(disc.x,0),canvas.width)//clamp x inside canvas
    }
    if(disc.y>canvas.height || disc.y<0){
        disc.yVelo*=-1;
        disc.y=Math.min(Math.max(disc.y,0),canvas.height)//clamp y inside canvas
    }
}



//update loop
//runs every frame
function update(deltatime){

    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    checkDiscCollision()
    moveDisc(deltatime)
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