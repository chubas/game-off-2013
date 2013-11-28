Class('Projectile').inherits(Behavior)({
    prototype : {

        // Override params
        target : null,
        radius : 100,
        angle : 0,
        speed : 1,

        init : function(config) {
            Behavior.prototype.init.call(this, config);
            this._distance = 0;
        },

        draw : function(context) {
            var a = this.toRad(this.angle);
            this._distance = this._distance + this.speed;
            this.target.x = this.x + this._distance * Math.cos(a);
            this.target.y = this.y + this._distance * Math.sin(a);
            this.target.draw(context);
            this._drawPath(context);
        },

        _drawPath : function(context) {
            if(!window.DEBUG) {
                return;
            }
            var a = this.toRad(this.angle);
            context.beginPath();
            context.strokeStyle = '#999';
            context.moveTo(this.x, this.y);
            context.lineTo(this.target.x, this.target.y);
            context.stroke();
        }
    }
});