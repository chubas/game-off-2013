Class('Game').includes(TimeLapseSupport)({

    prototype : {

        width : 1000,
        height : 500,

        _sprites : null, // Array of enemy sprites
        _cooldownTimers : null, // Object of countdowns for cooldown timers

        _speedIncrease : 0,

        init : function(settingsObject) {
            this.settings = settingsObject;

            this.canvas = document.getElementById('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this._ctx = this.canvas.getContext('2d');

            this._sprites = [];

            this.prepareTimers();

            this.gamepad = new Gamepad();
            if(this.gamepad.init()){
                console.log("xbox360 DPAD support enabled bitcheees!!!! :D");
            }

            var scrollingX = 0;
        },

        loadLevel : function(levelConfig) {
            var game = this;
            levelConfig.enemies.forEach(function(enemy) {
                game.addSprite(game._parseEnemy(enemy));
            });
        },

        _parseEnemy : function(enemy) {
            var game = this;
            switch(enemy[0]) {
                case 'CIR' :
                    return new Circle({
                        x : enemy[1],
                        y : enemy[2],
                        radius : enemy[3]
                    });
                case 'TRI' :
                    return new Triangle({
                        x : enemy[1],
                        y : enemy[2],
                        radius : enemy[3]
                    });
                case 'REC' :
                    return new Rectangle({
                        x : enemy[1],
                        y : enemy[2],
                        width : enemy[3],
                        height : enemy[4]
                    });
                case 'ROT' :
                    return new Rotator({
                        speed : enemy[1],
                        target : game._parseEnemy(enemy[2])
                    });
                case 'SWI' :
                    return new Swinger({
                        speed : enemy[1],
                        radius : enemy[2],
                        angle : enemy[3],
                        target : game._parseEnemy(enemy[4])
                    });
                default :
                    throw("Unparseable enemy");
            }
        },

        run : function() {
            var game = this;
            this._prepareKeyListeners();

            this.player = new Player();

            game._tick = 0;

            // TODO: Optimize game loop and determine ideal speed
            // http://www.playmycode.com/blog/2011/08/building-a-game-mainloop-in-javascript/
            var fps = 100;
            setInterval(game._mainLoop.bind(game), 1000 / fps);

        },

        _mainLoop : function() {
            var game = this;
            var scrollSpeed = game.settings.scrollSpeed;
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

            this.gamepad.bind(Gamepad.Event.BUTTON_UP, function(event) {
                if(event.control === "DPAD_UP") { // Up
                    game.UP_PRESSED = false;
                }
                if(event.control === "DPAD_DOWN") { // Down
                    game.DOWN_PRESSED = false;
                }

            });

            this.gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(event) {
                if(event.control === "DPAD_UP") { // Up
                    game.UP_PRESSED = true;
                }
                if(event.control === "DPAD_DOWN") { // Down
                    game.DOWN_PRESSED = true;
                }
                if(event.control === "DPAD_RIGHT") { // Right
                    game._dash();
                }
                if(event.control === "DPAD_LEFT") { // Left
                    game._playerAction();
                }

            });


            game._playerColorState = 0;

        },

    }
});
