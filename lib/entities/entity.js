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

        init : function(config) {
            var enemy = this;

            Object.keys(config).forEach(function(key) {
                enemy[key] = config[key];
            });
        },

        move : function(deltaX, deltaY) {
            this.x += deltaX;
            this.y += deltaY;
        },

        rotate : function(degrees) {
            this.angle += degrees;
        },

        drawCenter : function(context) {
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(this.x, this.y, 2, 2 * Math.PI, false);
            context.fill();
        },

        toRad : function(degrees) {
            return degrees * Math.PI / 180;
        },

        toDeg : function(radians) {
            return radians * 180 / Math.PI;
        }

    }

});