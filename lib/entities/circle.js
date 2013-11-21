Class('Circle').inherits(Entity)({
    prototype : {
        draw : function(context) {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.fill();
            this.__context = context; // For debugging only
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

            var A = [
                player.x - (player.height - player.radius),
                player.y - (player.side / 2)
            ];
            var B = [
                player.x + player.radius,
                player.y
            ];
            var C = [
                player.x - (player.height - player.radius),
                player.y + (player.side / 2)
            ];

            var isInsideCircle = function(P) {
                return (Math.pow(P[0] - circle.x, 2) +
                        Math.pow(P[1] - circle.y, 2)) <
                        Math.pow(circle.radius, 2);
            };
            return isInsideCircle(A) || isInsideCircle(B) || isInsideCircle[C];
        }

    }
});