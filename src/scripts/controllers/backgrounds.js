'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('interfaceDesignerApp')
  .controller('Backgrounds', [

    '$http',
    '$scope',

    function (

      $http,
      $scope

    ) {

      function addBackgroundImages (data, status, headers, config) {
        $scope.backgroundImages = data.images;
      }

      $http.get('data/bg.json')
        .success(addBackgroundImages);

    }

  ]);

}).call(this);