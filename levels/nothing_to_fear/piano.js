({
    enemies : (function() {
        var totalEntities = [];

        // Start making these variable, they will change

        var game_w = 1000;
        var game_h = 500;

        var beat = 235; // Distance equals to a beat in the song
        var chordBeat = 300;

        var startX = 1400;
        var motiff = function(initialX, index) {
            var construct = [];
            var radius = 40
            var reverse = index % 2 === 1;
            var angles = reverse ? [180, 135, 90] : [180, 225, 270];
            var y = reverse ? 40 : game_h - 40;
            angles.forEach(function(angle, i) {
                if(index === 3) {
                    totalEntities.push(
                        ["PRO", 2 - 0.8 * (2 - index), angle,
                            ["TRI", initialX + 140, y, radius, angle, 1.2, i]]

                    );
                } else {
                    totalEntities.push(
                        ["PRO", 2 + 0.7 * (2 - index), angle,
                            ["TRI", initialX, y, radius, angle, 1.2, i]]

                    );
                }
            });
            return construct;
        };

        var chord = function(initialX) {
            var construct = [];
            construct.push(
                ["PUL", 0.5, 30, 80, 0,
                    ["CIR", initialX, 250, 30, 1.5, 3]]
            );
            return construct;
        }

        

        // /******** Intro, and main motiff along the game **********/
        // var motiff = function(initialX, reverse) {
        //     var speed = motiffSpeed;
        //     var wave = [];
        //     var width = 40;
        //     var padding = 10;
        //     for(var i = 0; i < 8; i++) {
        //         var index = reverse ? 3 - i : i;
        //         wave.push([
        //             "ROT", 4, [
        //                 "TRI",
        //                 initialX + (i * 30),
        //                 250,
        //                 // ((game_h / 4) * index) + (game_h / 8),
        //                 30,
        //                 speed,
        //                 1
        //             ]
        //         ]);
        //     }
        //     return wave;
        // };
        // /*******/

        for(i = 0; i < 4; i++) {
            totalEntities = totalEntities.concat(
                motiff(
                    startX + (4 * i * beat),
                    i
                )
            );
            totalEntities = totalEntities.concat(
                chord(
                    startX + (4 * i * chordBeat) - 500
                )
            );
        }
        return totalEntities;

    })()
})