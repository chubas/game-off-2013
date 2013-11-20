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

            var tmpX, tmpY,
                minX = this.x, minY = this.y,
                maxX = this.x, maxY = this.y;

            var updateBounds = function(currentX, currentY) {
                minX = Math.min(currentX, minX);
                minY = Math.min(currentY, minY);
                maxX = Math.max(currentX, maxX);
                maxY = Math.max(currentY, maxY);
            };

            tmpX = x + (r * Math.cos(a));
            tmpY = y + (r * Math.sin(a));

            updateBounds(tmpX, tmpY);
            context.moveTo(tmpX, tmpY);

            tmpX = x + (r * Math.cos(a + _120deg));
            tmpY = y + (r * Math.sin(a + _120deg));
            updateBounds(tmpX, tmpY);
            context.lineTo(tmpX, tmpY);

            tmpX = x + (r * Math.cos(a - _120deg));
            tmpY = y + (r * Math.sin(a - _120deg));
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