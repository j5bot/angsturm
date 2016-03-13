'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('angsturm.controllers')
  .controller('DynamicController', [

    '$scope', 'ContentService',
    'AngsturmMessages',

    function (

      $scope, ContentService,
      Åmsg

    ) {

      var content = ContentService.getContent(),
        sender = Åmsg.createSender($scope, 'content:change', 'dynamic');

      function onContentChange () {
        sender();
      }

      return {
        onContentChange: onContentChange
      };

    }

  ]);

}).call(this);