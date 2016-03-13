/* global loadImage */
'use strict';

/**
 * @ngdoc function
 * @name fileLoader
 * @description
 * # commonApp:forms:fileLoader
 *
 * Directive which provides for loading files into data URIs from local file system
 */
(function (undefined) {

  var root = this;

  angular.module('commonApp.directives')
  .directive('fileLoader', [

    '$timeout',

    function ($timeout) {

      return {
        scope: false,
        link: function ($scope, $element, $attrs) {

          // var options = $scope.$eval($attrs.fileLoader);

          function onChange (e, data) {

            $.each(data.files, function (index, file) {
              console.log(file.name);

              loadImage(file,
                function (canvas) {

                  if ( ! (canvas && canvas) ) {
                    return;
                  }

                  var setting = $scope.setting,
                    value = $scope.value;

                  value.value = canvas.toDataURL();
                  value.name = file.name;
                  
                  $timeout(function () { $scope.$apply(); }, 0);
                },
                {
                  canvas: true
                }
              );

            });
          }

          $element.addClass('fileinput-button');
          $element.fileupload({

            canvas: true,

            drop: onChange,
            change: onChange

          });

        }

      };

    }

  ]);

}).call(this);