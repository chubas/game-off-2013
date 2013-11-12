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

            var circleEnemy = new Circle({
                x : 600,
                y : 200,
                radius : 30
            });
            this.addSprite(circleEnemy);

            var triangleEnemy = new Triangle({
                x      : 400,
                y      : 300,
                radius : 30
            });
            var rotator = new Rotator({
                target : triangleEnemy,
                speed : 2
            });
            this.addSprite(rotator);

            var rectangleEnemy = new Rectangle({
                x : 800,
                y : 100,
                width : 20,
                height : 100,
            });
            var swinger = new Swinger({
                target : rectangleEnemy,
                speed : 2,
                radius : 180,
                angle : 90 // Vertical
            });
            this.addSprite(swinger);

            var squareEnemy = new Rectangle({
                x : 900,
                y : 200,
                width : 40,
                height : 40
            });
            var rotSquare = new Rotator({
                target : squareEnemy,
                speed : 3
            });
            var swingSquare = new Swinger({
                target : rotSquare,
                radius : 200,
                speed : 2,
                angle : 45
            });
            this.addSprite(swingSquare);

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
                    sprite.move(-scrollSpeed, 0);
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

