Class('Behavior').inherits(Entity)({
    prototype : {
        init : function(config) {
            Entity.prototype.init.call(this, config);
            this.x = this.target.x;
            this.y = this.target.y;
        },

        move : function(deltaX, deltaY) {
            Entity.prototype.move.call(this, deltaX, deltaY);
            this.target.move(deltaX, deltaY);
        },

        rotate : function(angle) {
            Entity.prototype.rotate.call(this, angle);
            this.target.rotate(angle);
        }
    }
});