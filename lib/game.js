window.PALETTES = [
    ['#CFF09E', '#0B486B', '#AD344C', '#3B8686', '#662A44'],
    ['#EEFFA7', '#1170A6', '#AD344C', '#3B8686', '#662A44'],
    ['#EEFFA7', '#1170A6', '#AD344C', '#4D9961'],
    ['#8CFB3D', '#1E78FF', '#FF1E3D']
];

var palette = PALETTES[2]; // We may be settling on 4 colors...

Class('Game').includes(TimeLapseSupport, CustomEventSupport)({

    FPS : 30,

    FACTIONS : palette,

    ENEMY_COLOR : '#FFFFFF',

    prototype : {

        width : 1000,
        height : 500,
        score : 0,
        scoreElement : null,

        _sprites : null, // Array of enemy sprites
        _cooldownTimers : null, // Object of countdowns for cooldown timers

        _speedIncrease : 0,

        _gridColor : '#111111',

        init : function(settingsObject) {
            this.settings = settingsObject;

            this.canvas = document.getElementById('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this._ctx = this.canvas.getContext('2d');

            this.setup();

            this.playerX = 80;
            this.playerDashDistance = 100;
            this.playerRadius = 30;

            this.scoreElement = $('#score');
            this.chainElement = $('#chain');
            this.chainPoints = 0;
            this.maxChainPoints = 100;
            this.chainStops = [];
            var p = 0;
            this.chainLevels = 5;
            for(var i = 0; i < this.chainLevels - 1; i++) {
                // Calculate stops on the log scale
                p = p + (1/3) * (1 - p);
                this.chainStops.push(p);
            }
            console.log(this.chainStops);
            this.chainMultiplierElement = $('#chain-multiplier');
            this.chainScoreMultiplier = 1;
        },

        load : function(levelConfig) {
            var game = this;
            this.levelConfig = levelConfig;
            levelConfig.enemies.forEach(function(enemy) {
                game._sprites.push(enemy);
            });
        },

        run : function() {
            var game = this;

            this.player = new Player({
                position : {
                    x : game.playerX,
                    y : 250
                },
                radius : game.playerRadius
            });

            game._tick = 0;

            // TODO: Optimize game loop and determine ideal speed
            // http://www.playmycode.com/blog/2011/08/building-a-game-mainloop-in-javascript/
            this.interval = window.setInterval(
                game._mainLoop.bind(game),
                1000 / Game.FPS
            );
        },

        pause : function() {
            this.paused = window.clearInterval(this.interval);
        },

        unpause : function() {
            this.paused = null;
            this.interval = window.setInterval(
                game._mainLoop.bind(game),
                1000 / FPS
            );
        },

        restart : function(level) {
            this.clear();
            this.loadLevel(level);
        },

        // Must be only run once, at initialization. This holds permanent
        // events, like input bindings
        setup : function() {
            this.prepareTimers();
            this._prepareKeyListeners();
            this._sprites = [];
        },

        clear : function() {
            this.prepareTimers();
            this.DOWN_PRESSED = false;
            this.UP_PRESSED = false;
            this._dashing = false;
            this._sprites = [];
        },

        _softCollide : function(sprite1, sprite2) {
            var box1 = sprite1.getFullBoundingBox(),
                box2 = sprite2.getFullBoundingBox();

            // See https://gist.github.com/chubas/0352361c0954baf95eab for
            // non minimized method
            var overlapsX = (box1[0] < box2[2] && box2[0] < box1[2]) ||
                           (box1[0] >= box2[2] && box1[0] < box2[2]);
            var overlapsY = (box1[1] < box2[3] && box2[1] < box1[3]) ||
                           (box1[1] >= box2[3] && box1[1] < box2[3]);

            return overlapsX && overlapsY;
        },

        _hardCollide : function(player, sprite) {
            return sprite.collidesWith(player);
        },

        _mainLoop : function() {
            var game = this;
            var scrollSpeed = game.settings.scrollSpeed;

            game._ctx.clearRect(0, 0, game.width, game.height);

            // Now background is given in function of the player color
            game._ctx.fillStyle = new Color(game.player.color).setValue(5).toHTML();


            game._ctx.fillRect(0, 0, game.width, game.height);
            game.draining = false;
            game.chainElement.css('background-color', '#057D9F');

            if(window.DEBUG) {
                game._drawGrid();
            }

            game.player.draw(game._ctx);
            var currentPlayerBoundingBox = game.player.getFullBoundingBox();
            game._sprites.forEach(function(sprite, index) {
                if(sprite.x > game.width + 100) { // TODO: Do it well
                    return; // Skip these
                }

                // Check for soft collision with the player
                sprite.draw(game._ctx);
                if(game._softCollide(game.player, sprite)) {
                    if(game._hardCollide(game.player, sprite)) {
                        // if(game._dashing && game.player.kills(sprite)) {
                        if(sprite.damaging) {
                            // Enemy dies to a damaging enemy.
                            if(!sprite._dead) {
                                if(!window.DEBUG) {
                                    console.log("GAME OVER");
                                    game.dispatch('game:lose');
                                }
                            }
                        } else if(game.player.kills(sprite)) {
                            // Killing an enemy -> i.e. scoring by matching the enemy color
                            game._increaseScore();
                            sprite.die();
                            game.chainPoints = Math.min(game.maxChainPoints, game.chainPoints + 20);
                        } else {
                            // Draining -> i.e. colliding with an object of different color
                            console.log("MISSED!");
                            game.draining = true;
                            game.chainElement.css('background-color', '#025167');
                            game.chainPoints = Math.max(0, game.chainPoints - 5);
                        }
                    }
                }
            });

            // if(game._dashing) {
            //     scrollSpeed += game.settings.dashSpeed;
            // }

            // Scroll advance
            game.scrollX += scrollSpeed;
            game._sprites.forEach(function(sprite) {
                sprite.move(-scrollSpeed * sprite.relativeSpeed, 0);
            });

            game._sprites = game._sprites.filter(function(sprite) {
                return sprite.x > -100; // TODO: Do it well
            });

            var northBound = game.player.side / 2;
            var southBound = game.height - (game.player.side / 2);
            if(game.UP_PRESSED) {
                if(game.player.y >= northBound) {
                    game.player.y -= game.settings.playerSpeed;
                    game.player.y = Math.max(game.player.y, northBound);
                }
            }

            if(game.DOWN_PRESSED) {
                if(game.player.y <= southBound) {
                    game.player.y += game.settings.playerSpeed;
                    game.player.y = Math.min(game.player.y, southBound);
                }
            }

            if(this.chainPoints > 0) {
                this.chainPoints -= 1;
            }

            var mul = 0;
            var chainPointsPercentage = game.chainPoints / game.maxChainPoints;
            while(game.chainStops[mul] < chainPointsPercentage) {
                mul++;
            }

            game.chainScoreMultiplier = 1 + mul;

            game._drawScore();
            game._drawChainPoints();

            if(game._playerActionCooldown) {
                game._playerActionCooldown -= 1;
            }

            game.manageTemporalActions();
            game._tick += 1;
            game.dispatch('game:tick', {
                tick : game._tick
            });
        },

        _drawGrid : function() {
            var game = this;
            var context = this._ctx,
                space = 20;
            var i;
            context.strokeStyle = game._gridColor;
            for(i = 0; i < game.width; i = i + space) {
                context.beginPath();
                context.moveTo(i, 0);
                context.lineTo(i, game.height);
                context.stroke();
            }

            for (i = 0; i < game.height; i = i + space) {
                context.moveTo(0, i);
                context.lineTo(game.width, i);
                context.stroke();
            }
        },

        _dash : function() {
            var game = this;
            this.addCooldownableAction('dash', {
                onTick : function(currentTick, totalTicks) {
                    //game.player.x = game.playerX;
                    //console.log("Total, current", totalTicks, currentTick);
                    game.player.x = game.playerX + (game.playerDashDistance *
                        (1 - (currentTick / totalTicks)));
                    game._dashing = currentTick !== 0;
                },
                duration : game.settings.dashDuration,
            }, game.settings.dashCooldown, function(currentTick, totalTicks) {
                    game.player.x = game.playerX + (game.playerDashDistance *
                        (currentTick / totalTicks));
            });
        },

        // Called generic player action in case the color changing mechanic
        // doesn't work.
        // Note to self: Try to not put the functionality in player unless the
        // mechanic is definitive. Save time refactoring that later.
        _playerAction : function() {
            if(!this._playerActionCooldown) {
                this.player.switchFaction();
                this.bgcolor = new Chameleon(this.player.color).obscureBy(10).toHTML();

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

            this.gamepad = new Gamepad();
            if(this.gamepad.init()){
                console.log("xbox360 DPAD support enabled bitcheees!!!! :D");
            }

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

        },

        _increaseScore : function _increaseScore() {
            console.log("SCORE UP!");
            this.score = this.score + (1 * this.chainScoreMultiplier);
                // The 1 is redundant, but left as if it could be a variable for
                // using ridiculously large scores a la MvC2
        },

        _drawScore : function(context) {
            this.scoreElement.html(this.score);
        },

        _drawChainPoints : function(context) {
            this.chainElement.css('width', this.chainPoints + '%');
            this.chainMultiplierElement.text('x' + this.chainScoreMultiplier);
        }


    }
});
