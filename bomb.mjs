import {Vector} from "./vector.mjs";
import util from "./util.mjs";

export function Bomb(canvas , location , jetVelocity , explodeLevel) {
    this.canvas       = canvas;
    this.context      = this.canvas.getContext("2d");
    this.location     = new Vector(location.x + 20 , location.y + 20);
    this.explodeLevel = explodeLevel;
    this.velocity     = new Vector(jetVelocity.x , jetVelocity.y);
    this.acceleration = new Vector(-1 * Math.floor(util.getPercent(jetVelocity.x , 50)) , 1);
    this.isOut        = false; 
}

//-------------------------------------------------------------------------------------------------

Bomb.prototype.update = function() {
    if(this.location.y >= this.explodeLevel) {
        this.isOut = true;
        this.location.y = this.explodeLevel - 40;
        return;
    }
    if(this.acceleration.x >= 0) {
        if(this.velocity.x <= 0) this.acceleration.x = 0;
    } else {
        if(this.velocity.x > 0) this.acceleration.x = 0;
    }
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
};

//-------------------------------------------------------------------------------------------------

Bomb.prototype.draw = function(image) {
    this.context.drawImage(image , this.location.x , this.location.y);
};