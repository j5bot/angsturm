'use strict';

(function (undefined) {
  
  var root = this;

  // TODO: combine with renderer?
  angular.module('commonApp.directives')
  .directive('dynamic', [

    '$compile', '$interpolate', '$templateCache', 'RecursionHelper',

    'AngsturmMessages',

    function (

      $compile, $interpolate, $templateCache, RecursionHelper,

      Åmsg

    ) {

      var dynamicTemplate = '<{{ type }}{{ attributes }}>{{ content }}</{{ type }}>',
        emptyContentRE = /<span(?:[^>]*)><\/span>/mig;

      function attributesToString (attributes) {
        var attrs = [];
        angular.forEach(attributes, function (value, attribute) {
          attrs.push(' ' + attribute + '="' + value + '"');
        });
        return attrs.join('');
      }

      function contains (expression, string) {
        return string && string.indexOf(expression) !== -1;
      }

      function getContent (options) {
        var element = options.templateElement;

        return processExpression( options.attrs.content ||
          (element && element.html && element.html()),
          options.scope
        );

      }

      function processExpression (expression, $scope) {
        var startSymbol = $interpolate.startSymbol();

        while ( contains(startSymbol, expression) ) {
          expression = $interpolate( expression )( $scope );
        }

        try {
          expression = $scope.$eval(expression) || expression;
        } catch (e) {}

        return expression;
      }

      function compileAndReplaceElement (options) {
        var scope = options.scope,
          element = options.element,
          attrs = options.attrs;

        options.templateElement = $($templateCache.get(scope.componentTemplate(scope.item)));

        var type = processExpression( attrs.type, scope ),
          content = getContent(options),
          attributes = processExpression( attrs.attributes, scope ),

          dynamicElement;

        if ( content.indexOf('></') !== -1 || contains('.', type) ||
          angular.isUndefined(type) ||
            angular.isUndefined(content) ||
              (content.length === 0) ||
                emptyContentRE.test(content)
        ) {
          return;
        }

        //console.log(emptyContentRE + '/' + emptyContentRE.test(content));

        if ( emptyContentRE.test(content) !== false ) {
          return;
        }

        dynamicElement = $($interpolate(dynamicTemplate)({
          type: type,
          content: content,
          attributes: attributesToString(attributes)
        }));

        element.replaceWith(
          $compile( dynamicElement )( scope )
        );

        options.element = dynamicElement;

        return;
      }
    
      return {
        restrict: 'E',
        scope: true,
        controller: 'DynamicController',
        compile: function ($tE, $tA) {

          return RecursionHelper.compile($tE,
            {
              pre: function link ( scope, element, attrs, controller) {
                var options = {
                    scope: scope,
                    element: element,
                    attrs: attrs
                  };

                console.log(options.scope.item.settings.component);

                compileAndReplaceElement(options);

                Åmsg.listen(scope, 'component:change', 'dynamic', function (event, data) {
                  
                  console.log('dynamic');
                  console.log(options.scope.item.settings.component);
                  compileAndReplaceElement(options);

                }, 'this.item.id');

              }
            }
          );

        }
      };

    }
  ]);

}).call(this);