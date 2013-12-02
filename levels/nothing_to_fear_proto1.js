({
    enemies : (function() {
        var totalEntities = [];

        // Start making these variable, they will change
        var game_w = 1000;
        var game_h = 500;

        var beat = 100; // Distance equals to a beat in the song

        var motiffSpeed = 2;

        /******** Intro, and main motiff along the game **********/
        var motiff = function(initialX, reverse) {
            var speed = motiffSpeed;
            var wave = [];
            var width = 40;
            // var padding = 10;
            var yPadding = 100;
            var swingerHeight = game.height - yPadding;
            for(var i = 0; i < 4; i++) {
                var index = reverse ? 3 - i : i;
                var position = reverse ? (4 - i) / 4: i / 4;
                wave.push(
                    ["SWI", 6, swingerHeight, 90, position,
                        ["CIR",
                            initialX + (i * beat * speed),
                            yPadding / 2,
                            40,
                            speed,
                            i
                    ]]
                );
                // wave.push([
                //     "CIR",
                //     // "REC",
                //     initialX + (i * beat * speed),
                //     ((game_h / 4) * index) + (game_h / 8),
                //     // width,
                //     (game_h / 8) - padding,
                //     // (game_h / 4) - (2 * padding),
                //     speed,
                //     i
                // ]);
            }
            return wave;
        };
        /*******/

        var startX = 970;
        var i;
        var motiffLoop = function(initialBeat) {
            var i = initialBeat;
            for(; i < initialBeat + 4; i++) {
                totalEntities = totalEntities.concat(
                    motiff(startX + (4 * i * beat * motiffSpeed), i % 2 !== 1)
                );
            }
            for(; i < initialBeat + 8; i++) {
                totalEntities = totalEntities.concat(
                    // motiff(startX + (4 * i * beat * motiffSpeed), i % 4 < 2)
                    motiff(startX + (4 * i * beat * motiffSpeed), i % 2 !== 0)
                );
            }
        };
        motiffLoop(0);
        motiffLoop(8);
        motiffLoop(16);

        console.log(totalEntities.slice(0, 4));
        return totalEntities;

    })()
})