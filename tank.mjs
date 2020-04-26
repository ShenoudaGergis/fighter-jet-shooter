import {Vector} from "./vector.mjs";
import {Bullet} from "./bullet.mjs";

export function Tank(canvas , location) {
    this.canvas       = canvas;
    this.context      = this.canvas.getContext("2d");
    this.imageWidth   = 64;  
    this.location     = new Vector(location.x , location.y);
    this.velocity     = new Vector(0 , 0);
    this.acceleration = new Vector(4 , 0);
    this.friction     = 0.8;
    this.maxAmmo      = 20;
    this.ammo         = this.maxAmmo;
    this.ammoFired    = 0;
    this.health       = 100;
    this.score        = 0;
    this.left  = false;
    this.right = false;
    this.space = false;
}

//-------------------------------------------------------------------------------------------------

Tank.prototype.onLeft = function() {
    this.velocity.sub(this.acceleration);
};

//-------------------------------------------------------------------------------------------------

Tank.prototype.onRight = function() {
    this.velocity.add(this.acceleration);
};

//-------------------------------------------------------------------------------------------------

Tank.prototype.reload = function(time) {
    if(time % 600 === 0 && this.ammo < this.maxAmmo) this.ammo += 1;
};

//-------------------------------------------------------------------------------------------------

Tank.prototype.canFire = function(time) {
    if(time % 7 === 0 && this.ammo > 0) {
        this.ammo--;
        this.ammoFired++;
        return true;
    }
    else {return false;}
};

//-------------------------------------------------------------------------------------------------

Tank.prototype.update = function(time , bullets , bulletSound) {
    if(this.left)  this.onLeft();
    if(this.right) this.onRight();
    if(this.space) {
        if(this.canFire(time)) {
            bullets.push(new Bullet(this.canvas , this.location));
            bulletSound.play();
        } 
    }

    if(this.location.x <= 0) {
        this.velocity.mul(-1);
        this.location.x = 0;
    }
    if(this.location.x + this.imageWidth >= this.canvas.width) {
        this.velocity.mul(-1);
        this.location.x = this.canvas.width - this.imageWidth;
    }
    this.reload(time);
    this.velocity.mul(this.friction);
    this.location.add(this.velocity);
};

//-------------------------------------------------------------------------------------------------

Tank.prototype.isTankHit = function(bomb) {
    let diff = Math.abs(bomb.location.x - this.location.x);
    if(diff >= 0 && diff <= 50) {
        this.health -= 20;
        return true;
    } 
    return false;
};

//-------------------------------------------------------------------------------------------------

Tank.prototype.draw = function(image) {
    this.context.drawImage(image , this.location.x , this.location.y);
};
