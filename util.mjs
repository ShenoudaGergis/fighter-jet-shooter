export default {
    getPercent : function(total , perc) {
        return perc * total / 100;
    } ,

    getPageCenterPoint : function(width , height) {
        return {
            x : Math.floor(width / 2) ,
            y : Math.floor(height / 2) 
        };
    } ,

    deg2rad : function(deg) {
        return deg * Math.PI / 180;
    } ,

    distanceBetweenTwoPoints : function(point1 , point2) {
        return Math.ceil(Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y) , 2)));
    } , 

    generateRandomNumber : function(min , max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } , 

    generateRandomColor : function() {
        let letters = '0123456789ABCDEF' , color = '#';
        for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
        return color;
    } ,

    // createImage : function(src) {
    //     let img = document.createElement("IMG");
    //     img.src = src;
    //     return img;
    // } ,

    createImage : function(data) {
        let img = document.createElement("IMG");
        img.src = data.url;
        return new Promise(function(resolve , reject) {
            img.onload = function() {
                resolve({
                    label : data.label ,
                    name  : data.name  ,
                    dom   : img
                });
            };
            img.onerror = function() {
                reject({
                    label : data.label ,
                    name  : data.name  ,
                    dom   : null
                });
            };
        });
    } ,

    createAudio : function(data) {
        let sound = document.createElement("audio");
        sound.src = data.url;
        sound.setAttribute("preload", "auto");
        sound.setAttribute("controls", "none");
        sound.style.display = "none";
        document.body.appendChild(sound);
        return new Promise(function(resolve , reject) {
            sound.onloadeddata = function() {
                resolve({
                    label : data.label ,
                    name  : data.name  ,
                    dom   : sound
                });
            };
            sound.onerror = function() {
                reject({
                    label : data.label ,
                    name  : data.name  ,
                    dom   : null
                });
            };
        }); 
    } ,

    createAudio2 : function(data) {
        return new Promise((resolve , reject) => {
            try {
                let sound = new Pizzicato.Sound(data.url, function() {
                    resolve({
                        label : data.label ,
                        name  : data.name  ,
                        dom   : sound
                    });
                });           
            } catch(error) {
                reject({
                    label : data.label ,
                    name  : data.name  ,
                    dom   : null
                });
            }
        });
    } ,

    createFont : function(data) {
        let fontFace = new FontFace(data.name , `url(${ data.url })`);
        return fontFace.load().then((fontFace) => {
            return {
                label : data.label ,
                name  : data.name  ,
                dom   : fontFace
            };
        } , () => {
            throw {
                label : data.label ,
                name  : data.name  ,
                dom   : null
            };
        });
    } ,

    toTime : function(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds      = Math.floor((duration / 1000) % 60),
            minutes      = Math.floor((duration / (1000 * 60)) % 60),
            hours        = Math.floor((duration / (1000 * 60 * 60)) % 24);
        hours   = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    } ,

    getJetsFromAssets : function(assets) {
        let results = [];
        Object.keys(assets).forEach((name) => {
            if(name[0] === "+" || name[0] === "-") {
                results.push({
                    image : assets[name] ,
                    direction : (name[0] === "+") ? 1 : -1
                });
            }
        });
        return results;
    }
};


//-------------------------------------------------------------------------------------------------

Event.prototype.add = function(eventID , func , type) {
    if(eventID in this.events[type]) {
        this.events[type][eventID].push(func);
    } else {
        this.events[type][eventID] = [func];
    }
};

//-------------------------------------------------------------------------------------------------

Event.prototype.once = function(eventID , func) {
    this.add(eventID , func , "once");
};

//-------------------------------------------------------------------------------------------------

Event.prototype.on = function(eventID , func) {
    this.add(eventID , func , "on");
};

//-------------------------------------------------------------------------------------------------

Event.prototype.fire = function(eventID) {
    if(eventID in this.events.once) {
        this.events.once[eventID].forEach((func) => {
            func();
        });
        this.removeOnce(eventID);
    }
    if(eventID in this.events.on) {
        this.events.on[eventID].forEach((func) => {
            func();
        });
    }
};

//-------------------------------------------------------------------------------------------------

Event.prototype.remove = function(eventID , type) {
    if(eventID in this.events[type]) {
        delete this.events[type][eventID];
    }
};

//-------------------------------------------------------------------------------------------------

Event.prototype.removeOnce = function(eventID) {
    this.remove(eventID , "once");
};

//-------------------------------------------------------------------------------------------------

Event.prototype.removeOn = function(eventID) {
    this.remove(eventID , "on");
};

//-------------------------------------------------------------------------------------------------

export function Event() {
    this.events = {
        "once" : {} ,
        "on"   : {}
    };
}