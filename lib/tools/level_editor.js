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
            var editor = this;
            $.ajax({
                url : '/levels/' + filename,
                dataType : 'json',
                success : function(data) {
                    editor.dispatch('level:load:success', {
                        level : data
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

    }

});