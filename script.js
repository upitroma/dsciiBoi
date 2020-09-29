//canvas setup
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//load assets
var blueGlowingRing = new Image();
blueGlowingRing.src = "assets/blueGlowingRing.png"


class disc{
    constructor(x=50,y=50,xVelo=500,yVelo=600){
        this.x=x
        this.y=y
        this.radius=50
    
        // pixels/second
        this.xVelo=xVelo
        this.yVelo=yVelo
    }
    
}
var discs=[]
discs.push(new disc(), new disc(50, 50, 600, 500))

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
    for(i=0;i<discs.length; i++){
        d=discs[i]
        r=d.radius
        ctx.drawImage(blueGlowingRing, d.x-r, d.y-r, d.radius*2, d.radius*2);
    }
}

function moveDisc(deltatime){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        d.x+=d.xVelo*deltatime;
        d.y+=d.yVelo*deltatime;
        //console.log(discs)
    }
    //disc.x+=disc.xVelo*deltatime;
    //disc.y+=disc.yVelo*deltatime;
}

function checkDiscCollision(){
    for(i=0;i<discs.length; i++){
        d=discs[i]

        if(d.x>canvas.width || d.x<0){
            d.xVelo*=-1;
            d.x=Math.min(Math.max(d.x,0),canvas.width)//clamp x inside canvas
        }
        if(d.y>canvas.height || d.y<0){
            d.yVelo*=-1;
            d.y=Math.min(Math.max(d.y,0),canvas.height)//clamp y inside canvas
        }

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