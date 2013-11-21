Class('Triangle').inherits(Entity)({
    prototype : {
        x : 0,
        y : 0,
        angle : 0,
        radius : 40,
        speed : 1, // Degrees per tick

        _120deg : 2 * Math.PI / 3,

        draw : function(context) {
            var triangle = this;
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

            var updateBounds = function(pointName, currentX, currentY) {
                minX = Math.min(currentX, minX);
                minY = Math.min(currentY, minY);
                maxX = Math.max(currentX, maxX);
                maxY = Math.max(currentY, maxY);
                triangle[pointName + 'x'] = currentX;
                triangle[pointName + 'y'] = currentY;
            };

            tmpX = x + (r * Math.cos(a));
            tmpY = y + (r * Math.sin(a));

            updateBounds('A', tmpX, tmpY);
            context.moveTo(tmpX, tmpY);

            tmpX = x + (r * Math.cos(a + _120deg));
            tmpY = y + (r * Math.sin(a + _120deg));
            updateBounds('B', tmpX, tmpY);
            context.lineTo(tmpX, tmpY);

            tmpX = x + (r * Math.cos(a - _120deg));
            tmpY = y + (r * Math.sin(a - _120deg));
            updateBounds('C', tmpX, tmpY);
            context.lineTo(tmpX, tmpY);

            context.closePath();
            context.fill();

            this._boundingBox = [minX, minY, maxX, maxY];
            this._drawCenter(context);
            this._drawBoundingBox(context);
        },

        getFullBoundingBox : function() {
            return this._boundingBox;
        },

        collidesWith : function(player) {
            // Algorithm totally taken from
            // http://www.nerdparadise.com/math/geometry/pointinatriangle/
            var triangle = this;
            cross = function(vector1, vector2) {
                return ((vector1[1][0] - vector1[0][0]) *
                        (vector2[1][1] - vector2[0][1])) -
                       ((vector2[1][0] - vector2[0][0]) *
                        (vector1[1][1] - vector1[0][1]));
            };

            var playerVertices = player.getVertices();
            var A = playerVertices[0],
                B = playerVertices[1],
                C = playerVertices[2];

            // Tests if the point P is inside the triangle
            isInsideSelf = function(P) {
                var APxAB = cross([A, P], [A, B]);
                var BPxBC = cross([B, P], [B, C]);
                var CPxCA = cross([C, P], [C, A]);

                // Check if AP X AB, BP X BC, CP X CA all have same sign
                return (APxAB < 0 && BPxBC < 0 && CPxCA < 0) ||
                        (APxAB > 0 && BPxBC > 0 && CPxCA > 0);

            };
            return isInsideSelf([this.Ax, this.Ay]) ||
                    isInsideSelf([this.Bx, this.By]) ||
                    isInsideSelf([this.Cx, this.Cy]);
        }
    }
});