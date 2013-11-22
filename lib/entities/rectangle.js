Class('Rectangle').inherits(Entity)({
    prototype : {
        x : 800,
        y : 100,
        width : 20,
        height : 100,
        angle : 0,

        init : function(config) {
            Entity.prototype.init.call(this, config);
            var w = this.width / 2;
            var h = this.height / 2;
            this._r = Math.sqrt(w * w + h * h);
            this._c = Math.atan(h / w);
        },

        draw : function(context) {
            context.fillStyle = this.color;
            context.beginPath();

            var v = this.getVertices();

            context.moveTo(v[0][0], v[0][1]);
            context.lineTo(v[1][0], v[1][1]);
            context.lineTo(v[2][0], v[2][1]);
            context.lineTo(v[3][0], v[3][1]);
            context.closePath();
            context.fill();
            
            this._boundingBox = [
                Math.min(v[0][0], v[1][0], v[2][0], v[3][0]),
                Math.min(v[0][1], v[1][1], v[2][1], v[3][1]),
                Math.max(v[0][0], v[1][0], v[2][0], v[3][0]),
                Math.max(v[0][1], v[1][1], v[2][1], v[3][1])
            ];
            this._drawCenter(context);
            this._drawBoundingBox(context);
        },

        getVertices : function() {
            var x = this.x,
                y = this.y,
                a = this.toRad(this.angle),
                r = this._r,
                c = this._c;
            return [
                [
                    x + r * Math.cos(a + c),
                    y + r * Math.sin(a + c)
                ],
                [
                    x + r * Math.cos(a + Math.PI - c),
                    y + r * Math.sin(a + Math.PI - c)
                ],
                [
                    x + r * Math.cos(a + Math.PI + c),
                    y + r * Math.sin(a + Math.PI + c)
                ],
                [
                    x + r * Math.cos(a + (2 * Math.PI) - c),
                    y + r * Math.sin(a + (2 * Math.PI) - c)
                ]
            ];
        },

        getFullBoundingBox : function() {
            return this._boundingBox;
        },

        collidesWith : function(player) {
            if(this._dead) {
                return false;
            }

            var playerVertices = player.getVertices();
            var A = playerVertices[0],
                B = playerVertices[1],
                C = playerVertices[2];

            var rectVertices = this.getVertices();
            var Ra = rectVertices[0],
                Rb = rectVertices[1],
                Rc = rectVertices[2],
                Rd = rectVertices[3];

            var rectangleIsInside = Geom.isInsideTriangle(A, B, C, Ra) ||
                                    Geom.isInsideTriangle(A, B, C, Rb) ||
                                    Geom.isInsideTriangle(A, B, C, Rc) ||
                                    Geom.isInsideTriangle(A, B, C, Rd);

            if(rectangleIsInside) {
                return true;
            }

            // http://math.stackexchange.com/questions/190111/how-to-check-if-a-point-is-inside-a-rectangle
            // Raymond Manzoni's answer
            var isInsideSelf = function(P) {
                var AMxAB = Geom.cross([Ra, P ], [Ra, Rb]);
                var ABxAB = Geom.cross([Ra, Rb], [Ra, Rb]);
                var AMxAD = Geom.cross([Ra, P ], [Ra, Rd]);
                var ADxAD = Geom.cross([Ra, Rd], [Ra, Rd]);
                // P is inside iff (0 < AM x AB < AB x AB) &&
                //                 (0 < AM X AD < AD X AD)
                return (0 < AMxAB && AMxAB < ABxAB) &&
                        (0 < AMxAD && AMxAD < ADxAD);
            };

            return isInsideSelf(A) || isInsideSelf(B) || isInsideSelf(C);

        }
    }
});