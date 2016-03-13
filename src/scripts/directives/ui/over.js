'use strict';

/**
 * @ngdoc function
 * @name interfaceDesignerApp.directive:ui.over
 * @description
 * # ui-over
 * Directive to modify scope 'over' property on mouseenter/mouseleave
 * part of the interfaceDesignerApp
 */
angular.module('interfaceDesignerApp')

.directive('uiOver',
  [
    function () {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
          
          var overScope = $scope[$attrs.uiOver] || $scope;

          angular.extend(overScope, {
            over: false
          });

          $element.on('mouseover', function (event) {
            overScope.over = true;
            $scope.$apply();
            event.stopPropagation();
          });
          $element.on('mouseout', function (event) {
            overScope.over = false;
            $scope.$apply();
            event.stopPropagation();
          });
        }
      };
    }
  ]
);