Class('Rotator').inherits(Entity)({
    prototype : {

        target : null,
        speed : 1,

        draw : function(context) {
            this.target.rotate(this.speed);
            this.target.draw(context);
        },

        move : function(deltaX, deltaY) {
            this.target.move(deltaX, deltaY);
        },

        rotate : function(degrees) {
            this.target.rotate(degrees);
        }
    } 
});