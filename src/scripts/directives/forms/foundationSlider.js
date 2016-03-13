'use strict';

(function (undefined) {
  
  angular.module('interfaceDesignerApp')
  .directive('foundationSlider', [

    '$interpolate',
    'Shared',

    function (

      $interpolate,
      Shared

    ) {

      var OPTIONS_TEMPLATE = 'start: {{ start }}; end: {{ end }}; step: {{ step }};',
        optionsGenerator = $interpolate(OPTIONS_TEMPLATE);

      function prepSlider($scope, $element, $slider, expr, value, options) {

        var previousValue = $slider.attr('data-slider');

        if ( value === previousValue ) {
          return;
        }

        $slider
          .attr('data-expr', expr)
          .attr('data-slider', value)
          .attr('data-options', options);

        $element.foundation();

        $element.off('change.fndtn.slider');

        $element.on('change.fndtn.slider', function (e) {
          sliderOnChange($scope, e);
        });
      }

      function sliderOnChange($scope, e) {

        var $slider = $(e.target),
          data = $slider.attr('data-slider'),
          expr = $slider.attr('data-expr'),
          currentValue = $scope.$eval(expr);

        if ( currentValue === data ) {
          return;
        }
        
        $scope.$eval(expr + '=' + data);

      }

      return {
        scope: true,

        link: function ($scope, $element, $attrs, controller) {

          var $slider = $('.range-slider', $element),
            sliderSettings = $scope.$eval($attrs.foundationSlider),
            watch = sliderSettings.watch,
            options = sliderSettings.options,
            currentValue = options.value,
            expr = options.expression,

            previousValue;

          $scope.$watch(watch, function (n,o) {

            var sliderSettings = $scope.$eval($attrs.foundationSlider),
              options = sliderSettings.options,


              value = $scope.$eval(options.expr) || options.default,
              attrValue = $slider.attr('data-slider');

            console.log(
              'previousValue: ' + previousValue + '\n',
              'value: ' + value + '\n',
              'attrValue: ' + attrValue + '\n'
            );

            if ( angular.isUndefined(previousValue) ) {
              previousValue = value;
            }

            if ( !angular.isUndefined(attrValue) || value === attrValue ) {
              return;
            }

            prepSlider($scope, $element, $slider, expr, value, optionsGenerator(options));

          }, true);

        }

      };

    }

  ]);

}).call(this);