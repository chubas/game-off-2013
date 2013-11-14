Class('Game').includes(TimeLapseSupport)({
    prototype : {

        width : 1000,
        height : 500,

        _sprites : null, // Array of enemy sprites
        _cooldownTimers : null, // Object of countdowns for cooldown timers

        _speedIncrease : 0,

        // CONFIGURABLE PROPERTIES SECTION
        /// confGameFrameRate : 10 (Need to refactor for this to change dynamically)
        /// conf

        init : function(settingsObject) {
            this.settings = settingsObject;

            var canvas = document.getElementById('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this._ctx = canvas.getContext('2d');

            this._sprites = [];

            this.prepareTimers();

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

                if(game._dashing) {
                    scrollSpeed += game.settings.dashSpeed;
                }

                // Scroll advance
                game.scrollX += scrollSpeed;
                game._sprites.forEach(function(sprite) {
                    sprite.move(-scrollSpeed, 0);
                });

                if(game.UP_PRESSED) {
                    game.player.y -= game.settings.playerSpeed;
                }
                if(game.DOWN_PRESSED) {
                    game.player.y += game.settings.playerSpeed;
                }

                if(game._playerActionCooldown) {
                    game._playerActionCooldown -= 1;
                }

                game.manageTemporalActions();
                game._tick += 1;
            }, 10);
        },

        _dash : function() {
            var game = this;
            this.addCooldownableAction('dash', {
                onTick : function(currentTick) {
                    game._dashing = currentTick !== 0;
                },
                duration : game.settings.dashDuration
            }, game.settings.dashCooldown);
        },

        addSprite : function(entity) {
            this._sprites.push(entity);
        },

        // Called generic player action in case the color changing mechanic
        // doesn't work.
        // Note to self: Try to not put the functionality in player unless the
        // mechanic is definitive. Save time refactoring that later.
        _playerAction : function() {
            if(!this._playerActionCooldown) {
                this._playerColorState = (this._playerColorState + 1) % Player.COLORS.length;
                this.player.color = Player.COLORS[this._playerColorState];
                this._playerActionCooldown = this.settings.playerActionCooldown;
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
