Controls = {};

Class(Controls, 'Slider').inherits(Widget)({

    HTML : '\
        <div>\
            <div class="info">\
                <span class="description"></span>\
                <span class="label"></span>\
            </div>\
            <input type="range">\
        </div>',

    ELEMENT_CLASS : 'slider',

    prototype : {
        init : function(config) {
            var slider = this;

            Widget.prototype.init.call(this, config);
            this.inputElement = slider.element.find('input');

            slider.inputElement.attr({
                min : this.min,
                max : this.max,
                step : this.step,
                value : this.value
            });

            slider.element.find('.label').text(this.value);
            slider.inputElement.on('change', function() {
                slider.element.find('.label').text($(this).val());
            });
        },

        bindValue : function(target, property) {
            var slider = this;
            this.element.find('.description').text(property);
            slider.inputElement.on('change', function() {
                target[property] = parseInt($(this).val(), 10);
            });
            return this;
        }

    }
});