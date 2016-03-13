'use strict';

/**
 * @ngdoc function
 * @name interfaceDesignerApp.directive:attributesInsert
 * @description
 * # attributesInsert
 * Directive to dynamically insert directives or other attributes into markup at template compile time
 * part of the interfaceDesignerApp
 */
angular.module('interfaceDesignerApp')
.directive('attributesInsert', [
  '$compile',
  function ($compile) {
    return {
      compile: function ($includeElement, $includeAttributes) {

        function makeAddAttribute ($targetElement) {
          return function ($targetElement, value, attribute) {
            var isNumber = angular.isNumber(attribute),
              attribute = isNumber ? value : attribute,
              value = isNumber ? '' : value,
              value = angular.isObject(value) ? JSON3.stringify(value) : value,
              segments;

            segments = splitPairs(attribute);

            if (segments && segments.length > 1) {
              attribute = segments[0];
              value = segments[1];
            }

            return $targetElement.attr(angular.isNumber(attribute) ? value : attribute, angular.isNumber(attribute) ? true : value);
          }.bind(this, $targetElement);
        }

        function splitPairs (attribute) {
          if (attribute.match(/(?:\:|\=)(?:\s)*/) != null) {
            return attribute.split(/(?:\:|\=)(?:\s)*/);
          }
        }

        function parseAttributes (element, options) {

            if ( angular.isString(options) ) {
              return parseAttributes(element, $.trim(options).split(' '));
            }

            if ( angular.isObject(options) && ! angular.isUndefined(options.attributes) ) {
              return parseAttributes(element, options.attributes);
            }

            angular.forEach(options, makeAddAttribute(element));
        }

        function compileWithAttributes (options) {
          var scope = options.scope,
            element = options.element;

          parseAttributes(element, { attributes: options.attributes });

          element.removeAttr('attributes-insert');

          var newElement = $compile(element)(scope);

          options.element = element.replaceWith(newElement);
        }

        return {
          pre: function ($targetScope, $targetElement, $targetAttrs) {
            // var attributesInsert = $targetAttrs.attributesInsert;

            $targetAttrs.$observe('attributesInsert', function () {
              
              var attributesInsert = $targetScope.$eval($targetAttrs.attributesInsert);

              compileWithAttributes({
                element: $targetElement,
                scope: $targetScope,
                attributes: attributesInsert || {}
              });

            });

            // compileWithAttributes({
            //   element: $targetElement,
            //   scope: $targetScope,
            //   attributes: $targetScope.$eval($targetAttrs.attributesInsert)
            // });
          },
          post: angular.noop
        };

      }
    };
  }
])