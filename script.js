//canvas setup
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//load assets
var blueGlowingRing = new Image();
blueGlowingRing.src = "assets/blueGlowingRing.png"
var orangeGlowingRing = new Image();
orangeGlowingRing.src = "assets/orangeGlowingRing.png"

class Disc{
    constructor(x=50,y=50,xVelo=500,yVelo=600, discId=0){
        this.x=x
        this.y=y
        this.radius=50

        this.discId=discId
    
        // pixels/second
        this.xVelo=xVelo
        this.yVelo=yVelo
    }
}
var discs=[]

//just for testing, will normally be populated at runtime
//discs.push(new Disc(), new Disc(50, 50, 600, 500, 1))

//resize the canvas when the window is resized
window.addEventListener("resize", resizeWindow);
function resizeWindow(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//launch disc on mouse click
canvas.addEventListener("mousedown", launchDisc, false)
function launchDisc(event){
    discs.push(new Disc(
        canvas.width/2,
        canvas.height/2,
        event.x-(canvas.width/2),
        event.y-(canvas.height/2))
        )
}

function drawBackground(){
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawDisc(){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        r=d.radius

        //set color based on discId
        if(d.discId==0){color=blueGlowingRing}
        else if(d.discId==1){color=orangeGlowingRing}
        else{console.log("invalid discId")}

        ctx.drawImage(color, d.x-r, d.y-r, d.radius*2, d.radius*2);
    }
}

function drawPlayer(){
    ctx.fillStyle = "blue"
    w=50
    ctx.fillRect((canvas.width/2)-(w/2), (canvas.height/2)-(w/2), w, w);
}

function moveDisc(deltatime){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        d.x+=d.xVelo*deltatime;
        d.y+=d.yVelo*deltatime;
    }
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
    drawPlayer()//if we decide to make player static, it could just become a part of the background
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