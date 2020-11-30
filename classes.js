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
        this.colorId=colorId; //see drawWalls for reference
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

class Arm{
    constructor(x,y) {
        this.status = 0;
        this.theta = 0;
        this.x = x;
        this.y = y;
        this.width = 393 / 10;
        this.height = 1200 / 10;
        this.throw = 0;
    }
    update(deltatime) {
        //console.log(this.theta);
        if (this.status == 0) {
            this.theta = Math.atan2((mouse.y-this.y), (mouse.x-this.x));
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
            this.throw = Math.atan2((mouse.y-this.y), (mouse.x-this.x));
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
            ctx.drawImage(soccerBall, -1*(this.width * scale) / 2, (this.height - 30) * scale, 80*scale, 80*scale)
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