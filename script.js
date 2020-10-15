//canvas setup
//allen test2
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
var gameWidth = 1600;
var gameHeight = 900;
var ratio = gameWidth / gameHeight;
var scale = 1;
resizeWindow();

//load assets
var blueGlowingRing = new Image();
blueGlowingRing.src = "assets/blueGlowingRing.png"
var orangeGlowingRing = new Image();
orangeGlowingRing.src = "assets/orangeGlowingRing.png"

class Disc{
    constructor(x=50,y=50,xVelo=500,yVelo=600, discId=0, bounceDecay=3){
        this.x=x
        this.y=y
        this.radius=40

        this.discId=discId

        //number of bounces
        this.bounceDecay=bounceDecay;
    
        // pixels/second
        this.xVelo=xVelo
        this.yVelo=yVelo
    }
}
var discs=[]

class Obsticle{
    constructor(centerX,centerY,width,height,angle){
        this.centerX=centerX;
        this.centerY=centerY;
        this.width=width;
        this.height=height;
        this.angle=angle;
    }
}
var obsticles=[new Obsticle(400,400,100,300,0)]

//resize the canvas when the window is resized
window.addEventListener("resize", resizeWindow);
function resizeWindow(){
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / ratio;
    if (canvas.height > window.innerHeight)
    {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * ratio;
    }
    scale = canvas.width / gameWidth;
}

//launch disc on mouse click
canvas.addEventListener("mousedown", launchDisc, false)
function launchDisc(event){
    discs.push(new Disc(
        gameWidth/2,
        gameHeight/2,
        ((event.x-((window.innerWidth-canvas.width)/2))-(canvas.width/2)) / scale,
        ((event.y-((window.innerHeight-canvas.height)/2))-(canvas.height/2)) / scale)
        )
}

function drawRectangle(x,y,width,height,angle){
    ctx.translate(x+(width/2), (y+height/2));
    ctx.rotate(angle*(Math.PI/180));
    ctx.fillRect(-width/2, -height/2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawObjects(){
    for(i=0;i<obsticles.length; i++){
        o=obsticles[i];
        drawRectangle(o.centerX*scale,o.centerY*scale,o.width*scale,o.height*scale,o.angle)
    }
}

function checkBounceDecay(){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        
        if(d.bounceDecay<=0){
            discs.splice(i,1)
        }
    }
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

        ctx.drawImage(color, (d.x-r)*scale, (d.y-r)*scale, d.radius*scale*2, d.radius*scale*2);
    }
}

function drawPlayer(){
    ctx.fillStyle = "blue"
    w= 80 * scale
    ctx.fillRect((canvas.width/2)-(w/2), (canvas.height/2)-(w/2), w, w);
}

function moveDisc(deltatime){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        d.x+=(d.xVelo)*deltatime;
        d.y+=(d.yVelo)*deltatime;
    }
}

function checkDiscCollision(){
    for(i=0;i<discs.length; i++){
        d=discs[i]

        if(d.x>gameWidth || d.x<0){
            d.xVelo*=-1;
            d.x=Math.min(Math.max(d.x,0),gameWidth)//clamp x inside game

            d.bounceDecay--

        }
        if(d.y>gameHeight || d.y<0){
            d.yVelo*=-1;
            d.y=Math.min(Math.max(d.y,0),gameHeight)//clamp y inside game

            d.bounceDecay--
        }
    }
}



//update loop
//runs every frame
function update(deltatime){

    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    checkDiscCollision()
    checkBounceDecay()
    moveDisc(deltatime)
    drawBackground()
    drawPlayer()//if we decide to make player static, it could just become a part of the background
    obsticles[0].angle+=deltatime*30
    drawObjects()
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