Class('LevelEditor').inherits(Widget)({

    HTML : '\
        <div>\
            <div class="filename-prompt">\
                <input type="text" value="default.json">\
            </div>\
            <div class="submit">\
                <input type="button" value="Load">\
            </div>\
        </div>\
    ',

    ELEMENT_CLASS : 'level-editor',

    prototype : {

        init : function(config) {
            var editor = this;
            Widget.prototype.init.call(editor, config);
            editor.inputElement = editor.element.find('.filename-prompt input');
            editor.submitElement = editor.element.find('.submit input');
            editor.submitElement.click(function() {
                editor.restart();
            });
        },

        restart : function() {
            console.log("Restarting...");
            this.load(this.inputElement.val());
        },

        load : function(filename, callback) {
            if(filename.match(/json$/)) {
                this._loadJson(filename, callback);
            } else {
                this._loadCode(filename, callback);
            }
        },

        _loadJson : function(filename, callback) {
            var editor = this;
            $.ajax({
                url : '/game-off-2013/levels/' + filename,
                dataType : 'json',
                success : function(data) {
                    console.log("Evaluating level", filename);
                    var level = editor._parseEnemyData(data);
                    editor.dispatch('level:load:success', { level : level });
                    if(callback) {
                        callback({ level : level });
                    }
                },
                error : function() {
                    console.log("Error loading level", arguments);
                    editor.dispatch('level:load:error');
                },
                complete : function() {
                    editor.dispatch('level:load:complete');
                }
            });
        },

        _loadCode : function(filename, callback) {
            var editor = this;
            $.ajax({
                url : '/game-off-2013/levels/' + filename,
                success : function(data) {
                    // console.log("Loaded level", data);
                    console.log("Evaluating level", filename);
                    var level = editor._parseEnemyData(eval(data));
                    editor.dispatch('level:load:success', { level : level });
                    if(callback) {
                        callback({ level : level });
                    }
                },
                error : function() {
                    console.log("Error loading level", arguments);
                    editor.dispatch('level:load:error');
                },
                complete : function() {
                    console.log("Load complete");
                    editor.dispatch('level:load:complete');
                }
            });
        },

        _parseEnemyData : function(data) {
            var editor = this;
            var parsedEnemies = data.enemies.map(function(enemy) {
                return editor._parseEnemy(enemy);
            });
            // console.warn("Better format would be a json, with a spec. Keep it simple");
            return {
                enemies : parsedEnemies
            };
        },

        _parseEnemy : function(enemy) {
            var editor = this;
            switch(enemy[0]) {
                case 'CIR' :
                    return new Circle({
                        x : enemy[1],
                        y : enemy[2],
                        radius : enemy[3],
                        relativeSpeed : enemy[4],
                        faction : enemy[5] || 0,
                        damaging : enemy[6] || false
                    });
                case 'TRI' :
                    return new Triangle({
                        x : enemy[1],
                        y : enemy[2],
                        radius : enemy[3],
                        angle : enemy[4] || 0,
                        relativeSpeed : enemy[5] || 1,
                        faction : enemy[6] || 0,
                        damaging : enemy[7] || false
                    });
                case 'REC' :
                    return new Rectangle({
                        x : enemy[1],
                        y : enemy[2],
                        width : enemy[3],
                        height : enemy[4],
                        relativeSpeed : enemy[5],
                        faction : enemy[6] || 0,
                        damaging : enemy[7] || false
                    });
                case 'ROT' :
                    return new Rotator({
                        speed : enemy[1],
                        target : editor._parseEnemy(enemy[2])
                    });
                case 'SWI' :
                    return new Swinger({
                        speed : enemy[1],
                        radius : enemy[2],
                        angle : enemy[3],
                        initialPosition : enemy[4] || 0,
                        target : editor._parseEnemy(enemy[5])
                    });
                case 'EXT' :
                    return new Extensor({
                        radius : enemy[1],
                        angle : enemy[2],
                        target : editor._parseEnemy(enemy[3])
                    });
                case 'PUL' :
                    return new Pulsator({
                        speed : enemy[1],
                        minRadius : enemy[2],
                        maxRadius : enemy[3],
                        initialPosition : enemy[4] || 0,
                        target : editor._parseEnemy(enemy[5])
                    });
                case 'PRO' :
                    return new Projectile({
                        speed : enemy[1],
                        angle : enemy[2],
                        target : editor._parseEnemy(enemy[3])
                    });
                default :
                    throw("Unparseable enemy");
            }

            return data;
        }

    }

});