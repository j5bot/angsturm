'use strict';

(function (undefined) {

  var root = this;

  function reflow (e) {
    //$(e.target).foundation('reflow');
    $('.foundation-reflowable .range-slider').not(':hidden').foundation('reflow');
  }

  angular.module('interfaceDesignerApp')
  .directive('foundationToggle', [

    function () {

      return {

        link: function ($scope, $element, $target) {

          $element.on('click', reflow);

        }

      };

    }

  ]);

}).call(this);