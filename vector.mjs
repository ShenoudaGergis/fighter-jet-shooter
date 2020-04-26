Vector.prototype.add = function(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
};

//-------------------------------------------------------------------------------------------------

Vector.prototype.sub = function(otherVector) {
    this.x -= otherVector.x;
    this.y -= otherVector.y;
};

//-------------------------------------------------------------------------------------------------

Vector.prototype.mul = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
};

//-------------------------------------------------------------------------------------------------

Vector.prototype.mag = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

//-------------------------------------------------------------------------------------------------

Vector.prototype.dProd = function(otherVector) {
    return (this.x * otherVector.x) + (this.y * otherVector.y);
};

//-------------------------------------------------------------------------------------------------

Vector.prototype.cosAngle = function(otherVector) {
    return (this.dProd(otherVector)) / (this.mag(this) * this.mag(otherVector));
};

//-------------------------------------------------------------------------------------------------

Vector.mag = function(vector) {
    return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
};

//-------------------------------------------------------------------------------------------------

Vector.sub = function(vector1 , vector2) {
    return (new Vector((vector1.x - vector2.x) , (vector1.y - vector2.y)));
};

//-------------------------------------------------------------------------------------------------

Vector.dProd = function(vector1 , vector2) {
    return (vector1.x * vector2.x) + (vector1.y * vector2.y);
};

//-------------------------------------------------------------------------------------------------

Vector.mul = function(scalar , vector) {
    vector.x *= scalar;
    vector.y *= scalar;
    return vector;
};

export function Vector(x=0 , y=0) {
    this.x = x;
    this.y = y;
}
