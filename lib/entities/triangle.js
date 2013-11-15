Class('Triangle').inherits(Entity)({
    prototype : {
        x : 0,
        y : 0,
        angle : 0,
        radius : 40,
        speed : 1, // Degrees per tick

        _120deg : 2 * Math.PI / 3,

        draw : function(context) {
            var r = this.radius,
                a = this.toRad(this.angle),
                x = this.x,
                y = this.y; // Only for easier writing of the formulae
            var _120deg = this._120deg;
            context.fillStyle = 'blue';
            context.beginPath();
            context.moveTo(
                x + (r * Math.cos(a)),
                y + (r * Math.sin(a))
            );
            context.lineTo(
                x + (r * Math.cos(a + _120deg)),
                y + (r * Math.sin(a + _120deg))
            );
            context.lineTo(
                x + (r * Math.cos(a - _120deg)),
                y + (r * Math.sin(a - _120deg))
            );
            context.closePath();
            context.fill();

            this.drawCenter(context);
        }
    }
});