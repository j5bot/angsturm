(function (undefined) {

  'use strict';
  'be excellent to each other';

  /**
   * @ngdoc function
   * @name interfaceDesignerApp.directive:renderer
   * @description
   * # renderer
   * Directive to render a layout using simple box within a box markup and styling,
   * part of the interfaceDesignerApp
   */
  angular.module('interfaceDesignerApp')
  .directive('renderer', [

    'RecursionHelper',
    'AngsturmRenderer',

    function RendererDirectiveDefinition (

      RecursionHelper,
      AngsturmRenderer

    ) {

      return {

        restrict: 'EA',
        scope: true,
        compile: function ($templateElement, $templateAttributes) {
          return RecursionHelper.compile($templateElement, AngsturmRenderer);
        }

      };

    }

    ]
  );

}).call(this);
