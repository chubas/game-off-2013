Class('Rectangle').inherits(Entity)({
    prototype : {
        x : 800,
        y : 100,
        width : 20,
        height : 100,
        angle : 0,

        draw : function(context) {
            context.fillStyle = 'orange';
            context.beginPath();
            var x = this.x,
                y = this.y,
                a = this.toRad(this.angle),
                w = this.width / 2,
                h = this.height / 2,
                r = Math.sqrt(w * w + h * h);
            var c = Math.atan(h / w) + a;
            console.log(a, h, w, this.toDeg(c));
            // console.log("c", c, "r", r);
            context.moveTo(
                x + r * Math.cos(c),
                y + r * Math.sin(c)
            );
            context.lineTo(
                x + r * Math.cos(Math.PI - c),
                y + r * Math.sin(Math.PI - c)
            );
            context.lineTo(
                x + r * Math.cos(Math.PI + c),
                y + r * Math.sin(Math.PI + c)
            );
            context.lineTo(
                x + r * Math.cos(-c),
                y + r * Math.sin(-c)
            );
            context.closePath();
            context.fill();
            this.drawCenter(context);
        }
    }
});