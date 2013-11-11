Class('Game')({
    prototype : {

        width : 1000,
        height : 500,

        _dashStarted : null,
        _dashCooldownStarted : null,

        init : function() {
            this.over = false;

            var canvas = document.getElementById('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this._ctx = canvas.getContext('2d');

            this._sprites = [];

            var scrollingX = 0;
        },

        run : function() {
            var game = this;
            this._prepareKeyListeners();

            this.player = new Player();

            var circleEnemy = new Enemy({
                x : 600,
                y : 200,
                draw : function(context) {
                    var radius = 30;
                    context.fillStyle = 'red';
                    context.beginPath();
                    context.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
                    context.fill();
                }
            });
            this.addSprite(circleEnemy);

            var triangleEnemy = new Enemy({
                x : 400,
                y : 300,
                angle : 0,
                radius : 30,
                speed : 1, // Degrees per tick

                draw : function(context) {
                    var r = this.radius,
                        a = this.angle * Math.PI / 180, // Convert to radians
                        x = this.x,
                        y = this.y; // Only for easier writing of the formulaes
                    var _120deg = 2 * Math.PI / 3;
                    context.fillStyle = 'blue';
                    context.beginPath();
                    context.moveTo(
                        x + (r * Math.cos(a)),
                        y + (r * Math.sin(a))
                    );
                    context.lineTo(
                        x + (r * Math.cos(a + _120deg)),
                        y + (r * Math.sin(a + _120deg))
                    );
                    context.lineTo(
                        x + (r * Math.cos(a - _120deg)),
                        y + (r * Math.sin(a - _120deg))
                    );
                    context.closePath();
                    context.fill();

                    this.angle = (this.angle + this.speed) % 360;
                }
            });
            this.addSprite(triangleEnemy);

            var rectangleEnemy = new Enemy({
                x : 800,
                y : 100,
                width : 20,
                height : 100,
                moverHeight : 200,
                moverSpeed : 1,

                _moverY : 0,
                _moverDirection : 'down',

                draw : function(context) {
                    var relY = this.y + this._moverY;
                    context.fillStyle = 'orange';
                    context.beginPath();
                    context.rect(this.x, relY, this.width, this.height);
                    context.fill();
                    // Prepare _moverDirection for next frame
                    if(this._moverDirection === 'down') {
                        if(this._moverY + this.moverSpeed > this.moverHeight) {
                            // this._moverY stays
                            this._moverDirection = 'up';
                        } else {
                            this._moverY = this._moverY + this.moverSpeed;
                        }
                    } else {
                        if(this._moverY < this.moverSpeed) {
                            this._moverDirection = 'down';
                        } else {
                            this._moverY = this._moverY - this.moverSpeed;
                        }
                    }
                }
            });
            this.addSprite(rectangleEnemy);

            game._tick = 0;
            setInterval(function() {
                var scrollSpeed = 1;
                game._ctx.clearRect(0, 0, game.width, game.height);
                game._sprites.forEach(function(sprite) {
                    game.player.draw(game._ctx);
                    sprite.draw(game._ctx);
                });

                if(game._dashStarted) {
                    if(game._dashStarted >= game._tick - 40) {
                        console.log("Dashing!", game._tick);
                        scrollSpeed += 1;
                    } else {
                        game._dashCooldownStarted = game._tick;
                        game._dashStarted = null;
                        console.log("Dash ended", game._tick);
                    }
                }

                if(game._dashCooldownStarted) {
                    if(game._dashCooldownStarted >= game._tick - 100) {
                        console.log("Cooling down");
                    } else {
                        game._dashCooldownStarted = null;
                        console.log("Cooldown ended", game._tick);
                    }
                }

                // Scroll advance
                game.scrollX += scrollSpeed;
                game._sprites.forEach(function(sprite) {
                    sprite.x -= scrollSpeed;
                });

                game._tick += 1;
            }, 10);
        },

        _dash : function() {
            if(this._dashStarted === null && this._dashCooldownStarted === null) {
                console.log("Ticking!")
                this._dashStarted = this._tick;
            }
        },

        addSprite : function(entity) {
            this._sprites.push(entity);
        },

        _prepareKeyListeners : function() {
            var game = this;
            document.body.focus();
            var speed = 3;
            document.body.addEventListener('keydown', function(event) {
                if(event.keyCode === 38) { // Up
                    console.log("Up");
                    game.player.y -= speed;
                } 
                if(event.keyCode === 40) { // Down
                    game.player.y += speed;
                    console.log("Down");
                }
                if(event.keyCode === 37 || event.keyCode === 39) { // Left or right
                    console.log("Dash button!")
                    game._dash();
                }
                // game._keyDown(event.keyCode);
            });
        },

    }
});

Class('Player')({
    prototype : {
        init : function() {
            this.x = 20;
            this.y = 230;
        },

        draw : function(context) {
            context.fillStyle = 'green';
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x + 40, this.y + 20);
            context.lineTo(this.x, this.y + 40);
            context.closePath();
            context.fill();
        }
    }
});

Class('Enemy')({

    prototype : {

        // All overrideable properties (pass them in config at init)
        draw : function(context) {},
        x : 0,
        y : 0,

        init : function(config) {
            var enemy = this;

            Object.keys(config).forEach(function(key) {
                enemy[key] = config[key];
            });
        },

    }

});