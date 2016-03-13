'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('angsturm.services')
  .factory('AngsturmScope', [
    function () {

      function decorateScope (scope, properties, values) {
        var i = 0,
          isArray = angular.isArray(properties);

        // when we don't specify values, we're extending scope directly with eval'd properties
        if ( angular.isUndefined(values) ) {
          values = properties;
        }

        angular.forEach(properties, function (v, k) {
          var key = isArray ? v : k,
            value = values[key];

          if ( angular.isUndefined(value) ) {
            return;
          }
          if ( angular.isString(value) ) {
            value = scope.$eval(value);
          }
          if ( angular.isUndefined(value) ) {
            return;
          }
          scope[key] = value;
        });
      }

      return {
        decorate: decorateScope
      };
    }
  ]);

}).call(this);