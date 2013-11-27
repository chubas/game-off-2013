Class('Swinger').inherits(Behavior)({
    prototype : {

        // Swinging properties
        target : null,
        radius : 100,
        angle : 0, // Positive clockwise

        speed : 1,

        // _direction: true is going, false if returning
        _direction : true,
        _relDistance : 0,

        init : function(config) {
            Behavior.prototype.init.call(this, config);
            this._relDistance = Math.round(this.radius * Math.abs(this.initialPosition));
            this._direction = this.initialPosition >= 0;
            this._move();
        },

        draw : function(context) {
            this._move();
            this._drawPath(context);
            this.target.draw(context);
        },

        _move : function() {
            var a = this.toRad(this.angle);
            if(this._direction) {
                if(this._relDistance + this.speed > this.radius) {
                    this._direction = false;
                } else {
                    this.target.move(
                        this.speed * Math.cos(a) * this.relativeSpeed,
                        this.speed * Math.sin(a)
                    );
                    this._relDistance = this._relDistance + this.speed;
                }
            } else {
                if(this._relDistance < this.speed) {
                    this._direction = true;
                } else {
                    this.target.move(
                        -this.speed * Math.cos(a) * this.relativeSpeed,
                        -this.speed * Math.sin(a)
                    );
                    this._relDistance = this._relDistance - this.speed;
                }
            }
        },

        _drawPath : function(context) {
            if(!window.DEBUG) {
                return;
            }
            var a = this.toRad(this.angle);
            var originX = this.target.x - (this._relDistance * Math.cos(a));
            var originY = this.target.y - (this._relDistance * Math.sin(a));
            context.beginPath();
            context.strokeStyle = '#999';
            context.moveTo(originX, originY);
            context.lineTo(
                originX + this.radius * Math.cos(a),
                originY + this.radius * Math.sin(a)
            );
            context.stroke();

            // context.beginPath();
            // context.strokeStyle = '#0F0';
            // context.moveTo(this.x - 50, this.y);
            // context.lineTo(this.x + 50, this.y);
            // context.stroke();
        },

    }
});