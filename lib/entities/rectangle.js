Class('Rectangle').inherits(Entity)({
    prototype : {
        x : 800,
        y : 100,
        width : 20,
        height : 100,
        angle : 0,

        init : function(config) {
            Entity.prototype.init.call(this, config);
            var w = this.width / 2;
            var h = this.height / 2;
            this._r = Math.sqrt(w * w + h * h);
            this._c = Math.atan(h / w);
        },

        draw : function(context) {
            context.fillStyle = 'orange';
            context.beginPath();
            var x = this.x,
                y = this.y,
                a = this.toRad(this.angle),
                r = this._r,
                c = this._c;
            // console.log(a, h, w, this.toDeg(c));
            // console.log("c", c, "r", r);
            context.moveTo(
                x + r * Math.cos(a + c),
                y + r * Math.sin(a + c)
            );
            context.lineTo(
                x + r * Math.cos(a + Math.PI - c),
                y + r * Math.sin(a + Math.PI - c)
            );
            context.lineTo(
                x + r * Math.cos(a + Math.PI + c),
                y + r * Math.sin(a + Math.PI + c)
            );
            context.lineTo(
                x + r * Math.cos(a + (2 * Math.PI) - c),
                y + r * Math.sin(a + (2 * Math.PI) - c)
            );
            context.closePath();
            context.fill();
            this._drawCenter(context);
        }
    }
});