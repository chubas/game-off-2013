Class('Player')({

    COLORS : ['blue', 'red', 'orange'],

    prototype : {

        color : 'orange',

        init : function() {
            this.x = 20;
            this.y = 230;
        },

        draw : function(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.moveTo(this.x, this.y - 20);
            context.lineTo(this.x + 40, this.y);
            context.lineTo(this.x, this.y + 20);
            context.closePath();
            context.fill();
            Entity.prototype._drawBoundingBox.call(this, context);
            Entity.prototype._drawCenter.call(this, context);
        },

        getFullBoundingBox : function() {
            return [this.x, this.y - 20, this.x + 40, this.y + 20];
        },

    }

});