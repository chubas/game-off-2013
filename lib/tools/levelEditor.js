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

        load : function(filename) {
            if(filename.match(/json$/)) {
                this._loadJson(filename);
            } else {
                this._loadCode(filename);
            }
        },

        _loadJson : function(filename) {
            var editor = this;
            $.ajax({
                url : '/levels/' + filename,
                dataType : 'json',
                success : function(data) {
                    editor.dispatch('level:load:success', {
                        level : editor._parseEnemyData(data)
                    });
                },
                error : function() {
                    console.log("Error", arguments);
                    editor.dispatch('level:load:error');
                },
                complete : function() {
                    editor.dispatch('level:load:complete');
                }
            });
        },

        _loadCode : function(filename) {
            var editor = this;
            $.ajax({
                url : '/levels/' + filename,
                success : function(data) {
                    editor.dispatch('level:load:success', {
                        level : editor._parseEnemyData(eval(data))
                    });
                },
                error : function() {
                    editor.dispatch('level:load:error');
                },
                complete : function() {
                    editor.dispatch('level:load:complete');
                }
            });
        },

        _parseEnemyData : function(data) {
            var editor = this;
            data.enemies = data.enemies.map(function(enemy) {
                return editor._parseEnemy(enemy);
            });
            // Fuck it, change it in place.
            return data;
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
                        faction : 0
                    });
                case 'TRI' :
                    return new Triangle({
                        x : enemy[1],
                        y : enemy[2],
                        radius : enemy[3],
                        relativeSpeed : enemy[4],
                        faction : 1
                    });
                case 'REC' :
                    return new Rectangle({
                        x : enemy[1],
                        y : enemy[2],
                        width : enemy[3],
                        height : enemy[4],
                        relativeSpeed : enemy[5],
                        faction : 2
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
                        target : editor._parseEnemy(enemy[4])
                    });
                case 'EXT' :
                    return new Extensor({
                        radius : enemy[1],
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