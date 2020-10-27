//canvas setup
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
//var soccerBall = new Image();
//soccerBall.src="assets/scott_ball_shiny.png"

class Disc{
    constructor(x=50,y=50,xVelo=500,yVelo=600, discId=1, bounceDecay=3){
        this.x=x
        this.y=y
        this.radius=40

        this.discId=discId

        this.bounceDecay=bounceDecay;//number of bounces
    
        // pixels/second
        this.xVelo=xVelo
        this.yVelo=yVelo
    }
}
var discs=[]

class Wall{
    constructor(centerX,centerY,width,height,angle){
        this.centerX=centerX;
        this.centerY=centerY;
        this.width=width;
        this.height=height;
        this.angle=angle;
        this.color=0;
    }
}
var walls=[new Wall(1200,400,200,200,1*1*Math.PI/8)]

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
    ctx.translate(x, y);
    ctx.rotate(-angle);//negative, so when ctx is reset it's normal
    ctx.fillRect(-width/2, -height/2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawWalls(){
    for(i=0;i<walls.length; i++){
        
        w=walls[i];
        if(w.color==0){
            ctx.fillStyle = "blue"
        }
        else{
            ctx.fillStyle = "red"
        }
        drawRectangle(
            w.centerX*scale,
            w.centerY*scale,
            w.width*scale,
            w.height*scale,
            w.angle
        )
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
        //else if(d.discId==2){color=soccerBall}
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
console.log(walls[0].centerX+(walls[0].width/2))
function checkDiscCollision(){
    for(i=0;i<discs.length; i++){
        d=discs[i]

        //edges of screen
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


        for(j=0;j<walls.length;j++){
            w=walls[j]

            //rotate point around rectangle center
            rotatedX = (Math.cos(w.angle)*(d.x-w.centerX)-Math.sin(w.angle)*(d.y-w.centerY)) + w.centerX;
            rotatedY = (Math.sin(w.angle)*(d.x-w.centerX)+Math.cos(w.angle)*(d.y-w.centerY)) + w.centerY;

            if(Math.abs(rotatedX-w.centerX)<(w.width/2)&&(Math.abs(rotatedY-w.centerY)<(w.height/2))){//if x is contained
                w.color=1; 

                //bounce
                discRelativeAngle=deltaAngle(w.centerX,w.centerY,w.angle,d.x-w.centerX,d.y-w.centerY)





            }
            else{
                w.color=0
            }
        }
    }
}


//https://gamedev.stackexchange.com/questions/114898/frustum-culling-how-to-calculate-if-an-angle-is-between-another-two-angles
function deltaAngle(px,py,pa,objx,objy){
    var l1x=objx-px
    var l1y=objy-py
    var l1mag=Math.sqrt((l1x*l1x) + (l1y*l1y))
    var l2x=Math.cos(pa)
    var l2y=Math.sin(pa)
    var dot=(l1x*l2x) + (l1y*l2y)
    var deltaAngle=Math.acos(dot/l1mag)
    return deltaAngle
}


//update loop
//runs every frame
function update(deltatime){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    checkDiscCollision()
    checkBounceDecay()
    moveDisc(deltatime)

    //walls[0].angle+=deltatime*5

    //graphic layers
    drawBackground()
    drawPlayer()
    drawWalls()
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