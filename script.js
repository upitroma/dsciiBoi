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

class Disc{
    constructor(x=50,y=50,xVelo=500,yVelo=600, discId=2, bounceDecay=10){
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
    constructor(centerX,centerY,width,height){
        this.centerX=centerX;
        this.centerY=centerY;
        this.width=width;
        this.height=height;
        this.color=0;
    }
}
var walls=[
    new Wall(1200,300,300,200),
    new Wall(1200,600,300,200),
    new Wall(200,450,100,400)
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

function drawEnemies(){
    for(i=0;i<enemies.length; i++){
        
       
        w=enemies[i];

        //console.log(w)

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

            if(Math.abs(d.x-w.centerX)<(w.width/2)&&(Math.abs(d.y-w.centerY)<(w.height/2))){//if x is contained
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
    }
}

//update loop
//runs every frame
function update(deltatime){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    
    checkBounceDecay()
    moveDisc(deltatime)
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
