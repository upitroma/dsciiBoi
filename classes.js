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