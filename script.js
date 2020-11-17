

//canvas setup
var canvas = document.getElementById('canvas')
var test = document.ge
var ctx = canvas.getContext('2d');
var gameWidth = 1600;
var gameHeight = 900;
var ratio = gameWidth / gameHeight;
var scale = 1;
resizeWindow();




//load assets
var blueGlowingRing = new Image();
blueGlowingRing.src = "assets/sprites/blueGlowingRing.png"
var orangeGlowingRing = new Image();
orangeGlowingRing.src = "assets/sprites/orangeGlowingRing.png"

var soccerBall = new Image();
soccerBall.src="assets/sprites/scott_ball_shiny.png"




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

            //rotate point around rectangle center
            rotatedX = (Math.cos(w.angle)*(d.x-w.centerX)-Math.sin(w.angle)*(d.y-w.centerY)) + w.centerX;
            rotatedY = (Math.sin(w.angle)*(d.x-w.centerX)+Math.cos(w.angle)*(d.y-w.centerY)) + w.centerY;

            if(Math.abs(rotatedX-w.centerX)<(w.width/2)&&(Math.abs(rotatedY-w.centerY)<(w.height/2))){//if x is contained
                w.color=1;

                //bounce
                discRelativeAngle=Math.atan2(rotatedY-w.centerY,rotatedX-w.centerX)
                console.log("relative angle before: "+discRelativeAngle)


                discVelocityMagnitude=Math.sqrt((d.xVelo*d.xVelo)+(d.yVelo*d.yVelo))//pythagorean


                discVelocityAngle=Math.atan2(d.yVelo,d.xVelo)
                //discVelocityAngle-=w.angle

                //discRelativeXVelo=Math.cos(discVelocityAngle)*discVelocityMagnitude
                //discRelativeYVelo=Math.sin(discVelocityAngle)*discVelocityMagnitude



                //console.log(discVelocityMagnitude)
                
                
                //console.log(discVelocityAngle)
                //console.log((Math.cos(discVelocityAngle)*discVelocityMagnitude))

                regionAngle=Math.atan2(w.height/2,w.width/2)

                //n=0
                newDiscVelocityAngle=0

                wallAngle=0
                side = "";
                //figure out which side it's on

                if(discRelativeAngle<regionAngle&&discRelativeAngle>-regionAngle){
                    console.log("right")
                    side = "right";

                    discVelocityAngle-=(w.angle+(Math.PI))
                    a=(Math.PI/2)-discVelocityAngle
                    if(a>(Math.PI/2)){
                        a=(Math.PI/2)+discVelocityAngle
                        flip=true
                        a*=-1
                    }
                    a+=w.angle
                    newDiscVelocityAngle=a+(Math.PI)
                    //discRelativeXVelo*=-1
                    
                    
                    //n=Math.PI


                }
                else if(discRelativeAngle<Math.PI-regionAngle&&discRelativeAngle>regionAngle){
                    console.log("bottom")
                    side = "bottom";


                    discVelocityAngle-=(w.angle+(Math.PI/2))
                    a=(Math.PI/2)-discVelocityAngle
                    if(a>(Math.PI/2)){
                        a=(Math.PI/2)+discVelocityAngle
                        flip=true
                        a*=-1
                    }
                    a+=w.angle
                    newDiscVelocityAngle=a+(Math.PI/2)

                    
                    //discRelativeYVelo*=-1

                    //wallAngle=0-discVelocityAngle


                   // n=Math.PI/2
                }
                else if((discRelativeAngle<Math.PI&&discRelativeAngle>Math.PI-regionAngle)||(discRelativeAngle>-Math.PI&&discRelativeAngle<regionAngle-Math.PI)){
                    console.log("left")
                    side = "left";

                    discVelocityAngle-=w.angle
                    a=(Math.PI/2)-discVelocityAngle
                    if(a>(Math.PI/2)){
                        a=(Math.PI/2)+discVelocityAngle
                        flip=true
                        a*=-1
                    }
                    a+=w.angle
                    newDiscVelocityAngle=a


                    //discRelativeXVelo*=-1

                    //wallAngle=90-discVelocityAngle


                   // n=0
                }
                else if(discRelativeAngle<-regionAngle&&discRelativeAngle>regionAngle-Math.PI){
                    console.log("top")
                    side = "top";

                    discVelocityAngle-=(w.angle+(3*(Math.PI/2)))
                    a=(Math.PI/2)-discVelocityAngle
                    if(a>(Math.PI/2)){
                        a=(Math.PI/2)+discVelocityAngle
                        flip=true
                        a*=-1
                    }
                    a+=w.angle
                    newDiscVelocityAngle=a+(3*(Math.PI/2))

                   

                    //discRelativeYVelo*=-1

                    //wallAngle=0-discVelocityAngle


                    //n=3*Math.PI/2
                }
                else{
                    console.log("corner or center or error")
                    //n=0
                }

                //newDiscVelocityAngle=Math.atan2(discRelativeXVelo,discRelativeYVelo)


                //newDiscVelocityAngle+=Math.PI/2
                //newDiscVelocityAngle+w.angle
                //newDiscVelocityAngle=(2*Math.PI)-newDiscVelocityAngle
                if(flip)
                {
                    d.yVelo=(Math.cos(newDiscVelocityAngle)*discVelocityMagnitude)//works*
                    d.xVelo=(Math.sin(newDiscVelocityAngle)*discVelocityMagnitude)//works*
                }
                //else
                //{
                //    d.xVelo=-(Math.cos(newDiscVelocityAngle)*discVelocityMagnitude)//works*
                //    d.yVelo=-(Math.sin(newDiscVelocityAngle)*discVelocityMagnitude)//works*
                //}
                if(w.angle%Math.PI == 0 && (side == "left" || side == "right"))
                {
                    d.yVelo*=-1;
                }
                else if(w.angle%Math.PI == 0 && (side == "top" || side == "bottom"))
                {
                    //d.xVelo*=-1;
                    d.yVelo*=-1;
                }
                flip = false;
                d.bounceDecay--;

                //d.x=gameWidth/2
                //d.y=gameHeight/2
                

            }
            else{
                w.color=0
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
