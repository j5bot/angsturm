'use strict';

(function (undefined) {

  angular.module('interfaceDesignerApp')
  .directive('serviceDrivenSelect', [

    'ResourceServices',
    'ApplicationResourceConfig',
    'AngsturmMessages',

    function (

      ResourceServices,
      ApplicationResourceConfig,
      Åmsg

    ) {

      return {

        compile: function ($scope) {

          return {

            pre: function ($scope, $element, $attrs) {

              var serviceName = $attrs.service,
                populate = $attrs.populate,
                action = $attrs.action,

                settingName = $scope.setting._Åname,

                service = $scope.service = ResourceServices.createService(
                  serviceName,  // name
                  undefined,    // pattern
                  angular.extend(
                    {},
                    ApplicationResourceConfig,
                    {             // defaults
                      action: action
                    }),
                  []
                );

              function updateSelect (event, data) {
                $scope.item.composite[settingName][populate] = service.query();
              }

              updateSelect();

              Åmsg.listen($scope, serviceName + ':' + settingName,
                null, updateSelect, '(this.item.id || model.id');

            }

          };

        }

      };

    }

  ])

}).call(this);
