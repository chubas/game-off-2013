Controls = {};

Class(Controls, 'Slider').inherits(Widget)({

    HTML : '\
        <div>\
            <span class="label"></span>\
            <input type="range">\
        </div>',

    prototype : {
        init : function(config) {
            var slider = this;

            Widget.prototype.init.call(this, config);
            slider.element.attr({
                min : this.min,
                max : this.max,
                step : this.step,
                value : this.value
            });

            slider.element.find('.label').text(this.value);
            slider.element.find('input').on('change', function() {
                slider.element.find('.label').text($(this).val());
            });
        }
    }
});