'use strict';

(function (undefined) {
  
  angular.module('aspects.aspects')
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
          property: 'options',
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
          editType: 'textarea'
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
  ]);

}).call(this);