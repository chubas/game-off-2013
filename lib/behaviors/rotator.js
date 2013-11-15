Class('Rotator').inherits(Behavior)({
    prototype : {

        target : null,
        speed : 1,

        draw : function(context) {
            this.target.rotate(this.speed);
            this.target.draw(context);
        }

    }
});