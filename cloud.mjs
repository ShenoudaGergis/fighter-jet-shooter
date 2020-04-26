import {Vector} from "./vector.mjs";
import util from "./util.mjs";

export default function Cloud(canvas) {
    this.canvas    = canvas;
    this.context   = this.canvas.getContext("2d");
    this.direction = [1 , -1][util.generateRandomNumber(0 , 1)]; 
    this.location  = new Vector(util.generateRandomNumber(100 , 200) * this.direction * -1 , util.generateRandomNumber(10 , 100));
    this.velocity  = new Vector(util.generateRandomNumber(1 , 4) * this.direction , 0);
    this.width  = util.generateRandomNumber(250 , 300);
    this.height = util.generateRandomNumber(100 , 150);
}

//-------------------------------------------------------------------------------------------------

Cloud.prototype.update = function() {
    if(this.location.x < -this.width * 2 || this.location.x > this.canvas.width + this.width * 2) {
        this.velocity.x *= -1;
    }
    this.location.add(this.velocity);
};

//-------------------------------------------------------------------------------------------------

Cloud.prototype.draw = function(image) {
    this.context.drawImage(image , this.location.x , this.location.y , this.width , this.height);
};