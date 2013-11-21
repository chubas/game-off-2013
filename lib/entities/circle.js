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
            var slope;
            var r = this.radius + (player.height - player.radius);
            var cx, cy;
            if(this.y > player.y) {
                slope = 1 / Math.sqrt(3);
                cx = player.x + (r * 0.5);
                cy = player.y + (r * Math.sqrt(3) / 2);
                // The equation of the line that is separated exactly r
                // from the triangle is
                // Y - cy >= slope (X - cx)
                return this.y - cy >= slope * (this.x - cx);
            } else {
                slope = -1 / Math.sqrt(3);
                cx = player.x + (r * 0.5);
                cy = player.y - (r * Math.sqrt(3) / 2);
                // The equation for this one is the inverse
                return this.y - cy < slope * (this.x - cx);
            }

            return false;

        }

    }
});