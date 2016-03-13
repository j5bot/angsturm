'use strict';
angular.module('layout.services', [])
.factory('LayoutService', [

  '$q',

  'ApplicationResourceConfig',
  'ResourceServices',

  'Shared',

  function (

    $q,

    ApplicationResourceConfig,
    ResourceServices,

    Shared

  ) {

    var service = ResourceServices.createService('layouts', undefined, {
        type: 'api',
        application: 'interface-builder',
        version: 'v1',
        action: 'layouts',
        id: '@id',
        datatype: '' // '.json'
      });

    var layoutDeferred = $q.defer();

    var LayoutService = {

      layout: layoutDeferred.promise, // how to properly work with a remote active record
      layouts: service.query(),

      readyState: 0,

      get: function (id) {
        return service.get({ id: id });
      },

      update: function (item) {
        return service.update(item);
      },

      save: function (item) {
        return service.update(item);
      },

      load: function (id) {
        layoutDeferred = $q.defer();
        LayoutService.layout = layoutDeferred.promise;

        id = id === 'default' ? '-1' : id;

        var data = this.get(id);

        data.$promise.then(function (results) {
          layoutDeferred.resolve(results);
          angular.extend(LayoutService.layout, results);
        });

        return data;
      },

      getLayout: function () {
        // if ( ! LayoutService.layout.items ) {
        //   return LayoutService.load('default');
        // }
        return LayoutService.layout;
      }

    };

    return LayoutService;
  }
]);
