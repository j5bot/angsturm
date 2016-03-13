'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('interfaceDesignerApp')
  .directive('remarkable', [

    'AngsturmScope',

    function (

      Ås

    ) {

      var remarkable = new Remarkable('full');

      function markdown(event, data) {
        var $scope = this;
        
        console.log($scope.value);

        $scope.value.compiled.value = remarkable.render($scope.value.source.value);
      }

      return {

        link: function ($scope, $element, $attrs) {

          Ås.decorate($scope, {
            markdown: markdown.bind($scope)
          });

        }

      };

    }

  ]);

}).call(this);