'use strict';

(function (undefined) {

  var root = this;

  angular.module('commonApp.directives')

  // TODO: MOVE TO INSPECTOR?
  .directive('watchFields', [

    'AngsturmMessages',

    function (

      Åmsg

    ) {

      return {
        scope: true,
        link: function ($scope, $element, $attrs) {

          var watchOptions = $scope.$eval($attrs.watchFields),
            channel = watchOptions.channel || 'component:change';

          $element.on('change', 'input, select, textarea', function (e) {
            // send a notice of update
            Åmsg.send($scope, channel, 'watch-fields', $scope.$eval($attrs.watchFields).model);
          });

        }
      };

    }

  ])
  .directive('aspectComponent', [

    '$compile',
    '$templateCache',

    'Aspects',

    'AngsturmScope',

    function (
      
      $compile,
      $templateCache,

      Aspects,

      Ås

    ) {

      function componentTemplate () {
        var setting,
          componentType =
            (setting = (this.item && this.item.settings)) &&
              (setting = setting.componentType) &&
                  setting.value;

        if ( angular.isUndefined(componentType) ) {
          return 'views-component-empty.html';
        }
        return 'views-component-' + componentType + '.html';
      }

      function componentAspects (asAttributes) {
        var aspects = this.item && this.item.settings &&
          this.item.settings.component && this.item.settings.component.aspects;

        if ( angular.isUndefined(aspects) ) {
          return asAttributes ? '' : [];
        }

        return asAttributes ? Aspects.asAttributes(aspects) : aspects;
      }

      var AspectComponent = {
        componentTemplate: componentTemplate,
        componentAttributes: function () { return componentAspects.call(this, true); }
      };

      var TEMPLATE_URL_TEMPLATE = 'views-component-{{ aspect }}.html';

      return {
        scope: true,
        templateUrl: 'views-aspect-component.html',
        compile: function (compileElement, compileAttrs, transclude) {

          return {
            pre: function (templateScope, templateElement, templateAttrs) {

              if ( ! templateScope.item.settings ) {
                templateScope.item.settings = {};
              }
              if ( ! templateScope.item.settings.component ) {
                templateScope.item.settings.component = {};
              }
              if ( ! templateScope.item.settings.component.settings ) {
                templateScope.item.settings.component.settings = {};
              }

              templateScope.$watch('this.item.settings.component.settings', function (n,o) {

                if ( angular.isUndefined(n) ) {
                  return;
                }

                templateScope.compositeComponent = templateScope.item.settings.component.composite;
                templateScope.componentSettings = n;

              }, true);

              templateScope.$watch('this.item.settings.component.aspects', function (n,o) {

                console.log(templateElement);

                if ( angular.isUndefined(n) ) {
                  return;
                }

                templateScope.componentAspects = n;

              }, true);

              Ås.decorate(templateScope,
                AspectComponent
              );
              
            }
            
          };

        }

      };

    }
  ]);

}).call(this);