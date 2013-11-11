Class('Triangle').inherits(Entity)({
    prototype : {
        x : 0,
        y : 00,
        angle : 0,
        radius : 40,
        speed : 1, // Degrees per tick

        draw : function(context) {
            var r = this.radius,
                a = this.angle * Math.PI / 180, // Convert to radians
                x = this.x,
                y = this.y; // Only for easier writing of the formulaes
            var _120deg = 2 * Math.PI / 3;
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

            this.angle = (this.angle + this.speed) % 360;
            this.drawCenter(context);
        } 
    }
});