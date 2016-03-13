'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('interfaceDesignerApp')
  .constant('ContractAspects', [
    {
      interfaces: { 'aspect-data-endpoint': 'aspectDataEndpoint' },
      base: {
        'dataEndpoint': {}
      },
      terser: {
        'dataEndpoint': {
          order: 2,
          editType: 'service-driven-select',
          service: 'endpoints',
          property: 'data',
          populate: 'setting.options',
          options: []
        }
      },
      labels: {
        'dataEndpoint': { label: 'Endpoint' }
      }
    },
    {
      interfaces: { 'aspect-contract-options': 'aspectContractOptions' },
      base: {
        'contractLimit': {},
        'contractPaginate': {},
        'contractFilterExpression': {},
        'contractSortExpression': {}
      },
      terser: {
        'contractLimit': {
          order: 3,
          editType: 'number'
        },
        'contractPaginate': {
          order: 4,
          editType: 'checkbox'
        },
        'hasSort': {
          order: 5,
          editType: 'function-checkbox',
          toggleExpression: 'contractSortExpression.value'
        },
        'contractSortExpression': {
          order: 6,
          editType: 'textarea',
          toggleExpression: 'contractSortExpression.value'
        },
        'hasFilter': {
          order: 7,
          editType: 'function-checkbox',
          toggleExpression: 'contractFilterExpression.value'
        },
        'contractFilterExpression': {
          order: 8,
          editType: 'textarea',
          toggleExpression: 'contractFilterExpression.value'
        }
      },
      labels: {
        'contractLimit': { label: 'Results Limit' },
        'contractPaginate': { label: 'Paginate Results' },
        'contractFilterExpression': { label: 'Filter Expr.' },
        'contractSortExpression': { label: 'Sort Expr.' },
        'hasSort': { label: 'Sort' },
        'hasFilter': { label: 'Filter' }
      }
    }
  ])
  .directive('contractor', [

    '$timeout',

    'EndpointList',
    'ContractsService',
    'Shared',

    'AngsturmScope',
    'AngsturmComposer',
    'AngsturmMessages',

    function (

      $timeout,

      EndpointList,
      ContractsService,
      Shared,

      Ås,
      Åc,
      Åmsg

    ) {

      Shared.contractor = ContractsService;

      return {

        scope: true,
        templateUrl: 'views/contractor.html',

        link: function ($scope, $element, $attrs) {

          $scope.collapsed = false;
          $scope.$root.contractor = $scope.$root.contractor || ContractsService;

        },

        controller: function ($scope) {

          var sender;

          var ContractorController = {

            contractor: ContractsService,

            endpoints: EndpointList,

            template: function () {              
              if ( angular.isUndefined(this.setting) || angular.isUndefined(this.setting.editType) ) {
                return '';
              }
              return 'views-contractors-' + this.setting.editType + '.html';
            },
          
            compose: function (selected) {

              var $scope = this,
                model = angular.extend(
                selected,
                { aspects: { 'aspect-contract': { 'class': 'contract' } } }
              );

              Åc.compose(
                model
              );
              Åc.order(model, 'ordered', 'order');

              this.contractor.contract = model;

              $timeout(function () {
                $scope.$apply();
              }, 0);

            },

            reloadContracts: function ($data) {
              ContractorController.contractor.contracts = ContractsService.refresh();
            },

            insertContract: function () {
              ContractsService.add('New', 'New', ContractorController.reloadContracts);
            },

            updateContract: function ($data) {            
              ContractsService.update(ContractsService.contract);
            },

            removeContract: function (value) {
              ContractsService.remove(value);
            },

            sender: function (msg) {
              if ( ! sender ) {
                sender = Åmsg.createSender($scope, 'contractor:dataEndpoint');
              }
            }

          };

          angular.extend(ContractorController, ContractsService);

          Ås.decorate($scope,
            ContractorController
          );

        }

      };

    }

  ])
  .directive('contractorItem', [

    'AngsturmScope',

    function (

      Ås

    ) {

      return {
        scope: true,
        restrict: 'E',
        require: '^contractor',
        compile: function () {

          return {
            post: function ($scope, $element, $attrs, ctrl) {

              $scope.$watch($attrs.item, function (n,o) {
  
                Ås.decorate($scope, ['item','setting','value'], $attrs);

              }, false);

            }
          };

        }

      };

    }

  ]);

}).call(this);