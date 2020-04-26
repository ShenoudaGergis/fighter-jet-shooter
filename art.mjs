import util from "./util.mjs";
import Cloud from "./cloud.mjs";

export function Art(canvas) {
    this.canvas         = canvas;
    this.context        = this.canvas.getContext("2d");
    this.assets         = {};
    this.liveSprites    = [];
    this.skyGradient    = this.getGradient("#9087f5" , "#FFFFFF" , [0, 0, 0, 700]);
    this.soilPattern    = null;
    this.hillsHeight    = this.canvas.height - 150;
    this.starsLocation  = Art.generateBackgroundStars(20 , this.canvas.width , this.hillsHeight);
    this.hillsLocation  = Art.generateGround(this.hillsHeight , this.canvas.width);
    this.clouds         = [new Cloud(this.canvas) , new Cloud(this.canvas) , new Cloud(this.canvas)];
    this.maxJetsInFrame = 0;
    this.maxBombInFrame = 0; 
}

//-------------------------------------------------------------------------------------------------

Art.prototype.getGradient = function(colorStart , colorStop , points) {
    let gradient = this.context.createLinearGradient(...points);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorStop);
    return gradient;
};

//-------------------------------------------------------------------------------------------------

Art.prototype.drawBackground = function() {
    this.context.fillStyle = this.skyGradient;
    this.context.fillRect(0 , 0 , this.canvas.width , this.canvas.height);
    this.context.beginPath();
    this.context.moveTo(0,this.hillsHeight);
    this.context.lineTo(0,this.canvas.height);
    this.context.lineTo(this.canvas.width , this.canvas.height);
    this.context.lineTo(this.canvas.width , this.hillsHeight);
    this.hillsLocation.forEach((point) => {
        this.context.quadraticCurveTo(point.hi.x , point.hi.y , point.to.x , point.to.y);
    });
    if(!this.soilPattern) this.soilPattern = this.context.createPattern(this.assets.floorImage , "repeat");
    this.context.fillStyle = this.soilPattern;
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();

    this.starsLocation.forEach((star) => {
        this.context.beginPath();
        this.context.fillStyle = "#FFFFFF";
        this.context.arc(star.x , star.y , util.generateRandomNumber(1,4) , 0 , util.deg2rad(90));
        this.context.fill();
    });
    
    let cloudImages = [this.assets.cloud1Image , this.assets.cloud2Image , this.assets.cloud3Image]; 
    this.clouds.forEach((cloud , i) => {
        cloud.update();
        cloud.draw(cloudImages[i]);
    });
};

//-------------------------------------------------------------------------------------------------

Art.generateGround = function(hillHeight , width) {
    let parts = [];
    for(let i = width;i >= 0;i--) {
        let to = {x: i - util.generateRandomNumber(2,50), y: hillHeight};
        let hi = {x: to.x + util.generateRandomNumber(3,7), y:hillHeight + util.generateRandomNumber(2,10)};
        parts.push({to , hi});
        i = to.x;
    }
    return parts;
};

//-------------------------------------------------------------------------------------------------

Art.generateBackgroundStars = function(count , width , height) {
    let stars = [];
    for(let i = 0;i < count;i++) {
        let star = {
            x: util.generateRandomNumber(10 , width  - 10),
            y: util.generateRandomNumber(10 , height - 10)
        };
        stars.push(star);
    }
    return stars;
};

//-------------------------------------------------------------------------------------------------

Art.prototype.clearFrame = function() {
    this.context.clearRect(0 , 0 , this.canvas.width , this.canvas.height);    
};

//-------------------------------------------------------------------------------------------------

Art.prototype.playSprite = function(location , image , x , y , w , h) {
    let interval = setInterval(() => {
        this.context.drawImage(this.bombHitExplosionSprite , x , y , w , h , location.x , location.y , w, h);
        if(x === image.width) {
            if(y === image.height) {clearInterval(interval);return;}
            x = 0;
            y += h;
        } else {x += w;}
    } , 30); 
};

//-------------------------------------------------------------------------------------------------

Art.prototype.drawGameOverFrame = function() {
    this.context.font = "bold 50px atari1Font";
    this.context.fillStyle   = "#FFF";
    this.context.globalAlpha = 0.5;
    this.context.fillRect(0 , 0 , this.canvas.width , this.canvas.height);
    this.context.fillStyle   = "black";
    this.context.fillText("Game Over" , Math.floor(this.canvas.width) / 2 - (Math.floor(this.context.measureText("Game Over").width / 2)) , Math.floor(this.canvas.height) / 2 , this.canvas.width);
};

//-------------------------------------------------------------------------------------------------

Art.prototype.drawGameInfo = function(tank , time) {
    this.context.font = "normal 10px atari2Font";
    this.context.fillStyle   = "#FFF";
    this.context.fillText(`Health ${tank.health}` , 10 , 15);
    this.context.fillText(`Ammo   ${tank.ammo} / ${tank.maxAmmo}` , 10 , 30);
    this.context.fillText(`Score  ${tank.score}` , 10 , 45);    
    this.context.fillText(`Shots  ${tank.ammoFired}` , 10 , 60);    
    this.context.fillText(`Time ${ util.toTime(time) }` , 10 , this.canvas.height - 15);    
};

//-------------------------------------------------------------------------------------------------

Art.prototype.drawFrame = function(tank , jets , bombs , bullets) {
    this.drawBackground();
    tank.draw(this.assets.tankImage);
    jets.forEach((jet) => {
        jet.draw(jet.image);
    });
    bombs.forEach((bomb) => {
        bomb.draw(this.assets.bombImage);
    });
    bullets.forEach((bullet) => {
        bullet.draw(this.assets.bulletImage);
    });
    this.liveSprites.forEach((sprite , i) => {
        this.context.drawImage(sprite.image , sprite.x , sprite.y ,sprite.w , sprite.h , sprite.location.x , sprite.location.y , sprite.w , sprite.h);
        if(sprite.x === sprite.image.width) {
            if(sprite.y === sprite.image.height) {
                this.liveSprites.splice(i , 1);
                return;
            }
            sprite.x = 0;
            sprite.y += sprite.h;
        } else {sprite.x += sprite.w;}
    });
    if(tank.health === 0) this.drawGameOverFrame();
};
