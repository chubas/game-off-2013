// Generic enemy. The entity system works by defining the geometrical shape
// of the sprite, an x and y coordinates (the center), and the properties they
// need to define, in terms of an angle (support rotation by default). Their
// x, y and angle can be changed by external behaviors, so they need to render
// based on those parameters
Class('Entity')({

    prototype : {

        // All overrideable properties (pass them in config at init)
        draw : function(context) {},
        x : 0,
        y : 0,
        angle : 0,
        relativeSpeed : 1,

        init : function(config) {
            var enemy = this;

            Object.keys(config).forEach(function(key) {
                enemy[key] = config[key];
            });

            if(this.damaging) {
                this.color = Game.ENEMY_COLOR;
            } else {
                this.color = Game.FACTIONS[this.faction];
            }
        },

        move : function(deltaX, deltaY) {
            this.x += deltaX; //(Math.sin(this.angle) * this.speed);
            this.y += deltaY; //(Math.cos(this.angle) * this.speed);
        },

        rotate : function(degrees) {
            this.angle += degrees;
        },

        die : function() {
            if(this._dead) {
                return;
            }
            this._dead = true;
            this.draw = function() {};
            this.color = new Color(this.color).setValue(20).desaturateBy(20).toHTML();
        },

        _drawCenter : function(context) {
            if(!window.DEBUG) {
                return;
            }
            context.fillStyle = 'white';
            context.beginPath();
            context.arc(this.x, this.y, 2, 2 * Math.PI, false);
            context.fill();
        },

        _drawBoundingBox : function(context) {
            if(!window.DEBUG) {
                return;
            }
            var boundBox = this.getFullBoundingBox();
            var x0 = boundBox[0],
                y0 = boundBox[1],
                x1 = boundBox[2],
                y1 = boundBox[3];
            context.beginPath();
            context.strokeStyle = '#300';
            context.lineWidth = 1;
            context.moveTo(x0, y0);
            context.lineTo(x0, y1);
            context.lineTo(x1, y1);
            context.lineTo(x1, y0);
            context.closePath();
            context.stroke();
        },

        toRad : function(degrees) {
            return degrees * Math.PI / 180;
        },

        toDeg : function(radians) {
            return radians * 180 / Math.PI;
        }

    }

});