Class('Swinger').inherits(Entity)({
    prototype : {

        // Swinging properties
        target : null,
        radius : 100,
        angle : 0, // Positive clockwise

        speed : 1,

        // _direction: true is going, false if returning
        _direction : true,
        _relDistance : 0,

        draw : function(context) {
            var a = this.toRad(this.angle);
            if(this._direction) {
                if(this._relDistance + this.speed > this.radius) {
                    this._direction = false;
                } else {
                    this.target.x = this.target.x + this.speed * Math.cos(a);
                    this.target.y = this.target.y + this.speed * Math.sin(a);
                    this._relDistance = this._relDistance + this.speed;
                }
            } else {
                if(this._relDistance < this.speed) {
                    this._direction = true;
                } else {
                    this.target.x = this.target.x - this.speed * Math.cos(a);
                    this.target.y = this.target.y - this.speed * Math.sin(a);
                    this._relDistance = this._relDistance - this.speed;
                }
            }
            this._drawPath(context);
            this.target.draw(context);
        },

        move : function(deltaX, deltaY) {
            this.target.move(deltaX, deltaY);     
        },

        rotate : function(degrees) {
            this.target.rotate(degrees);
        },

        _drawPath : function(context) {
            var a = this.toRad(this.angle);
            var originX = this.target.x - (this._relDistance * Math.cos(a));
            var originY = this.target.y - (this._relDistance * Math.sin(a));
            context.beginPath();
            context.strokeStyle = 'black';
            context.moveTo(originX, originY);
            context.lineTo(
                originX + this.radius * Math.cos(a),
                originY + this.radius * Math.sin(a)
            );
            context.stroke();
        },

    }
});