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
var mineArm = new Image();
mineArm.src = "assets/arm.png";
var mouse = {
    'x': 0,
    'y': 0,
    'd': 0
}

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
canvas.addEventListener("mousedown", setmousedown, false)
function setmousedown(event){
        mouse.d = 1;
        armyBoi.setThrow();  
}
canvas.addEventListener("mouseup", setmouseup, false)
function setmouseup(event){
        mouse.d = 0; 
}

canvas.addEventListener("mousemove", mouseUpdate, false)
function mouseUpdate(event){
    mouse.x = event.x;
    mouse.y = event.y;
}

function checkBounceDecay(){
    for(i=0;i<discs.length; i++){
        d=discs[i]
        
        if(d.bounceDecay<=0){
            discs.splice(i,1)
        }
    }
}

class Arm{
    constructor() {
        this.status = 0;
        this.theta = 0;
        this.x = gameWidth /2;
        this.y = gameHeight /2;
        this.width = 393 / 10;
        this.height = 1200 / 10;
        this.throw = 0;
    }
    update(deltatime) {
        //console.log(this.theta);
        if (this.status == 0) {
            this.theta = Math.atan2((mouse.y-window.innerHeight/2), (mouse.x-window.innerWidth/2));
        } else if (this.status == 1){
            this.theta += this.speed * 5 * deltatime;
            if (mouse.d)
            {
                this.speed += 1 * deltatime;
                if (this.theta > Math.PI)
                {
                    this.theta -= Math.PI * 2;
                }
            }
            else if (this.theta >= this.throw + Math.PI * 2) {
                this.status = 2;

                discs.push(new Disc(
                    this.x  + Math.cos(this.throw) * this.height,
                    this.y + Math.sin(this.throw) * this.height,
                    500 * this.speed * Math.cos(this.throw),
                    500 * this.speed * Math.sin(this.throw))
                    )  
            }
        } else {
            this.theta += 15 * deltatime;
            if (this.theta > Math.PI ){
                this.theta -= Math.PI * 2;
            }
            this.throw = Math.atan2((mouse.y-window.innerHeight/2), (mouse.x-window.innerWidth/2));
            var diff = Math.abs((this.throw + Math.PI) - (this.theta + Math.PI));
            if (diff <= Math.PI * 0.1) {
                this.status = 0;
            }
        }
        this.render();
    }
    render() {
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.theta - Math.PI / 2);
        ctx.drawImage(mineArm, -1*(this.width * scale) / 2, 0, this.width * scale, this.height * scale);
        if (this.status == 1) {
            ctx.drawImage(blueGlowingRing, -1*(this.width * scale) / 2, (this.height - 30) * scale, 80*scale, 80*scale)
        }
        ctx.restore();
    }
    setThrow() {
        if (this.status == 0) {
            this.status = 1;
            this.speed = 0;
            this.throw = this.theta;
        }
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}
let armyBoi = new Arm;

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
    //armyBoi.setPos(x, y);     //if we change position, pass to arm pls :)
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
    armyBoi.update(deltatime);
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