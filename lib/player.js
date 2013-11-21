Class('Player')({

    COLORS : ['orange', 'blue', 'red'],

    prototype : {

        color : 'orange',

        init : function(config) {
            this.x = config.position.x;
            this.y = config.position.y;
            this.radius = config.radius;
            this.side = Math.round(this.radius * 3 / Math.sqrt(3));
            this.height = Math.round(this.side * Math.sqrt(3) / 2);
        },

        draw : function(context) {

            context.fillStyle = this.color;
            context.beginPath();

            var vertexes = this.getVertices();

            context.moveTo(
                vertexes[0][0],
                vertexes[0][1]
            );
            context.lineTo(
                vertexes[1][0],
                vertexes[1][1]
            );
            context.lineTo(
                vertexes[2][0],
                vertexes[2][1]
            );
            context.closePath();
            context.fill();
            Entity.prototype._drawBoundingBox.call(this, context);
            Entity.prototype._drawCenter.call(this, context);
        },

        getFullBoundingBox : function() {
            return [
                this.x - (this.height - this.radius),
                this.y - (this.side / 2),
                this.x + this.radius,
                this.y + (this.side / 2)
            ];
        },

        getVertices : function() {
            return [
                [
                    this.x - (this.height - this.radius),
                    this.y - (this.side / 2)
                ],
                [
                    this.x + this.radius,
                    this.y
                ],
                [
                    this.x - (this.height - this.radius),
                    this.y + (this.side / 2)
                ]
            ];

        }


    }

});