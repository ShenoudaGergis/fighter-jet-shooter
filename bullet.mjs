import {Vector} from "./vector.mjs";

export function Bullet(canvas , location) {
    this.canvas   = canvas;
    this.context  = this.canvas.getContext("2d");
    this.location = new Vector(location.x , location.y);
    this.velocity = new Vector(0 , -15);
    this.friction = 0.99;
    this.isOut    = false; 
}

//-------------------------------------------------------------------------------------------------

Bullet.prototype.update = function() {
    if(this.location.y <= 0) {
        this.isOut = true;
    }
    this.velocity.mul(this.friction);
    this.location.add(this.velocity);
};

//-------------------------------------------------------------------------------------------------

Bullet.prototype.draw = function(image) {
    this.context.drawImage(image , this.location.x , this.location.y);
};