Class('Circle').inherits(Entity)({
    prototype : {
        draw : function(context) {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.fill();
            this._drawCenter(context);
            this._drawBoundingBox(context);
        },

        getFullBoundingBox : function() {
            return [
                this.x - this.radius,
                this.y - this.radius,
                this.x + this.radius,
                this.y + this.radius
            ];
        },

        collidesWith : function(player) {
            var circle = this;

            var playerVertices = player.getVertices();

            var A = playerVertices[0],
                B = playerVertices[1],
                C = playerVertices[2];

            // Point is inside circle if the distance between the two is less
            // than the radius of the circle
            var isInsideSelf = function(P) {
                return (Math.pow(P[0] - circle.x, 2) +
                        Math.pow(P[1] - circle.y, 2)) <
                        Math.pow(circle.radius, 2);
            };
            return isInsideSelf(A) || isInsideSelf(B) || isInsideSelf[C];
        }

    }
});