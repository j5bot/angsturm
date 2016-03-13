'use strict';

/**
 * @ngdoc function
 * @name interfaceDesignerApp.directive:aspects
 * @description
 * # aspects
 * Directives which decorate interface builder layout elements with behaviors, etc.
 * part of the interfaceDesignerApp
 */
(function (undefined) {

  var root = this,

    INFORM_EXPRESSION = '!!(item.settings.{{ expression }})',
    ATTR_EXPRESSION = 'item.settings.{ expression }';

  function aspectAttributes (Aspects, name, $scope, $element) {
    var aspectAttrs = Aspects.attributes[angular.element.camelCase(name)];

    angular.forEach(aspectAttrs, function (attribute, property) {

      var value = $scope.$eval(ATTR_EXPRESSION.replace('{ expression }', attribute.valueExpression));
      if ( angular.isUndefined(value) ) {
        return;
      }
      $element.attr(attribute.attribute, value);

    });
  }

  angular.module('interfaceDesignerApp')
  .directive('aspectBackground', [
    function () {
      return {
        restrict: 'A',
        priority: 50,
        controller: 'AngsturmCSSFactory', // provides link functions for css directive stuffs
        scope: false,
        compile: function () {
          return {
            pre: function ($scope, $element, $attrs, ÅCSSFactory) {
              var bgLinker = ÅCSSFactory.getLinker('background');             

              bgLinker.call($scope, { scope: $scope, element: $element, attrs: $attrs,
                factory: ÅCSSFactory });
            }
          };
        }
      };
    }
  ])
  .directive('aspects', [

    '$injector',

    'AngsturmAlias',

    function (

      $injector,

      Ålias

    ) {

      // var aspects = Ålias.alias('aspects', {
      //   name: 'aspects',
      //   sources: [
      //     { directive: 'attributes-insert', attribute: 'componentAttributes()' }
      //   ]
      // });

      // return aspects;

      var attributesInsert = $injector.get('attributesInsertDirective');
          var pres = [], posts = [];

      function execute (fns, $scope, $element, $attrs) {
        var context = this;

        angular.forEach(fns, function (fn, index) {
          fn.call(context, $scope, $element, $attrs);
        });
      }

      var execPres = execute.bind(this, pres),
        execPosts = execute.bind(this, posts);

      return {
        compile: function (tElement, tAttributes) {

          angular.forEach(attributesInsert, function (directive, index) {
            var compile = directive.compile(tElement, tAttributes);
            pres.push(compile.pre);
            posts.push(compile.post);
          });

          tAttributes.$attr.attributesInsert = 'attributes-insert';
          tAttributes.attributesInsert = 'componentAttributes()';

          tElement.attr('attributes-insert', 'componentAttributes()');

          tAttributes.$attr.aspects = null;
          tAttributes.aspects = null;

          tElement.removeAttr('aspects');

          return {

            pre: execPres,
            post: execPosts

          };

          // return attributesInsert.compile(tElement, tAttributes);
          // {
          //   pre: angular.noop()
          //   // pre: function ($scope, $element, $attrs) {

              
          //   // }
          // };
        }
      };

    }

  ])
  .directive('aspectBordered', [
    function () {
      return {
        restrict: 'A',
        priority: 50,
        controller: 'AngsturmCSSFactory', // provides link functions for css directive stuffs
        scope: false,
        compile: function () {
          return {
            pre: function ($scope, $element, $attrs, ÅCSSFactory) {
              var cssLinker = ÅCSSFactory.getLinker('border');              

              cssLinker.call($scope, { scope: $scope, element: $element, attrs: $attrs,
                factory: ÅCSSFactory });
            }
          };
        }
      };
    }
  ])
  .directive('aspectForeground', [
    function () {
      return {
        restrict: 'A',
        priority: 50,
        controller: 'AngsturmCSSFactory', // provides link functions for css directive stuffs
        scope: false,
        compile: function () {
          return {
            pre: function ($scope, $element, $attrs, ÅCSSFactory) {
              var bgLinker = ÅCSSFactory.getLinker('foreground');             

              bgLinker.call($scope, { scope: $scope, element: $element, attrs: $attrs,
                factory: ÅCSSFactory });
            }
          };
        }
      };
    }
  ])
  .directive('aspectPadded', [
    function () {
      return {
        restrict: 'A',
        priority: 50,
        controller: 'AngsturmCSSFactory', // provides link functions for css directive stuffs
        scope: false,
        compile: function () {
          return {
            pre: function ($scope, $element, $attrs, ÅCSSFactory) {
              var bgLinker = ÅCSSFactory.getLinker('padding');             

              bgLinker.call($scope, { scope: $scope, element: $element, attrs: $attrs,
                factory: ÅCSSFactory });
            }
          };
        }
      };
    }
  ])
  .directive('aspectShadowed', [
    function () {
      return {
        restrict: 'A',
        priority: 50,
        controller: 'AngsturmCSSFactory', // provides link functions for css directive stuffs
        scope: false,
        compile: function () {
          return {
            pre: function ($scope, $element, $attrs, ÅCSSFactory) {
              var cssLinker = ÅCSSFactory.getLinker('shadow');              

              cssLinker.call($scope, { scope: $scope, element: $element, attrs: $attrs,
                factory: ÅCSSFactory });
            }
          };
        }
      };
    }
  ])
  .directive('aspectLayout', [

    'Aspects',
    'AngsturmMessages',

    function (

      Aspects,
      Åmsg

    ) {
      console.log('initializing aspect-layout');
      return {
        scope: false,
        link: function ($scope, $element, $attrs) {

          aspectAttributes(Aspects, 'aspect-layout', $scope, $element);

          Åmsg.listen($scope, 'component:change', 'layout', function (event, data) {
            aspectAttributes(Aspects, 'aspect-layout', $scope, $element);
          }, 'this.item.id');

        }
      };
    }
  ])
  .directive('aspectContainer', [
    function () {
      return {
        link: function ($scope, $element, $attrs) {
          $element.attr('container','');
        }
      };
    }
  ])
  .directive('aspectRow', [
    function () {
      return {
        link: function ($scope, $element, $attrs) {
          $element.attr('row','');
        }
      };
    }
  ])
  .directive('aspectColumn', [
    function () {
      console.log('initializing aspect-column');
      return {
        link: function ($scope, $element, $attrs) {
          $element.attr('column','');
        }
      };
    }
  ])

  .directive('aspectContractConsumer', [

    'ContractsService',
    'AngsturmScope',

    function (

      ContractsService,
      Ås

    ) {

      return {

        compile: function (templateElement, templateAttrs) {

          return {
            pre: function ($scope, $element, $attrs) {

              var cid = $scope.componentSettings.contract.value,
                contract = ContractsService.getContract(cid);

              Ås.decorate($scope, {

                count: 10

              });

            }
          };

        }

      };

    }

  ])
  .directive('aspectListCount', [

    function () {

      return {

        link: function ($scope, $element, $attrs) {

          var settings = $scope.item.settings.component.settings;

          if (settings.showListCount.value === true) {

            angular.forEach(Object.keys(settings), function (setting, index) {

              if (setting.indexOf('Text') !== -1) {
                $scope[setting] = $scope[setting] || {};
                $scope[setting].value = settings[setting].value + ' ({{ item.count }})';
              }

            });
            
          }

        }
 
      };

    }

  ]);

}).call(this);