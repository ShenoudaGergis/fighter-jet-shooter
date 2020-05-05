import {Art} from "./art.mjs";
import {Tank} from "./tank.mjs";
import {Jet} from "./jet.mjs";
import {Bomb} from "./bomb.mjs";
import util from "./util.mjs";
import Sound from "./sound.mjs";

function Game(canvasID="jesus") {
    this.canvas  = document.getElementById("jesus");
    this.context = this.canvas.getContext("2d");
    this.timer   = null;
    this.time    = 0;
    this.isEnd   = false;
    this.adjustDimensions();
    this.addCanvasControllers();
    this.art     = new Art(this.canvas);
    this.tank    = new Tank(this.canvas , {x:1 , y:this.art.hillsHeight - 40});
    this.jets    = [];
    this.bombs   = [];
    this.bullets = [];
    
}

//-------------------------------------------------------------------------------------------------

Game.prototype.adjustDimensions = function() {
    document.getElementsByTagName("HTML")[0].style.margin = "0px";
    document.getElementsByTagName("BODY")[0].style.margin = "0px";
    document.getElementsByTagName("HTML")[0].style.padding = "0px";
    document.getElementsByTagName("BODY")[0].style.padding = "0px";
    document.getElementsByTagName("HTML")[0].style.overflow = "hidden";
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;

};

//-------------------------------------------------------------------------------------------------

Game.prototype.addCanvasControllers = function() {
    document.addEventListener('keydown', (event) => {
        if(event.key === "ArrowLeft")   this.tank.left   = true;
        if(event.key === "ArrowRight")  this.tank.right  = true;
        if(event.key === " ")           this.tank.space  = true;
    });
    document.addEventListener('keyup', (event) => {
        if(event.key === "ArrowLeft")   this.tank.left   = false;
        if(event.key === "ArrowRight")  this.tank.right  = false;
        if(event.key === " ")           this.tank.space  = false;
        if(event.key === "Escape")      this.toggleStart();
    });
};

//-------------------------------------------------------------------------------------------------

Game.prototype.toggleStart = function() {
    if(this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
    } else {
        if(!this.isEnd) this.start();
    }
};

//-------------------------------------------------------------------------------------------------

Game.prototype.start = function() {
    this.timer = setInterval(() => {        
        this.time += 30;        
        this.tank.update(this.time , this.bullets , this.art.assets.bulletSound);
        this.bullets.forEach((bullet , i) => {
            bullet.update();
            if(bullet.isOut) {
                this.bullets.splice(i , 1);
                return;
            }
        });
        this.bombs.forEach((bomb , i) => {
            bomb.update();
            if(bomb.isOut) {
                if(this.tank.isTankHit(bomb)) {
                    if(this.tank.health === 0) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.isEnd = true;
                        this.art.assets.bombExplosionSound.clone().play();
                        this.art.assets.gameoverSound.clone().play();
                    }
                }
                this.art.liveSprites.push({
                    "location" : bomb.location , 
                    "image"    : this.art.assets.bombSpriteImage , 
                    "x"        : 0 , 
                    "y"        : 0 , 
                    "w"        : 64 , 
                    "h"        :64});
                this.bombs.splice(i , 1);
                this.art.assets.bombExplosionSound.clone().play();
            }
        });
        this.jets.forEach((jet, i) => {
            jet.update();
            if(jet.isOut) {
                this.jets.splice(i , 1);
                return;
            }
            if((this.jets.length > 1 && this.bombs.length < this.art.maxBombInFrame) && (util.generateRandomNumber(0 , 100) < 50)) {
                let throwerJet = this.jets[util.generateRandomNumber(0 , this.jets.length - 1)];
                let newBomb = new Bomb(this.canvas , throwerJet.location , throwerJet.velocity , this.art.hillsHeight);
                this.bombs.push(newBomb);
                if(util.generateRandomNumber(1 , 50) < 5) {
                    this.art.assets.bombDroppingSound.clone().play();
                }
            }
            let result = jet.isJetHit(this.bullets);
            if(result.hit) {
                jet.isOut = true;
                this.tank.score++;
                this.bullets[result.bulletIndex].isOut = true;
                this.art.liveSprites.push({
                    "location" : jet.location , 
                    "image"    : this.art.assets.jetSpriteImage , 
                    "x"        : 0 , 
                    "y"        : 0 , 
                    "w"        : 64 , 
                    "h"        :64});
                
                this.art.assets.jetExplosionSound.clone().play();
            }    
        });
        if(this.jets.length < this.art.maxJetsInFrame) {    
            this.jets.push(new Jet(this.canvas , util.getJetsFromAssets(this.art.assets)));
        }
        
        this.nextLevel();
        this.art.clearFrame();
        this.art.drawFrame(this.tank , this.jets , this.bombs , this.bullets);
        this.art.drawGameInfo(this.tank , this.time);
    } , 30);
};

//-------------------------------------------------------------------------------------------------

Game.prototype.nextLevel = function() {
    this.art.maxJetsInFrame = Math.floor(this.tank.score / 40) + 4;
    this.art.maxBombInFrame = Math.floor(this.tank.score / 50) + 2;    
};

//-------------------------------------------------------------------------------------------------


let assets = {
    "image" : {
        "tankImage" : {
            url  : "./images/tank.png" ,
        } ,                   
        "bulletImage" : {
            url  : "./images/ammo/bullet.png" , 
        } ,
        "bombImage" : {
            url  : "./images/ammo/bomb.png" , 
        } ,
        "jetSpriteImage" : {
            url  : "./images/sprites/jetHitSprite.png" , 
        } ,
        "bombSpriteImage" : {
            url  : "./images/sprites/bombHitSprite.png" , 
        } ,
        "-jet1Image" : {
            url  : "./images/jets/jet1.png" , 
        } ,
        "+jet2Image" : {
            url  : "./images/jets/jet2.png" , 
        } ,
        "-jet3Image" : {
            url  : "./images/jets/jet3.png" , 
        } ,
        "+jet4Image" : {
            url  : "./images/jets/jet4.png" , 
        } ,
        "cloud1Image" : {
            url : "./images/clouds/cloud1.png"
        } ,
        "cloud2Image" : {
            url : "./images/clouds/cloud2.png"
        } ,
        "cloud3Image" : {
            url : "./images/clouds/cloud3.png"
        } ,
        "floorImage" : {
            url  : `./images/dirt_${util.generateRandomNumber(1,2)}.png` , 
        } ,
    } ,

    "sound" : {
        "tankDestroySound" : {
            url : "./sounds/tankExplosion.mp3" ,
        } ,
        
        "bulletSound" : {
            url : "./sounds/bulletFiring.mp3" ,
        } ,

        "bombExplosionSound" : {
            url : "./sounds/bombExplosion.mp3" ,
        } ,

        "jetExplosionSound" : {
            url : "./sounds/jetExplosion.mp3" ,
        } ,

        "bombDroppingSound" : {
            url : "./sounds/bombDropping.mp3" ,
        } ,
        
        "gameoverSound" : {
            url : "./sounds/gameover.mp3" ,
        }
    } ,

    "font" : {
        "atari1Font" : {
            url  : "./font/AtariClassicChunky-PxXP.ttf" , 
        } ,

        "atari2Font" : {
            url : "./font/AtariClassic-gry3.ttf" ,
        }
    }
};

let allPromises = [];
Object.keys(assets).forEach((label) => {
    if(label === "image") {
        let items = assets[label];
        Object.keys(items).forEach((imgName) => {
            allPromises.push(util.createImage({label : "image" , name : imgName , url : items[imgName].url}));
        });
    }

    if(label === "sound") {
        let items = assets[label];
        Object.keys(items).forEach((soundName) => {
            allPromises.push(util.createAudio({label : "sound" , name : soundName , url : items[soundName].url}));
        });
    }

    if(label === "font") {
        let items = assets[label];
        Object.keys(items).forEach((fontName) => {
            allPromises.push(util.createFont({label : "font" , name : fontName , url : items[fontName].url}));
        });
    }
});

Promise.all(allPromises).then((results) => {
    let game = new Game();
    results.forEach(({label , name , dom}) => {
        if(label === "image") {
            game.art.assets[name] = dom;
        }
        if(label === "sound") {
            game.art.assets[name] = new Sound(dom);
        }
        if(label === "font") {
            document.fonts.add(dom);
        }
    });
    game.start();
} , (results) => {
    console.error(results);
});
