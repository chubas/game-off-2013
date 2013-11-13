Class('Game')({
    prototype : {

        width : 1000,
        height : 500,

        _dashStarted : null,
        _dashCooldownStarted : null,

        _playerActionCooldown : null,

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

            // TODO: Refactor upper as game variables
            var dashDuration = 30;
            var dashCooldown = 100;
            var playerSpeed = 5;

            setInterval(function() {
                var scrollSpeed = 1;
                game._ctx.clearRect(0, 0, game.width, game.height);
                game._sprites.forEach(function(sprite) {
                    game.player.draw(game._ctx);
                    sprite.draw(game._ctx);
                });

                if(game._dashStarted) {
                    if(game._dashStarted >= game._tick - dashDuration) {
                        console.log("Dashing!", game._tick);
                        scrollSpeed += 1;
                    } else {
                        game._dashCooldownStarted = game._tick;
                        game._dashStarted = null;
                        console.log("Dash ended", game._tick);
                    }
                }

                if(game._dashCooldownStarted) {
                    if(game._dashCooldownStarted >= game._tick - dashCooldown) {
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

                if(game.UP_PRESSED) {
                    game.player.y -= playerSpeed;
                }
                if(game.DOWN_PRESSED) {
                    game.player.y += playerSpeed;
                }

                if(game._playerActionCooldown) {
                    game._playerActionCooldown -= 1;
                }

                game._tick += 1;
            }, 10);
        },

        _dash : function() {
            if(this._dashStarted === null && this._dashCooldownStarted === null) {
                this._dashStarted = this._tick;
            }
        },

        addSprite : function(entity) {
            this._sprites.push(entity);
        },

        // Called generic player action in case the color changing mechanic
        // doesn't work.
        // Note to self: Try to not put the functionality in player unless the
        // mechanic is definitive. Save time refactoring that later.
        _playerAction : function() {
            // TODO: Refactor upper
            var playerActionCooldown = 40;
            var colors = ['blue', 'red', 'orange'];
            console.log("Player action!");
            if(!this._playerActionCooldown) {
                this._playerColorState = (this._playerColorState + 1) % colors.length;
                this.player.color = colors[this._playerColorState];
                this._playerActionCooldown = playerActionCooldown;
            }
        },

        _prepareKeyListeners : function() {
            var game = this;
            document.body.focus();

            document.body.addEventListener('keyup', function(event) {
                if(event.keyCode === 38) { // Up
                    game.UP_PRESSED = false;
                } 
                if(event.keyCode === 40) { // Down
                    game.DOWN_PRESSED = false;
                }
            });

            document.body.addEventListener('keydown', function(event) {
                if(event.keyCode === 38) { // Up
                    game.UP_PRESSED = true;
                } 
                if(event.keyCode === 40) { // Down
                    game.DOWN_PRESSED = true;
                }
                if(event.keyCode === 39) { // Right
                    game._dash();
                }
                if(event.keyCode === 37) { // Left
                    game._playerAction();
                }
            });

            game._playerColorState = 0;

        },

    }
});
