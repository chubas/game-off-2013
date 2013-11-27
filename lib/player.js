Class('Player')({

    prototype : {

        init : function(config) {
            this.x = config.position.x;
            this.y = config.position.y;
            this.radius = config.radius;
            this.side = Math.round(this.radius * 3 / Math.sqrt(3));
            this.height = Math.round(this.side * Math.sqrt(3) / 2);
            this.faction = 0;
            this.color = Game.FACTIONS[this.faction];
        },

        switchFaction : function() {
            this.faction = (this.faction + 1) % Game.FACTIONS.length;
            this.color = Game.FACTIONS[this.faction];
        },

        kills : function(entity) {
            return this.faction === entity.faction;
        },

        draw : function(context) {
            // var color = new Chameleon(this.color).iluminateBy(20).toHTML();
            // var color = new Chameleon(this.color).obscureBy(20).toHTML();
            // context.shadowBlur = 100;
            // context.shadowColor = color;
    
            // context.fillStyle = pFill;

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
            context.shadowBlur = 0;
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