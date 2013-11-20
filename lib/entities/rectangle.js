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

            var tmpX, tmpY,
                minX = this.x, minY = this.y,
                maxX = this.x, maxY = this.y;

            var updateBounds = function(currentX, currentY) {
                minX = Math.min(currentX, minX);
                minY = Math.min(currentY, minY);
                maxX = Math.max(currentX, maxX);
                maxY = Math.max(currentY, maxY);
            };

            tmpX = x + r * Math.cos(a + c);
            tmpY = y + r * Math.sin(a + c);
            updateBounds(tmpX, tmpY);
            context.moveTo(tmpX, tmpY);

            tmpX = x + r * Math.cos(a + Math.PI - c);
            tmpY = y + r * Math.sin(a + Math.PI - c);
            updateBounds(tmpX, tmpY);
            context.lineTo(tmpX, tmpY);

            tmpX = x + r * Math.cos(a + Math.PI + c);
            tmpY = y + r * Math.sin(a + Math.PI + c);
            updateBounds(tmpX, tmpY);
            context.lineTo(tmpX, tmpY);

            tmpX = x + r * Math.cos(a + (2 * Math.PI) - c);
            tmpY = y + r * Math.sin(a + (2 * Math.PI) - c);
            updateBounds(tmpX, tmpY);
            context.lineTo(tmpX, tmpY);

            context.closePath();
            context.fill();
            
            this._boundingBox = [minX, minY, maxX, maxY];
            this._drawCenter(context);
            this._drawBoundingBox(context);
        },

        getFullBoundingBox : function() {
            return this._boundingBox;
        }
    }
});