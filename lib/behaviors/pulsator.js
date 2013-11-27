Class('Pulsator').inherits(Behavior)({

    prototype : {

        init : function(config) {
            Behavior.prototype.init.call(this, config);
            this._direction = this.initialPosition >= 0;
            this.radius = this.minRadius +
                ((this.maxRadius - this.minRadius) * this.initialPosition);
            this.target.radius = this.radius;
        },

        draw : function(context) {
            if(this._direction) {
                if(this.radius + this.speed > this.maxRadius) {
                    this._direction = false;
                } else {
                    this.radius = this.radius + this.speed;
                }
            } else {
                if(this.radius - this.speed < this.minRadius) {
                    this._direction = true;
                } else {
                    this.radius = this.radius - this.speed;
                }
            }
            this.target.radius = this.radius;
            this.target.draw(context);
        }


    }

});