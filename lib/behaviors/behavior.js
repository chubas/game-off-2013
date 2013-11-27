Class('Behavior').inherits(Entity)({
    prototype : {
        init : function(config) {
            Entity.prototype.init.call(this, config);
            this.x = this.target.x;
            this.y = this.target.y;
            this.faction = this.target.faction;
            this.color = this.target.color;
            this.relativeSpeed = this.target.relativeSpeed;
        },

        move : function(deltaX, deltaY) {
            Entity.prototype.move.call(this, deltaX, deltaY);
            this.target.move(deltaX, deltaY);
        },

        rotate : function(angle) {
            Entity.prototype.rotate.call(this, angle);
            this.target.rotate(angle);
        },

        getFullBoundingBox : function() {
            return this.target.getFullBoundingBox();
        },

        collidesWith : function(player) {
            return this.target.collidesWith(player);
        },

        die : function() {
            return this.target.die();
        }
    }
});