Class('Player')({

    prototype : {

        color : 'orange',

        init : function() {
            this.x = 20;
            this.y = 230;
        },

        draw : function(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x + 40, this.y + 20);
            context.lineTo(this.x, this.y + 40);
            context.closePath();
            context.fill();
        }

    }

});