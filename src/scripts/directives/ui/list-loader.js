'use strict';

(function (undefined) {

  angular.module('interfaceDesignerApp')
  .directive('listLoader', [

    'ContractsService',

    'AngsturmComposer',
    'AngsturmScope',
    'AngsturmMessages',

    function (

      ContractsService,

      Åcmp,
      Ås,
      Åmsg

    ) {

      return {

        restrict: 'E',
        scope: false,
        compile: function (templateElement, templateAttrs) {

          var methods = templateAttrs.methods;

          methods = methods ? methods.split(',') : ['query'];

          function itemTemplate (item) {
            var template = item.settings.component.composite.itemTemplate;
            return template ? template.value : 'views-component-empty.html';
          }

          return  {

            post: function ($scope, $element, $attrs) {

              console.log('registering listener');
              var methods = $attrs.methods, method;

              if ( ! angular.isUndefined(methods) ) {
                methods = methods.split(',');
              }

              function createContractService (event, data) {
                console.log('listened');

                var contractValue = $scope.componentSettings.contract.value,
                  contract = ContractsService.getContract(contractValue);

                if ( angular.isUndefined(contract) || angular.isUndefined(contract.service) ) {
                  console.log('can\'t get contract service');
                  return;
                }

                function onQueryFinish (items) {
                  angular.forEach(items, function (item) {
                    console.log(item);
                    item.aspects = $scope.item.settings.component.aspects;
                    Åcmp.recompose(item);
                  });
                }

                function onCountFinish (data) {
                  $scope.item.count = data.count;
                }

                for (var i = 0, l = methods.length; i < l; i++) {
                  method = methods[i];

                  switch(method) {
                    case 'query':
                      $scope.item.items = contract.service.query();
                      // decorate the items returned from the service with shortcut properties
                      $scope.item.items.$promise.then(onQueryFinish);
                      break;
                    case 'count':
                    case 'head':
                      $scope.item.count = contract.service.count();
                      $scope.item.count.$promise.then(onCountFinish);
                      break;
                  }
                }

                $scope.item.componentSettings = $scope.item.settings.component.settings;
                $scope.item.componentComposite = $scope.item.settings.component.composite;
                $scope.item.componentAspects = $scope.item.settings.component.aspects;
              }

              Ås.decorate($scope, {

                itemTemplate: itemTemplate.bind($scope, $scope.item)

              });

              createContractService();

              Åmsg.listen($scope, 'component:change', null, createContractService, '(this.item.id || model.id)');
              Åmsg.listen($scope, 'contract:change', null, createContractService, '(this.item.id || model.id)');
            }

          };

        }

      };

    }

  ]);

}).call(this);
