'use strict';

(function (undefined) {

  var root = this;

  /**
   * @ngdoc service
   * @name commonApp.service:Shared
   * @description
   * # Shared
   * Service to provide a shared data storage object
   */
  angular.module('commonApp.services')

  .factory('Shared', function(){

    return {}; // SRG - just an empty object, will be filled with data by clients of the service! 4/19/14h

  });

}).call(this);
