// This class should be Level, but it is named TrackLevel since the level object
// in previous code should be refactored to the name 'Chunk' or similar, but it
// sticked. Rename until previous references are cleared
Class('TrackLevel')({

    // Config object example:
    //   levels : {
    //     0 : 'construct1.json',
    //     1 : 'construct2.js',
    //     2 : 'level3.json'
    //   }
    build : function(config, callback) {
        // Levels is in format:
        // 
        var levels = config.levels;

        var keys = Object.keys(levels);
        var levelEditor = config.levelEditor;

        var levelLoaders = keys.map(function(key) {
            var levelToLoad = levels[key];

            var load = function(levelCallback) {
                levelEditor.load(levelToLoad, function(event) {
                    var levelData = event.level;
                    // levelData.forEach(function(entity) {
                        //     entity.x += 100;
                    // });
                    levelCallback([key, levelData]);
                });
            };
            return [load, null];
        });
        Util.cookArray(levelLoaders, function(arrayOfChunkPairs) {
            var chunks = {};
            arrayOfChunkPairs.forEach(function(pair) {
                chunks[pair[0]] = pair[1];
            });
            config.chunks = chunks;
            var trackLevel = new TrackLevel(config);
            if(callback) {
                callback.call(trackLevel);
            }
        });

    },

    prototype : {

        init : function(config) {
            var game = config.game;
            var chunks = config.chunks;

            var song = config.song;

            var musicLoadHandler = function(event) {
                game.bind('game:tick', function(data) {
                    if(chunks[data.tick]) {
                        console.log("LOADING LEVEL INTO GAME!", data.tick);
                        game.load(chunks[data.tick]);
                        delete chunks[data.tick];
                    }
                });

                var instance = createjs.Sound.play("bgMusic", 'none', 2000);
                // play using id.  Could also use full sourcepath or event.src
                // instance.addEventListener("complete", createjs.proxy(function(){}, this));
                // instance.volume = 0.5;

                window.bgMusic = instance;
                // this.tickStart = game._tick;
                game._tick = 0;

                // Approximation for converting real time to ticks
                // instance.addEventListener('succeeded', function() {
                //     // Fast forward for testing
                //     var jumpTo = 28 * 1000; // 34 seconds
                //     console.log("Setting position", jumpTo);
                //     game._tick = Math.round(
                //         (jumpTo / 33.7) + 60
                //     );
                //     console.log("Game tick got to", game._tick);
                //     game._sprites = [];
                //     window.bgMusic.setPosition(jumpTo);
                // });

            };
            createjs.Sound.addEventListener("fileload", createjs.proxy(musicLoadHandler, this) );
            createjs.Sound.registerSound(song, "bgMusic");


        }

    }


});