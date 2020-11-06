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


const player={"x":50,"y":100}
const walls=[
    new Wall(1200,300,300,200, 0),
    new Wall(1200,600,300,200, 0),
    new Wall(200,450,100,400, 0)
]