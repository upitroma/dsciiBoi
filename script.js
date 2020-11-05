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

var soccerBall = new Image();
soccerBall.src="assets/sprites/scott_ball_shiny.png"

//since there's only 1 player, it doesn't need to be a class
var player = {
    x: 800,
    y: 700
}

class Disc{
    constructor(x=50,y=50,xVelo=500,yVelo=600, discId=2, bounceDecay=4){
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
    constructor(centerX,centerY,width,height, colorId){
        this.centerX=centerX;
        this.centerY=centerY;
        this.width=width;
        this.height=height;
        this.colorId=colorId; //see drawWalls for refrence
    }
}
var walls=[
    new Wall(1200,300,300,200, 0),
    new Wall(1200,600,300,200, 0),
    new Wall(200,450,100,400, 0)
]

class Enemy{
    constructor(centerX,centerY,width,height,id){
        this.centerX=centerX
        this.centerY=centerY
        this.width=width
        this.height=height
        this.id=id
        this.alive=true
    }
}
var enemies=[
    new Enemy(100,450,100,100,0)
]

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
        player.x,
        player.y,
        ((event.x-((window.innerWidth-canvas.width)/2))-((player.x)*scale)) / scale,
        ((event.y-((window.innerHeight-canvas.height)/2))-((player.y)*scale)) / scale)
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
        if(w.colorId==0){
            ctx.fillStyle = "blue"
        }
        else if(w.colorId==-1){
            continue; //no texture, just hitbox
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

function drawEnemies(){
    for(i=0;i<enemies.length; i++){
        w=enemies[i];

        if(w.alive){
            if(w.id==0){
                ctx.fillStyle = "red"
            }
            drawRectangle(
                w.centerX*scale,
                w.centerY*scale,
                w.width*scale,
                w.height*scale,
                0
            )
        }
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
        else if(d.discId==2){color=soccerBall}
        else{console.log("invalid discId")}

        ctx.drawImage(color, (d.x-r)*scale, (d.y-r)*scale, d.radius*scale*2, d.radius*scale*2);
    }
}

function drawPlayer(){
    ctx.fillStyle = "blue"
    w= 80 //* scale
    ctx.fillRect(((player.x)-(w/2))*scale, ((player.y)-(w/2))*scale, w*scale, w*scale);
}

function moveDiscs(deltatime){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        d.x+=(d.xVelo)*deltatime;
        d.y+=(d.yVelo)*deltatime;
    }
}
function checkDiscCollision(deltatime){
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

            if(Math.abs(d.x-w.centerX)<(w.width/2)&&(Math.abs(d.y-w.centerY)<(w.height/2))){//if disc is contained
                //bounce
                discRelativeAngle=Math.atan2(d.y-w.centerY,d.x-w.centerX)
                regionAngle=Math.atan2(w.height/2,w.width/2)
               
                //figure out which side it's on
                if(discRelativeAngle<regionAngle&&discRelativeAngle>-regionAngle){
                    //console.log("right")
                    d.xVelo*=-1
                }
                else if(discRelativeAngle<Math.PI-regionAngle&&discRelativeAngle>regionAngle){
                    //console.log("bottom")
                    d.yVelo*=-1
                }
                else if((discRelativeAngle<Math.PI&&discRelativeAngle>Math.PI-regionAngle)||(discRelativeAngle>-Math.PI&&discRelativeAngle<regionAngle-Math.PI)){
                    //console.log("left")
                    d.xVelo*=-1
                }
                else if(discRelativeAngle<-regionAngle&&discRelativeAngle>regionAngle-Math.PI){
                    //console.log("top")
                    d.yVelo*=-1

                }
                else{
                    //console.log("corner or center or error")
                }   
                d.x+=d.xVelo*deltatime            
                d.y+=d.yVelo*deltatime
                
                d.bounceDecay--

            }
        }
        for(j=0;j<enemies.length;j++){
            e=enemies[j]

            if(e.alive){
                if(Math.abs(d.x-e.centerX)<(e.width/2)&&(Math.abs(d.y-e.centerY)<(e.height/2))){
                    e.alive=false

                    //add additional bounce
                    d.bounceDecay++
                }
            }
        }
    }
}

//update loop
//runs every frame
function update(deltatime){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    //logic
    checkBounceDecay()
    moveDiscs(deltatime)
    checkDiscCollision(deltatime)

    //graphic layers
    drawBackground()
    drawPlayer()
    drawWalls()
    drawEnemies()
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
