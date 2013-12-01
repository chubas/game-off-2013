({
    enemies : (function() {
        var totalEntities = [];

        // Start making these variable, they will change
        var game_w = 1000;
        var game_h = 500;

        var beat = 100; // Distance equals to a beat in the song

        var motiffSpeed = 6;

        var startX = 1000;
        var angles = [180, 225, 270];
        angle.forEach(function(angle) {
            totalEntities.push(
                ["PRO", 2, angle,
                    ["TRI", startX, 20, 20, 50, angle, 2, 0]]
            );
        });
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

        // for(i = 0; i < 8; i++) {
        //     totalEntities = totalEntities.concat(
        //         motiff(startX + (4 * i * beat * motiffSpeed), i % 2 !== 0)
        //     );
        // }
        return totalEntities;

    })()
})