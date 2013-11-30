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
            return [function(levelCallback) {
                levelEditor.load(levelToLoad);
                var onLoad = function(k) {
                    return function(event) {
                        var levelData = event.level;
                        // levelData.forEach(function(entity) {
                        //     entity.x += 100; 
                        // });
                        levelCallback([k, levelData]);
                    };
                };
                levelEditor.bind('level:load:success', onLoad(key));
            }, null];
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

            // this.tickStart = game._tick;
            game.bind('game:tick', function(data) {
                if(chunks[data.tick]) {
                    console.log("LOADING LEVEL INTO GAME!", data.tick);
                    game.load(chunks[data.tick]);
                    delete chunks[data.tick];
                }
            });

        }

    }


});