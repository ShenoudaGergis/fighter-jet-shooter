import {Vector} from "./vector.mjs";
import util from "./util.mjs";


export function Jet(canvas , imgs) {
    let imageData     = imgs[util.generateRandomNumber(0 , imgs.length - 1)];    
    this.canvas       = canvas;
    this.context      = this.canvas.getContext("2d");
    this.direction    = imageData.direction;
    this.image        = imageData.image;    
    this.location     = new Vector((this.direction === -1) ? this.canvas.width : -this.image.width , util.generateRandomNumber(10 , 80));
    this.velocity     = new Vector(util.generateRandomNumber(10 , 20) * this.direction , util.generateRandomNumber(-1 , 1));
    this.isOut        = false; 
}

//-------------------------------------------------------------------------------------------------


Jet.prototype.update = function() {
    if(this.direction === 1) {
        if(this.location.x >= this.canvas.width) {
            this.isOut = true;
            return;
        }
    } else {
        if(this.location.x + this.image.width <= 0) {
            this.isOut = true;
            return;
        }
    }
    this.location.add(this.velocity);
};

//-------------------------------------------------------------------------------------------------

Jet.prototype.isJetHitByBullet = function(bullet) {
    return !(
        bullet.location.x + 5 < this.location.x ||
        bullet.location.y + 5 < this.location.y ||
        bullet.location.x     > this.location.x + this.image.width ||
        bullet.location.y     > this.location.y + this.image.width
    );    
};

//-------------------------------------------------------------------------------------------------

Jet.prototype.isJetHit = function(bullets) {
    let result = {hit : false , bulletIndex : null}; 
    bullets.forEach((bullet , i) => {
        if(this.isJetHitByBullet(bullet)) {
            result.hit = true;
            result.bulletIndex = i;
        }
    });
    return result;
};

//-------------------------------------------------------------------------------------------------

Jet.prototype.draw = function() {
    this.context.drawImage(this.image , this.location.x , this.location.y);
};
