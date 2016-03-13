/* globals JSON3 */

'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('angsturm.services')
  .factory('AngsturmCompiler', [

    '$compile', '$interpolate',
    '$templateCache',
    'RecursionHelper',

    'Aspects',

    function (

      $compile, $interpolate,
      $templateCache,
      RecursionHelper,

      Aspects

    ) {

      var dynamicTemplate = '<{{ type }}{{ attributes }}>{{ content }}</{{ type }}>',
        emptyContentRE = /<span(?:[^>]*)><\/span>/mig;
        
      function contains (expression, string) {
        return string && string.length && string.indexOf(expression) !== -1;
      }

      function getContent (scope) {
        var template = scope.template,
          attrs = scope.attrs || {};

        return processExpression( attrs.content ||
          (template && template.html && template.html()) || '',
          scope
        );
      }

      function processExpression (expression, $scope) {
        var startSymbol = $interpolate.startSymbol(),
          endSymbol = $interpolate.endSymbol();

        if ( ! ( contains(startSymbol, expression) && contains(endSymbol, expression) ) ) {
          return expression;
        }

        $scope = $scope || this;

        while ( contains(startSymbol, expression) ) {
          expression = $interpolate( expression )( $scope );
        }

        try {
          expression = $scope.$eval(expression) || expression;
        } catch (e) {}

        return expression;
      }

      function compile(scope, options) {
        var node = scope[scope.nodeProperty],
          children = scope[scope.childrenProperty],
          aspects = node && node.aspects,
          element = scope.element,
          template = scope.template,

          attrs = processExpression(scope.attrs, scope),
          type = processExpression(attrs.type, scope),
          content = getContent(scope), // we need either compiled content or the un-interpolated expression

          compiledElement,

          attrString = Aspects.asAttributes(aspects); // attributesToString(aspects);

        console.log('attributes:', attrString);

        options = options || {};

        // if we have a specified type, then we're going to override the
        // template and create a whole new element
        if ( ! (angular.isUndefined(type) || type === 'type') ) {
          template = dynamicTemplate;
        }

        compiledElement = $($interpolate(template)(angular.extend({

          type: type,
          content: content,
          attrs: attrString

        }, options.locals)));

        // compiledElement.attr('aspects','true');

        return $compile( compiledElement)( scope );
      }

      function compileAndReplaceElement (scope, options) {
        console.log('replacing...');

        scope.element = options.element || scope.element;
        scope.template = options.template || scope.template;
        scope.attrs = options.attrs || scope.attrs;

        var element = scope.element,
          compiledElement = this.compile(scope, options);

        angular.forEach(element.attributes, function (v, a) {
          compiledElement.attr(a, v);
        });

        element.replaceWith(compiledElement);
        // element.append(compiledElement);

        options.element = scope.element = compiledElement;
      
      }

      return {
        compile: compile,
        compileAndReplace: compileAndReplaceElement,
        process: processExpression
      };

    }

  ]);

}).call(this);