Class('Circle').inherits(Entity)({
    prototype : {
        draw : function(context) {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.fill();
            this.drawCenter(context);
        } 
    }  
});