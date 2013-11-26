Class('Extensor').inherits(Behavior)({
    prototype : {

        target : null,
        radius : 100,
        angle : 0,

        draw : function(context) {
            var a = this.toRad(this.angle);
            this.target.x = this.x + this.radius * Math.cos(a);
            this.target.y = this.y + this.radius * Math.sin(a);
            this.target.draw(context);
            this._drawPath(context);
        },

        _drawPath : function(context) {
            if(!window.DEBUG) {
                return;
            }
            var a = this.toRad(this.angle);
            var originX = this.target.x - (this.radius * Math.cos(a));
            var originY = this.target.y - (this.radius * Math.sin(a));
            context.beginPath();
            context.strokeStyle = '#999';
            context.moveTo(originX, originY);
            context.lineTo(
                originX + this.radius * Math.cos(a),
                originY + this.radius * Math.sin(a)
            );
            context.stroke();
        }
    }
});