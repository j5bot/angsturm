'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('angsturm.services')
  .constant('CONTRACT_INTERFACES', {
    'aspect-data-endpoint': 'aspectDataEndpoint',
    'aspect-contract': [ 'aspect-data-endpoint', 'aspect-contract-options' ]
  })
  .constant('CONTRACT_TEMPLATE', {

  })
  .service('ContractsService', [

    'ApplicationResourceConfig',
    'Aspects',

    'ResourceServices',

    'Shared',

    'ContractAspects',
    'CONTRACT_INTERFACES',

    'AngsturmComposer',

    function (

      ApplicationResourceConfig,
      Aspects,

      ResourceServices,

      Shared,

      ContractAspects,
      CONTRACT_INTERFACES,

      Åc

    ) {

      var service = ResourceServices.createService('contractor', undefined, {
          type: 'api',
          application: 'interface-builder',
          version: 'v1',
          action: 'contractor',
          id: '@id',
          datatype: '' // .json'
        });

      angular.extend(Aspects.interfaces, CONTRACT_INTERFACES);

      var Contract = {

        init: function () {
          if ( angular.isUndefined(this.settings) || angular.isUndefined(this.settings.dataEndpoint) ) {
            return;
          }

          var endpoint = this.settings.dataEndpoint.value;

          var service = ResourceServices.createService(endpoint.service, undefined,
              angular.extend({}, ApplicationResourceConfig,
              {
                action: endpoint.action
              })
            );

          angular.extend(this, service);
        
          this.service = service;
        }

      };

      var ContractService = {

        contract: {},

        contracts: service.query(),

        refresh: function () {
          this.contracts = service.query();
          this.contracts.$promise.then(updateContracts);
          return this.contracts;
        },

        add: function (label, title, callback) {
          return service.saveNew({
            value: Math.floor(Math.random() * 5000),
            label: label,
            title: title
          }).then(callback);
        },

        update: function (item) {

          return service.update(item);

          /* var decomposed = Åc.decompose(item);

          item.$save().then(function (response) {

            if ( ! item.id ) {
              item.id = response.id;
            }

          }); */
        },

        remove: function (item) {
          service.remove(item);
        },

        getContract: function (value) {
          var contract,
            contracts = this.contracts.filter(function (v) {
              return v.value === value;
            });

          if (contracts.length === 0) {
            return;
          }

          contract = Object.create(contracts[0]);
          angular.extend(contract, Contract);
          contract.init();

          return contract;
        }

      };

      var updateContracts = function () {
        Aspects.terser.aspectContractConsumer.contract.options = ContractService.contracts;
      };

      updateContracts();

      return ContractService;

    }

  ]);

}).call(this);